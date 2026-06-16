import { Reveal, CountUp } from "./Reveal";
import {
  TrendingUp,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  PiggyBank,
  Landmark,
  LineChart,
  Target,
  Star,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { ADDRESS, MAPS_URL, PHONE, EMAIL, WHATSAPP_URL } from "@/lib/format";
import harendraImg from "@/assets/harendra.png";
import logoImg from "@/assets/investment-point-logo.png";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import award1 from "@/assets/Gold Partner.jpeg";
import award2 from "@/assets/LIC.jpeg";
import award3 from "@/assets/SIP Bronze.jpeg";
import award4 from "@/assets/Wealthy.jpeg";

const stats = [
  {
    label: "AMFI Registered ARN Holder (ARN-51756)",
    value: 1,
    suffix: "",
    display: "AMFI ✓",
  },
  { label: "Happy Clients", value: 1000, suffix: "+" },
  { label: "Pan-India Service", value: 28, suffix: " States" },
  { label: "Years Experience", value: 20, suffix: "+" },
  { label: "Crores Managed", value: 100, suffix: "+ Cr", prefix: "₹" },
];

export function TrustBar() {
  return (
    <section className="relative -mt-12 px-5 md:-mt-16">
      <div className="container-x">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-border md:grid-cols-5 md:gap-4 md:p-6">
            {stats.map((s, i) => (
              <div key={i} className="relative rounded-xl bg-soft-grey/60 p-4 text-center">
                <div className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-teal" />
                <p className="font-display text-2xl text-navy md:text-3xl">
                  {s.display ? (
                    s.display
                  ) : (
                    <CountUp to={s.value} suffix={s.suffix} prefix={s.prefix} />
                  )}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const services = [
  {
    icon: TrendingUp,
    name: "Mutual Funds & SIP",
    desc: "Build wealth steadily with curated SIPs.",
  },
  {
    icon: ShieldCheck,
    name: "Tax Saving (ELSS)",
    desc: "Save tax under 80C, grow simultaneously.",
  },
  {
    icon: LineChart,
    name: "Stock & Equity Advisory",
    desc: "Research-led equity recommendations.",
  },
  {
    icon: HeartHandshake,
    name: "Term & Health Insurance",
    desc: "Protect what matters most.",
  },
  {
    icon: Landmark,
    name: "Fixed Deposits & Bonds",
    desc: "Safe, predictable income options.",
  },
  {
    icon: PiggyBank,
    name: "Retirement Planning",
    desc: "Retire on your terms, with confidence.",
  },
  {
    icon: Briefcase,
    name: "Portfolio Review",
    desc: "Honest, periodic check-ups for your investments.",
  },
  {
    icon: Target,
    name: "Goal-Based Planning",
    desc: "Plans tied to your life, not products.",
  },
];

export function Services() {
  return (
    <section id="services" className="section-y bg-white">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Services
          </p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">What We Help You With</h2>
          <p className="mt-4 text-muted-foreground">
            From your first SIP to a retirement corpus — full-spectrum financial advice under one
            roof.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <div className="group h-full cursor-pointer rounded-2xl bg-white p-5 ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover md:p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-soft-grey text-navy transition-colors group-hover:bg-teal group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg text-navy">{s.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                <button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    el?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      const select =
                        document.querySelector<HTMLSelectElement>("select[name='service']");
                      if (select) {
                        select.value = s.name;
                        select.dispatchEvent(new Event("change", { bubbles: true }));
                      }
                    }, 800);
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal opacity-0 transition-all group-hover:opacity-100"
                >
                  Learn More <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const whyItems = [
  {
    title: "Unbiased Advice",
    desc: "Recommendations driven by your goals, not commissions.",
  },
  {
    title: "1-on-1 Personal Attention",
    desc: "You speak directly to Harendra, every time.",
  },
  {
    title: "Digital-First, Serve Anywhere",
    desc: "Onboard and invest 100% online — anywhere in India.",
  },
  {
    title: "Transparent & Honest",
    desc: "Clear fees, clear logic. No fine print.",
  },
  {
    title: "Goal-Focused, Not Product-Driven",
    desc: "Plans built around your life milestones.",
  },
];

export function WhyUs() {
  return (
    <section className="section-y bg-soft-grey">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">Why Us</p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">Why Investment Point</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {whyItems.map((w, i) => (
            <Reveal key={w.title} delay={i * 70}>
              <div className="h-full rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-border">
                <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Star className="h-4 w-4" />
                </div>
                <h3 className="font-display text-base text-navy">{w.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABand({ onConsult }: { onConsult: () => void }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-teal-light/10 blur-3xl"
      />
      <div className="container-x relative section-y text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl text-balance">
            Stop Guessing. Start Growing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Every day without a plan is a day your money isn't working for you. Book a FREE
            30-minute session with Harendra — get a personalized financial plan, not generic advice.
          </p>
          <button
            onClick={onConsult}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal px-7 py-4 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-white hover:text-navy"
          >
            Claim My Free Session <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section-y bg-white">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-soft-grey ring-1 ring-border">
              <img
                src={harendraImg}
                alt="Harendra Maheshwari"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-navy p-4 text-white shadow-xl md:block">
              <p className="text-xs uppercase tracking-wider text-teal-light">AMFI Registered</p>
              <p className="font-display text-lg">ARN Holder</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            About the Founder
          </p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">Meet Harendra Maheshwari</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            I started Investment Point with one belief — every Indian deserves honest, goal-oriented
            financial advice. For too long, people have been sold products instead of solutions.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            As an AMFI Registered Mutual Funds Distributor, I work with salaried professionals,
            business owners, NRIs, and retirees across India to build financial plans that actually
            fit their lives.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-soft-grey px-4 py-2 text-xs font-semibold text-navy">
            <ShieldCheck className="h-4 w-4 text-teal" /> AMFI Registered · ARN-51756
          </div>
          <div className="mt-7">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal"
            >
              Talk to Me Directly <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Rohit",
    city: "Bengaluru",
    quote:
      "Harendra simplified my entire portfolio. The clarity I got in one session was incredible.",
  },
  {
    name: "Priya",
    city: "Mumbai",
    quote:
      "Honest, transparent advice. He told me what I needed to hear, not what I wanted to hear.",
  },
  {
    name: "Amit",
    city: "Jaipur",
    quote: "Been a client for 6 years. My retirement plan is finally on track.",
  },
  {
    name: "Neha",
    city: "Delhi NCR",
    quote:
      "As an NRI, finding trustworthy advice in India was tough. Investment Point changed that.",
  },
  {
    name: "Sandeep",
    city: "Pune",
    quote: "The SIP strategy he set up has outperformed my expectations. Highly recommended.",
  },
];

export function Testimonials() {
  const items = [...testimonials, ...testimonials];
  return (
    <section className="section-y bg-soft-grey overflow-hidden">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Testimonials
          </p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">
            Trusted by 1000+ Investors
          </h2>
        </Reveal>
      </div>
      <div className="mt-12 relative">
        <div className="flex w-max gap-5 marquee-track">
          {items.map((t, i) => (
            <div
              key={i}
              className="w-[320px] shrink-0 rounded-2xl border-l-4 border-teal bg-white p-5 shadow-card"
            >
              <div className="flex text-teal text-sm">{"★★★★★"}</div>
              <p className="mt-3 text-sm text-foreground leading-relaxed">"{t.quote}"</p>
              <p className="mt-4 text-xs font-semibold text-navy">
                {t.name} <span className="text-muted-foreground font-normal">· {t.city}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const awards = [award1, award2, award3, award4];

export function Blog() {
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % awards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "I have never invested before — where do I start?",
      a: "Starting is simpler than you think. Book a free 30-minute call with Harendra. He will understand your income, goals, and risk appetite and suggest the best starting point — whether that's a small SIP, an ELSS fund, or a term insurance plan first.",
    },
    {
      q: "What is the minimum amount to start a SIP?",
      a: "You can start a SIP with as little as ₹500 per month. However, Harendra will recommend an amount based on your income and goals to ensure your investments actually make a meaningful difference over time.",
    },
    {
      q: "Are your advisory services free?",
      a: "The first consultation is completely free. Harendra's fee structure is transparent and discussed upfront — no hidden charges, no surprise deductions. You always know exactly what you are paying and why.",
    },
    {
      q: "Can I invest if I live outside India (NRI)?",
      a: "Absolutely. Harendra works with NRIs across the world to invest in Indian mutual funds and financial instruments. The process is fully online and straightforward with the right guidance.",
    },
    {
      q: "Is my money safe with Investment Point?",
      a: "Your money is never held by Investment Point. All investments go directly to SEBI-registered mutual fund houses like HDFC, SBI, or Mirae. Investment Point only provides advice and facilitates the process — your funds are always in regulated, government-overseen institutions.",
    },
    {
      q: "How often will you review my portfolio?",
      a: "Harendra conducts periodic portfolio reviews — typically every 6 months or whenever there is a major market event or life change. You are never left wondering how your investments are performing.",
    },
    {
      q: "How do I get started?",
      a: "Simply click 'Book Free Consultation' on this page, fill in your details, and Harendra will personally call you back. The entire onboarding process is digital — no paperwork, no office visits required.",
    },
  ];

  return (
    <>
      {/* Awards Carousel */}
      <section className="section-y bg-white overflow-hidden">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              Recognition
            </p>
            <h2 className="font-display text-4xl text-navy md:text-5xl">Awards & Achievements</h2>
            <p className="mt-4 text-muted-foreground">
              Two decades of trusted advice, recognised by the industry.
            </p>
          </Reveal>
          <div className="mt-12 relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {awards.map((src, i) => (
                  <div key={i} className="min-w-full flex justify-center">
                    <img
                      src={src}
                      alt={`Award ${i + 1}`}
                      className="h-[420px] w-auto max-w-full object-contain rounded-2xl shadow-card"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {awards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-navy" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="section-y bg-soft-grey">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              Watch & Learn
            </p>
            <h2 className="font-display text-4xl text-navy md:text-5xl">
              Financial Wisdom, Simplified
            </h2>
            <p className="mt-4 text-muted-foreground">
              Harendra breaks down complex financial topics into simple, actionable advice.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <div className="overflow-hidden rounded-2xl shadow-card-hover aspect-video max-w-3xl mx-auto">
              <iframe
                src="https://www.youtube.com/embed/YY0_ETuJsGE"
                title="Harendra Maheshwari - Financial Advice"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://www.youtube.com/@harendramaheshwari1285"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch More on YouTube
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-y bg-white">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">FAQ</p>
            <h2 className="font-display text-4xl text-navy md:text-5xl">
              Questions You Might Have
            </h2>
            <p className="mt-4 text-muted-foreground">
              Honest answers to the most common questions new investors ask.
            </p>
          </Reveal>
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-border bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-display text-lg text-navy pr-4">{faq.q}</span>
                    <span
                      className={`shrink-0 text-teal text-xl transition-transform duration-200 ${
                        openFaq === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Callback() {
  const [loading, setLoading] = useState(false);
  return (
    <section id="contact" className="section-y bg-soft-grey">
      <div className="container-x grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Get in touch
          </p>
          <h2 className="font-display text-4xl text-navy md:text-5xl">We'll Call You Back</h2>
          <p className="mt-4 text-muted-foreground">
            Drop your details and Harendra will personally call you back at your preferred time.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p>
              <span className="font-semibold text-navy">Phone:</span> {PHONE}
            </p>
            <p>
              <span className="font-semibold text-navy">Email:</span> {EMAIL}
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 text-navy transition-colors hover:text-teal"
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{ADDRESS}</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const data = new FormData(e.target as HTMLFormElement);
              await fetch("https://formspree.io/f/xwvjwkrd", {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" },
              });
              setLoading(false);
              toast.success("Thanks! Harendra will call you shortly ✓");
              (e.target as HTMLFormElement).reset();
            }}
            className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border md:p-8"
          >
            <input
              type="hidden"
              name="utm_source"
              value={typeof window !== "undefined" ? window.location.href : ""}
            />
            <div className="space-y-4">
              <input
                required
                name="name"
                placeholder="Your Name"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              />
              <input
                required
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              />
              <select
                name="time"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              >
                <option value="">Best Time to Call</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
              <select
                name="service"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              >
                <option value="Service Interested In">Service Interested In</option>
                {services.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <button
                disabled={loading}
                className="w-full rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Request Callback"}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src={logoImg} alt="Investment Point" className="h-25 w-auto rounded" />
            <p className="mt-4 max-w-sm font-display text-lg text-white/90">
              Your Money. Your Goals. Our Expertise.
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/60">
              Trusted financial advisory based in Jaipur, serving clients across India since 2007.
            </p>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-light">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#home" className="hover:text-teal-light">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-light">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-teal-light">
                  About
                </a>
              </li>
              <li>
                <a href="#calculators" className="hover:text-teal-light">
                  Calculators
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-teal-light">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-teal-light">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-light">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>{PHONE}</li>
              <li>{EMAIL}</li>
              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-1.5 hover:text-teal-light"
                >
                  <span>📍</span>
                  <span>{ADDRESS}</span>
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-4 text-sm">
              <a
                href="https://www.youtube.com/@harendramaheshwari1285"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-light"
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/harendramaheshwari3/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-light"
              >
                Instagram
              </a>
              <a
                href="https://in.linkedin.com/in/harendra-maheshwari-6101081a5"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-light"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-3 border-t border-white/10 pt-6 text-xs text-white/55">
          <p>
            Mutual Funds investments are subject to market risks. Please read all scheme-related
            documents carefully before investing.
          </p>
          <p>Harendra Maheshwari — AMFI Registered Mutual Funds Distributor (ARN-51756)</p>
          <p>© {new Date().getFullYear()} Investment Point. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
