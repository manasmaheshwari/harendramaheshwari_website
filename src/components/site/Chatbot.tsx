//Chatbot.tsx
import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/format";

type Msg = { from: "bot" | "user"; text: string };

const presets: { q: string; a: string }[] = [
  {
    q: "What is SIP?",
    a: "SIP (Systematic Investment Plan) lets you invest a fixed amount monthly in mutual funds, building wealth through compounding over time.",
  },
  {
    q: "How do I start investing?",
    a: "Simple — book a free 30-min call with Harendra. He'll understand your goals and build a plan tailored to you.",
  },
  {
    q: "What services do you offer?",
    a: "Mutual Funds & SIP, ELSS Tax Saving, Stock Advisory, Insurance, FDs & Bonds, Retirement Planning, Portfolio Review, and Goal-Based Planning.",
  },
  {
    q: "How do I start a SIP?",
    a: "Starting a SIP is easy! You can begin with as little as ₹500/month. Book a free call with Harendra — he'll help you pick the right fund based on your goals, risk appetite, and timeline. Most clients are invested within 48 hours of their first call.",
  },
  ,
  {
    q: "What is your fee?",
    a: "Our fee structure is transparent and discussed upfront in your free consultation. We believe in unbiased, goal-first advice.",
  },
];

export function Chatbot({ onConsult }: { onConsult: () => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi! I'm your Investment Point assistant 👋 How can I help?",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const ask = (q: string, a: string) => {
    setMsgs((m) => [...m, { from: "user", text: q }, { from: "bot", text: a }]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-xl transition-all hover:scale-110 hover:bg-teal"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-border animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div>
              <p className="font-display text-base leading-tight">Investment Point</p>
              <p className="text-xs text-white/70">Usually replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex h-80 flex-col gap-3 overflow-y-auto bg-soft-grey p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "bot" ? "self-start bg-white text-navy ring-1 ring-border" : "self-end bg-navy text-white"}`}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="space-y-2 border-t border-border bg-white p-3">
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.q}
                  onClick={() => ask(p.q, p.a)}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs text-navy transition-colors hover:bg-navy hover:text-white"
                >
                  {p.q}
                </button>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onConsult();
                }}
                className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white"
              >
                Book a consultation
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-white"
              >
                <Send className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
