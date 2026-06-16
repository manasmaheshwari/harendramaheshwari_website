import { useEffect, useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/format";
import harendraImg from "@/assets/harendra.png";

const HEADLINE = ["Your", "Money.", "Your", "Goals.", "Our", "Expertise."];

export function Hero({ onConsult }: { onConsult: () => void }) {
  const [brandIn, setBrandIn] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setBrandIn(true), 100);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section id="home" className="grain relative isolate min-h-screen overflow-hidden pt-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F4B] via-[#1a3578] to-[#7fc4e8]" />
        <div className="absolute -top-40 -left-20 h-[420px] w-[420px] rounded-full bg-teal/30 blur-3xl float-slow" />
        <div
          className="absolute top-40 right-10 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl float-slow"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-teal-light/30 blur-3xl float-slow"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <div className="container-x grid min-h-[calc(100vh-5rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div className="text-white">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wider uppercase backdrop-blur transition-all duration-700 ${brandIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-light" /> Investment Point · Since
            2007
          </div>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl text-balance">
            Your Money. Your Goals.{" "}
            <span style={{ color: "oklch(0.85 0.12 220)" }}>Our Expertise.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-white/85 leading-relaxed">
            Expert financial planning for salaried professionals, business owners, and NRIs —
            serving clients pan-India and beyond.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={onConsult}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-xl transition-all duration-200 hover:bg-teal hover:text-white"
            >
              Book a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-teal-light" /> Zero Hidden Fees
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-teal-light" /> Goal-Based Planning
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-teal-light" /> Unbiased Advice
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/20 shadow-2xl backdrop-blur">
            <img
              src={harendraImg}
              alt="Harendra Maheshwari"
              className="h-full w-full object-cover"
              fetchPriority="high"
              loading="eager"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-teal">Founder</p>
              <p className="font-display text-xl text-navy">Harendra Maheshwari</p>
              <p className="text-xs text-muted-foreground">AMFI Registered MFD · ARN Holder</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 hidden rounded-2xl bg-white p-4 shadow-2xl md:block">
            <p className="font-display text-3xl text-navy">
              20+ <span className="text-teal">yrs</span>
            </p>
            <p className="text-xs text-muted-foreground">of trusted advice</p>
          </div>
        </div>
      </div>
    </section>
  );
}
