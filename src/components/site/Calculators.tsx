import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Rocket,
  GraduationCap,
  Heart,
  Plane,
  Car,
  Home,
  TrendingUp,
  Target,
  Clock,
  Wallet,
  Calculator as CalcIcon,
  BarChart3,
  PieChart as PieIcon,
  AlertCircle,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { fmtINR, fmtNum } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// ---------- shared inputs ----------
function NumberInput({
  value,
  onChange,
  min = 0,
  max = 1e15,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div className="flex items-center rounded-xl border border-border bg-white">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        className="px-3 py-2.5 text-navy hover:text-teal"
        aria-label="Decrease"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        className="w-full bg-transparent px-1 py-2 text-center text-sm font-semibold text-navy outline-none"
      />
      {suffix && <span className="pr-2 text-xs text-muted-foreground">{suffix}</span>}
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        className="px-3 py-2.5 text-navy hover:text-teal"
        aria-label="Increase"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "%",
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ip-slider"
        style={{ "--val": `${pct}%` } as React.CSSProperties}
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>
          {min}
          {suffix}
        </span>
        <span className="font-semibold text-navy">
          {value}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-navy">{label}</label>
      {children}
    </div>
  );
}

function ResultCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border-l-4 border-teal bg-white p-6 shadow-card ring-1 ring-border">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Big({
  label,
  value,
  tone = "navy",
}: {
  label: string;
  value: string;
  tone?: "navy" | "red" | "green";
}) {
  const c = tone === "red" ? "text-destructive" : tone === "green" ? "text-success" : "text-navy";
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-display text-3xl md:text-4xl ${c}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "red" | "green" }) {
  const c = tone === "red" ? "text-destructive" : tone === "green" ? "text-success" : "text-navy";
  return (
    <div className="flex justify-between border-b border-border/60 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${c ?? "text-navy"}`}>{value}</span>
    </div>
  );
}

// ---------- math ----------
const INFLATION_RET = 0.06;
const YEARS_IN_RETIREMENT = 25;

function fvLumpsum(pv: number, rate: number, years: number) {
  return pv * Math.pow(1 + rate, years);
}
// FV of SIP at end of period (monthly compounding)
function fvSip(sip: number, annualRate: number, years: number) {
  const i = annualRate / 12;
  const n = years * 12;
  if (i === 0) return sip * n;
  return sip * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}
// PMT (monthly) needed to reach FV in n years at annual rate
function sipForFv(fv: number, annualRate: number, years: number) {
  const i = annualRate / 12;
  const n = years * 12;
  if (n <= 0) return fv;
  if (i === 0) return fv / n;
  return fv / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}
function pvAnnuity(payment: number, rate: number, years: number) {
  if (rate === 0) return payment * years;
  return (payment * (1 - Math.pow(1 + rate, -years))) / rate;
}

// ---------- Goal calculator (shared shape) ----------
function GoalCalc({
  defaultCost,
  defaultInflation = 8,
  defaultYears = 10,
  costLabel = "Cost Today",
}: {
  defaultCost: number;
  defaultInflation?: number;
  defaultYears?: number;
  costLabel?: string;
}) {
  const [years, setYears] = useState(defaultYears);
  const [cost, setCost] = useState(defaultCost);
  const [inflation, setInflation] = useState(defaultInflation);
  const [returns, setReturns] = useState(12);
  const [growth, setGrowth] = useState(0);
  const [existing, setExisting] = useState(0);

  const r = useMemo(() => {
    const target = cost * Math.pow(1 + inflation / 100, years);
    const fvExisting = fvLumpsum(existing, returns / 100, years);
    const need = Math.max(0, target - fvExisting);
    const monthly = sipForFv(need, returns / 100, years);
    const yearly = monthly * 12;
    const oneTime = need / Math.pow(1 + returns / 100, years);
    const diff = fvExisting - target;
    return { target, fvExisting, monthly, yearly, oneTime, diff };
  }, [years, cost, inflation, returns, existing, growth]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Years Remaining">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label={costLabel}>
          <NumberInput value={cost} onChange={setCost} step={50000} />
        </Field>
        <Field label="Expected Inflation">
          <Slider value={inflation} min={0} max={15} onChange={setInflation} />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={5} max={20} onChange={setReturns} />
        </Field>
        <Field label="Expected Growth in Savings / yr">
          <select
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy"
          >
            {[0, 2, 5, 8, 10].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </Field>
        <Field label="Existing Investments">
          <NumberInput value={existing} onChange={setExisting} step={10000} />
        </Field>
      </div>
      <ResultCard title="Goal Plan" icon={Target}>
        <Big label="Recommended Target Amount" value={fmtINR(r.target, { compact: true })} />
        <div className="my-5 grid grid-cols-3 gap-2 rounded-xl bg-soft-grey p-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Monthly</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.monthly, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Yearly</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.yearly, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">One Time</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.oneTime, { compact: true })}
            </p>
          </div>
        </div>
        <Row
          label="Future Value of Existing Investment"
          value={fmtINR(r.fvExisting, { compact: true })}
        />
        <Row
          label={r.diff >= 0 ? "Surplus to Target" : "Shortfall to Target"}
          value={fmtINR(Math.abs(r.diff), { compact: true })}
          tone={r.diff >= 0 ? "green" : "red"}
        />
      </ResultCard>
    </div>
  );
}

// ---------- Retirement ----------
function RetirementCalc() {
  const [age, setAge] = useState(30);
  const [retAge, setRetAge] = useState(60);
  const [expenses, setExpenses] = useState(50000);
  const [returns, setReturns] = useState(12);
  const [growth, setGrowth] = useState(0);
  const [existing, setExisting] = useState(0);

  const r = useMemo(() => {
    const years = Math.max(1, retAge - age);
    const monthlyAtRet = expenses * Math.pow(1 + INFLATION_RET, years);
    const realReturn = (1 + returns / 100) / (1 + INFLATION_RET) - 1;
    const corpus = pvAnnuity(monthlyAtRet * 12, realReturn, YEARS_IN_RETIREMENT);
    const fvExisting = fvLumpsum(existing, returns / 100, years);
    const need = Math.max(0, corpus - fvExisting);
    const monthly = sipForFv(need, returns / 100, years);
    const yearly = monthly * 12;
    const oneTime = need / Math.pow(1 + returns / 100, years);
    const diff = fvExisting - corpus;
    return { corpus, monthlyAtRet, fvExisting, monthly, yearly, oneTime, diff };
  }, [age, retAge, expenses, returns, existing]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Present Age">
          <NumberInput value={age} min={18} max={70} onChange={setAge} suffix="yrs" />
        </Field>
        <Field label="Retirement Age">
          <NumberInput value={retAge} min={40} max={80} onChange={setRetAge} suffix="yrs" />
        </Field>
        <Field label="Monthly Expenses Today">
          <NumberInput value={expenses} step={5000} onChange={setExpenses} />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={4} max={20} onChange={setReturns} />
        </Field>
        <Field label="Expected Growth in Savings / yr">
          <select
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy"
          >
            {[0, 2, 5, 8, 10].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </Field>
        <Field label="Existing Investments">
          <NumberInput value={existing} onChange={setExisting} step={10000} />
        </Field>
      </div>
      <ResultCard title="Plan Your Retirement" icon={Rocket}>
        <Big label="Recommended Retirement Kitty" value={fmtINR(r.corpus, { compact: true })} />
        <div className="my-5 grid grid-cols-3 gap-2 rounded-xl bg-soft-grey p-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Monthly</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.monthly, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Yearly</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.yearly, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">One Time</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.oneTime, { compact: true })}
            </p>
          </div>
        </div>
        <Row
          label="Future Value of Existing Investment"
          value={fmtINR(r.fvExisting, { compact: true })}
        />
        <Row
          label={r.diff >= 0 ? "Surplus to Target" : "Shortfall to Target"}
          value={fmtINR(Math.abs(r.diff), { compact: true })}
          tone={r.diff >= 0 ? "green" : "red"}
        />
        <Row
          label="Monthly Expenses in Retirement Year"
          value={fmtINR(r.monthlyAtRet, { compact: true })}
        />
      </ResultCard>
    </div>
  );
}

// ---------- SIP Growth ----------
function SipGrowth() {
  const [sip, setSip] = useState(10000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);
  const [growth, setGrowth] = useState(0);
  const r = useMemo(() => {
    const fv = fvSip(sip, returns / 100, years);
    const invested = sip * 12 * years;
    return {
      fv,
      invested,
      gains: fv - invested,
      multiple: invested ? fv / invested : 0,
    };
  }, [sip, years, returns]);
  const data = [
    { name: "Invested", value: r.invested, fill: "oklch(0.22 0.09 260)" },
    {
      name: "Returns",
      value: Math.max(0, r.gains),
      fill: "oklch(0.7 0.15 220)",
    },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Monthly Investment Amount">
          <NumberInput value={sip} step={500} onChange={setSip} />
        </Field>
        <Field label="Period in Years">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={1} max={20} onChange={setReturns} />
        </Field>
        <Field label="Expected Growth in Savings / yr">
          <select
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy"
          >
            {[0, 2, 5, 8, 10].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </Field>
      </div>
      <ResultCard title="SIP Growth" icon={TrendingUp}>
        <Big label="Estimated Future Value" value={fmtINR(r.fv, { compact: true })} />
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-soft-grey p-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Invested</p>
            <p className="font-display text-base text-navy">
              {fmtINR(r.invested, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Returns</p>
            <p className="font-display text-base text-teal">{fmtINR(r.gains, { compact: true })}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Growth</p>
            <p className="font-display text-base text-navy">{r.multiple.toFixed(2)}x</p>
          </div>
        </div>
        <div className="mt-4 h-52">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ResultCard>
    </div>
  );
}

// ---------- SIP Need ----------
function SipNeed() {
  const [target, setTarget] = useState(10000000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);
  const [inflation, setInflation] = useState(8);
  const [growth, setGrowth] = useState(0);
  const r = useMemo(() => {
    const adj = target * Math.pow(1 + inflation / 100, years);
    const sip = sipForFv(adj, returns / 100, years);
    const invested = sip * 12 * years;
    return { adj, sip, invested, multiple: invested ? adj / invested : 0 };
  }, [target, years, returns, inflation]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Target Amount Needed">
          <NumberInput value={target} step={100000} onChange={setTarget} />
        </Field>
        <Field label="Period in Years">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={1} max={20} onChange={setReturns} />
        </Field>
        <Field label="Expected Inflation">
          <Slider value={inflation} min={0} max={15} onChange={setInflation} />
        </Field>
        <Field label="Expected Growth in Savings / yr">
          <select
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy"
          >
            {[0, 2, 5, 8, 10].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </Field>
      </div>
      <ResultCard title="Required SIP" icon={Target}>
        <Big label="Required SIP Amount (monthly)" value={fmtINR(r.sip, { compact: true })} />
        <div className="mt-4 space-y-1">
          <Row
            label="Target Amount (inflation-adjusted)"
            value={fmtINR(r.adj, { compact: true })}
          />
          <Row label="Projected Investment Total" value={fmtINR(r.invested, { compact: true })} />
          <Row label="Growth Multiple" value={`${r.multiple.toFixed(2)}x`} />
        </div>
      </ResultCard>
    </div>
  );
}

// ---------- SIP Delay ----------
function SipDelay() {
  const [sip, setSip] = useState(10000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);
  const [delay, setDelay] = useState(12);
  const r = useMemo(() => {
    const fvNoDelay = fvSip(sip, returns / 100, years);
    const remaining = Math.max(0, years - delay / 12);
    const fvWithDelay = fvSip(sip, returns / 100, remaining);
    return { fvNoDelay, fvWithDelay, cost: fvNoDelay - fvWithDelay };
  }, [sip, years, returns, delay]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Monthly Investment Amount">
          <NumberInput value={sip} step={500} onChange={setSip} />
        </Field>
        <Field label="Period in Years">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={1} max={20} onChange={setReturns} />
        </Field>
        <Field label="Delay in Months">
          <Slider value={delay} min={1} max={120} onChange={setDelay} suffix=" mo" />
        </Field>
      </div>
      <ResultCard title="SIP Delay Cost" icon={Clock}>
        <Big
          label="Estimated SIP Delay Cost"
          value={fmtINR(r.cost, { compact: true })}
          tone="red"
        />
        <div className="mt-4 space-y-1">
          <Row
            label="Projected FV Without Delay"
            value={fmtINR(r.fvNoDelay, { compact: true })}
            tone="green"
          />
          <Row label="Projected FV With Delay" value={fmtINR(r.fvWithDelay, { compact: true })} />
          <Row label="Money Lost to Delay" value={fmtINR(r.cost, { compact: true })} tone="red" />
        </div>
      </ResultCard>
    </div>
  );
}

// ---------- SWP ----------
function SwpCalc() {
  const [principal, setPrincipal] = useState(2500000);
  const [withdraw, setWithdraw] = useState(10000);
  const [increaseToggle, setIncreaseToggle] = useState(false);
  const [increase, setIncrease] = useState(10);
  const [returns, setReturns] = useState(8);
  const [startAfter, setStartAfter] = useState(0);
  const [horizon, setHorizon] = useState(15);

  const r = useMemo(() => {
    let bal = fvLumpsum(principal, returns / 100, startAfter);
    const monthlyRate = returns / 100 / 12;
    const totalMonths = horizon * 12;
    let withdrawn = 0;
    let count = 0;
    let w = withdraw;
    let lastFullMonth = 0;
    for (let m = 1; m <= totalMonths; m++) {
      bal = bal * (1 + monthlyRate);
      if (increaseToggle && m > 1 && m % 12 === 1) w = w * (1 + increase / 100);
      if (bal >= w) {
        bal -= w;
        withdrawn += w;
        count++;
        lastFullMonth = m;
      } else {
        break;
      }
    }
    // estimate perpetuity: if remaining bal > 0 and monthly interest > monthly withdraw at end, perpetuity
    const perpetuity = bal > 0 && bal * monthlyRate >= w;
    const lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() + startAfter * 12 + lastFullMonth);
    return { bal, withdrawn, count, perpetuity, lastDate };
  }, [principal, withdraw, increaseToggle, increase, returns, startAfter, horizon]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Initial Investment Amount">
          <NumberInput value={principal} step={100000} onChange={setPrincipal} />
        </Field>
        <Field label="Monthly Withdrawal Amount">
          <NumberInput value={withdraw} step={500} onChange={setWithdraw} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={increaseToggle}
            onChange={(e) => setIncreaseToggle(e.target.checked)}
            className="h-4 w-4 accent-[oklch(0.22_0.09_260)]"
          />
          Increase withdrawal yearly?
        </label>
        {increaseToggle && (
          <Field label="Yearly Increase in SWP">
            <Slider value={increase} min={0} max={15} onChange={setIncrease} />
          </Field>
        )}
        <Field label="Expected Returns">
          <Slider value={returns} min={2} max={15} onChange={setReturns} />
        </Field>
        <Field label="SWP Start After (Years)">
          <Slider value={startAfter} min={0} max={50} onChange={setStartAfter} suffix=" yrs" />
        </Field>
        <Field label="Investment Horizon">
          <Slider value={horizon} min={1} max={50} onChange={setHorizon} suffix=" yrs" />
        </Field>
      </div>
      <ResultCard title="SWP Plan" icon={Wallet}>
        <Big label="Period End Value" value={fmtINR(r.bal, { compact: true })} />
        <div className="mt-4 space-y-1">
          <Row label="Total Amount Withdrawn" value={fmtINR(r.withdrawn, { compact: true })} />
          <Row label="Full Instalments Withdrawn" value={`${fmtNum(r.count)} months`} />
          <Row
            label="Estimated Last Instalment"
            value={r.lastDate.toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          />
        </div>
        {r.perpetuity && (
          <p className="mt-4 rounded-xl bg-teal/10 px-4 py-3 text-sm font-semibold text-teal">
            The SWP will likely run till perpetuity.
          </p>
        )}
      </ResultCard>
    </div>
  );
}

// ---------- EMI ----------
function EmiCalc() {
  const [loan, setLoan] = useState(5000000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9);
  const [check, setCheck] = useState(0);
  const r = useMemo(() => {
    const i = rate / 100 / 12;
    const n = years * 12;
    const emi = i === 0 ? loan / n : (loan * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = emi * n;
    let outstanding: number | null = null,
      paid: number | null = null,
      interest: number | null = null;
    if (check > 0) {
      const m = check * 12;
      outstanding =
        i === 0
          ? loan - emi * m
          : ((loan * Math.pow(1 + i, n) - emi * ((Math.pow(1 + i, m) - 1) / i)) /
              Math.pow(1 + i, n)) *
            Math.pow(1 + i, m);
      // simpler: outstanding balance formula
      outstanding =
        i === 0 ? loan - emi * m : loan * Math.pow(1 + i, m) - emi * ((Math.pow(1 + i, m) - 1) / i);
      paid = emi * m;
      interest = paid - (loan - (outstanding ?? 0));
    }
    return { emi, total, outstanding, paid, interest };
  }, [loan, years, rate, check]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Loan Amount">
          <NumberInput value={loan} step={100000} onChange={setLoan} />
        </Field>
        <Field label="Loan Duration (Years)">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label="Rate of Interest">
          <Slider value={rate} min={1} max={30} onChange={setRate} />
        </Field>
        <Field label="Check After (Years)">
          <Slider
            value={check}
            min={0}
            max={Math.min(50, years)}
            onChange={setCheck}
            suffix=" yrs"
          />
        </Field>
      </div>
      <ResultCard title="EMI Plan" icon={CalcIcon}>
        <Big label="Estimated EMI" value={fmtINR(r.emi, { compact: true })} />
        <div className="mt-4 space-y-1">
          <Row label="Total Amount You Will Pay" value={fmtINR(r.total, { compact: true })} />
          <Row
            label="Outstanding Loan"
            value={check === 0 ? "NA" : fmtINR(Math.max(0, r.outstanding ?? 0), { compact: true })}
          />
          <Row
            label="Amount Paid Till Date"
            value={check === 0 ? "NA" : fmtINR(r.paid ?? 0, { compact: true })}
          />
          <Row
            label="Interest Component"
            value={check === 0 ? "NA" : fmtINR(Math.max(0, r.interest ?? 0), { compact: true })}
          />
        </div>
      </ResultCard>
    </div>
  );
}

// ---------- Quick tools ----------
function Inflation() {
  const [expenses, setExpenses] = useState(50000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const future = expenses * Math.pow(1 + rate / 100, years);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Current Monthly Expenses">
          <NumberInput value={expenses} step={5000} onChange={setExpenses} />
        </Field>
        <Field label="Years">
          <Slider value={years} min={1} max={50} onChange={setYears} suffix=" yrs" />
        </Field>
        <Field label="Inflation">
          <Slider value={rate} min={1} max={15} onChange={setRate} />
        </Field>
      </div>
      <ResultCard title="Inflation Impact" icon={AlertCircle}>
        <Big
          label={`What ${fmtINR(expenses, { compact: true })} will cost in ${years} yrs`}
          value={fmtINR(future, { compact: true })}
          tone="red"
        />
        <p className="mt-3 text-sm text-muted-foreground">
          That's <span className="font-semibold text-navy">{(future / expenses).toFixed(2)}x</span>{" "}
          your current expenses.
        </p>
      </ResultCard>
    </div>
  );
}

const riskQs = [
  {
    q: "What is your age group?",
    opts: [
      ["Below 30", 4],
      ["30 – 45", 3],
      ["45 – 60", 2],
      ["60+", 1],
    ] as [string, number][],
  },
  {
    q: "How long can you stay invested?",
    opts: [
      ["10+ years", 4],
      ["5 – 10 yrs", 3],
      ["3 – 5 yrs", 2],
      ["< 3 yrs", 1],
    ] as [string, number][],
  },
  {
    q: "If your portfolio dropped 20% in a month?",
    opts: [
      ["Buy more", 4],
      ["Hold", 3],
      ["Sell some", 2],
      ["Sell all", 1],
    ] as [string, number][],
  },
  {
    q: "Purpose of investing?",
    opts: [
      ["Wealth creation", 4],
      ["Big goal in 5+ yrs", 3],
      ["Capital safety", 2],
      ["Regular income", 1],
    ] as [string, number][],
  },
  {
    q: "How many financial dependents?",
    opts: [
      ["None", 4],
      ["1", 3],
      ["2 – 3", 2],
      ["4+", 1],
    ] as [string, number][],
  },
];

function RiskProfiler() {
  const [answers, setAnswers] = useState<number[]>(Array(riskQs.length).fill(0));
  const score = answers.reduce((a, b) => a + b, 0);
  const complete = answers.every((v) => v > 0);
  const profile = score >= 16 ? "Aggressive" : score >= 11 ? "Moderate" : "Conservative";
  const alloc =
    profile === "Aggressive"
      ? [
          { name: "Equity", value: 75, fill: "oklch(0.22 0.09 260)" },
          { name: "Debt", value: 20, fill: "oklch(0.7 0.15 220)" },
          { name: "Gold/Other", value: 5, fill: "oklch(0.82 0.1 220)" },
        ]
      : profile === "Moderate"
        ? [
            { name: "Equity", value: 55, fill: "oklch(0.22 0.09 260)" },
            { name: "Debt", value: 35, fill: "oklch(0.7 0.15 220)" },
            { name: "Gold/Other", value: 10, fill: "oklch(0.82 0.1 220)" },
          ]
        : [
            { name: "Equity", value: 25, fill: "oklch(0.22 0.09 260)" },
            { name: "Debt", value: 65, fill: "oklch(0.7 0.15 220)" },
            { name: "Gold/Other", value: 10, fill: "oklch(0.82 0.1 220)" },
          ];
  const desc =
    profile === "Aggressive"
      ? "Higher risk appetite, long horizon. Suited for equity-heavy portfolios chasing growth."
      : profile === "Moderate"
        ? "Balanced risk and return. A blend of equity and debt for steady growth."
        : "Capital preservation is your priority. Debt-tilted portfolio for stability.";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        {riskQs.map((q, i) => (
          <div key={i}>
            <p className="mb-2 text-sm font-semibold text-navy">
              {i + 1}. {q.q}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {q.opts.map(([label, val]) => (
                <button
                  key={label}
                  onClick={() =>
                    setAnswers((a) => {
                      const n = [...a];
                      n[i] = val;
                      return n;
                    })
                  }
                  className={`rounded-lg border px-3 py-2 text-xs transition-colors ${answers[i] === val ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-teal"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ResultCard title="Your Risk Profile" icon={PieIcon}>
        {complete ? (
          <>
            <Big label="Profile" value={profile} />
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={alloc}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={80}
                    label={(d: any) => `${d.value}%`}
                  >
                    {alloc.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Answer all 5 questions to see your profile and suggested asset allocation.
          </p>
        )}
      </ResultCard>
    </div>
  );
}

function GoalTracker() {
  const [name, setName] = useState("Dream Home");
  const [target, setTarget] = useState(5000000);
  const [current, setCurrent] = useState(500000);
  const [sip, setSip] = useState(15000);
  const [returns, setReturns] = useState(12);
  const r = useMemo(() => {
    const i = returns / 100 / 12;
    // years to reach: solve current*(1+r)^t + sip*((1+i)^n-1)/i*(1+i) = target. iterate
    let bal = current;
    let months = 0;
    while (bal < target && months < 12 * 100) {
      bal = bal * (1 + i) + sip;
      months++;
    }
    return { months, pct: Math.min(100, (current / target) * 100) };
  }, [target, current, sip, returns]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-border shadow-card">
        <Field label="Goal Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy outline-none focus:border-teal"
          />
        </Field>
        <Field label="Target Amount">
          <NumberInput value={target} step={50000} onChange={setTarget} />
        </Field>
        <Field label="Current Savings">
          <NumberInput value={current} step={10000} onChange={setCurrent} />
        </Field>
        <Field label="Monthly SIP">
          <NumberInput value={sip} step={500} onChange={setSip} />
        </Field>
        <Field label="Expected Returns">
          <Slider value={returns} min={4} max={20} onChange={setReturns} />
        </Field>
      </div>
      <ResultCard title={`${name} Tracker`} icon={Target}>
        <Big
          label="Time to Reach Goal"
          value={r.months >= 1200 ? "Increase SIP" : `${(r.months / 12).toFixed(1)} yrs`}
        />
        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-semibold text-navy">{r.pct.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-soft-grey">
            <div
              className="h-full rounded-full bg-gradient-to-r from-navy to-teal transition-all"
              style={{ width: `${r.pct}%` }}
            />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <Row label="Target" value={fmtINR(target, { compact: true })} />
          <Row label="Saved So Far" value={fmtINR(current, { compact: true })} />
          <Row
            label="Still Needed"
            value={fmtINR(Math.max(0, target - current), { compact: true })}
          />
        </div>
      </ResultCard>
    </div>
  );
}

// ---------- registry ----------
const tabs = [
  {
    key: "life",
    label: "Life Goal Calculators",
    subs: [
      {
        key: "retirement",
        label: "Plan Your Retirement",
        icon: Rocket,
        render: () => <RetirementCalc />,
      },
      {
        key: "edu",
        label: "Child Education",
        icon: GraduationCap,
        render: () => (
          <GoalCalc
            defaultCost={5000000}
            defaultInflation={10}
            defaultYears={20}
            costLabel="Cost of Education Today"
          />
        ),
      },
      {
        key: "marriage",
        label: "Marriage for Child",
        icon: Heart,
        render: () => (
          <GoalCalc
            defaultCost={5000000}
            defaultInflation={8}
            defaultYears={20}
            costLabel="Cost of Marriage Today"
          />
        ),
      },
      {
        key: "vacation",
        label: "Dream Vacation",
        icon: Plane,
        render: () => (
          <GoalCalc
            defaultCost={500000}
            defaultInflation={6}
            defaultYears={3}
            costLabel="Cost of Vacation Today"
          />
        ),
      },
      {
        key: "car",
        label: "Dream Car",
        icon: Car,
        render: () => (
          <GoalCalc
            defaultCost={1000000}
            defaultInflation={6}
            defaultYears={5}
            costLabel="Cost of Car Today"
          />
        ),
      },
      {
        key: "home",
        label: "Dream Home",
        icon: Home,
        render: () => (
          <GoalCalc
            defaultCost={5000000}
            defaultInflation={7}
            defaultYears={10}
            costLabel="Cost of Home Today"
          />
        ),
      },
    ],
  },
  {
    key: "fin",
    label: "Financial Calculators",
    subs: [
      {
        key: "sip",
        label: "SIP Growth",
        icon: TrendingUp,
        render: () => <SipGrowth />,
      },
      {
        key: "sipneed",
        label: "SIP Need",
        icon: Target,
        render: () => <SipNeed />,
      },
      {
        key: "delay",
        label: "SIP Delay Cost",
        icon: Clock,
        render: () => <SipDelay />,
      },
      {
        key: "swp",
        label: "SWP Calculator",
        icon: Wallet,
        render: () => <SwpCalc />,
      },
      {
        key: "emi",
        label: "EMI Calculator",
        icon: CalcIcon,
        render: () => <EmiCalc />,
      },
    ],
  },
  {
    key: "quick",
    label: "Quick Tools",
    subs: [
      {
        key: "infl",
        label: "Inflation Impact",
        icon: AlertCircle,
        render: () => <Inflation />,
      },
      {
        key: "risk",
        label: "Risk Profiler",
        icon: PieIcon,
        render: () => <RiskProfiler />,
      },
      {
        key: "tracker",
        label: "Goal Tracker",
        icon: BarChart3,
        render: () => <GoalTracker />,
      },
    ],
  },
];

export function Calculators() {
  const [tab, setTab] = useState(0);
  const [sub, setSub] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const active = tabs[tab].subs[sub];

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <section id="calculators" className="section-y bg-soft-grey">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Calculators
          </p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">
            Plan Your Wealth — Try Our Calculators
          </h2>
          <p className="mt-4 text-muted-foreground">
            Interactive tools to help you make smarter financial decisions
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(i);
                setSub(0);
              }}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 md:text-sm ${tab === i ? "bg-navy text-white shadow-lg" : "border border-border bg-white text-navy hover:border-navy"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-card ring-1 ring-border md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-navy" />
          </button>
          <div
            ref={scroller}
            className="flex gap-2 overflow-x-auto scroll-smooth px-1 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {tabs[tab].subs.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setSub(i)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${sub === i ? "bg-navy text-white" : "border border-border bg-white text-navy hover:border-navy"}`}
              >
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll(1)}
            className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-card ring-1 ring-border md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-navy" />
          </button>
        </div>

        <div
          key={`${tab}-${sub}`}
          className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {active.render()}
        </div>
      </div>
    </section>
  );
}
