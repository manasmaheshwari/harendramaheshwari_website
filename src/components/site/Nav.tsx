import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logoImg from "@/assets/investment-point-logo.png";

const servicesDropdown = [
  {
    category: "Invest",
    items: ["Mutual Funds & SIP", "ELSS Tax Saving", "Recurring Deposit"],
  },
  {
    category: "Protect",
    items: ["Term Insurance", "Health Insurance", "Vehicle Insurance", "General Insurance", "LIC"],
  },
  {
    category: "Plan",
    items: ["Retirement Planning", "Goal-Based Planning", "Financial Planning"],
  },
  {
    category: "Grow",
    items: ["Stock & Equity Advisory", "Fixed Deposits & Bonds", "Portfolio Review"],
  },
];

const links = [
  { href: "#about", label: "About" },
  { href: "#calculators", label: "Calculators" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Nav({ onConsult }: { onConsult: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = (item: string) => {
    setServicesOpen(false);
    setOpen(false);
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>("select[name='service']");
      if (select) {
        select.value = item;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 800);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-[0_2px_20px_-8px_rgba(11,31,75,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="Investment Point"
              className={`h-27 md:h-30 w-auto object-contain transition-all duration-300 ${
                scrolled ? "brightness-0" : "brightness-0 invert"
              }`}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal ${
                  scrolled ? "text-navy/80" : "text-white/90"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full pt-3 z-50">
                  <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-border p-6 grid grid-cols-4 gap-6 w-[700px]">
                    {servicesDropdown.map((group) => (
                      <div key={group.category}>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal">
                          {group.category}
                        </p>
                        <ul className="space-y-2.5">
                          {group.items.map((item) => (
                            <li key={item}>
                              <button
                                onClick={() => scrollToContact(item)}
                                className="text-sm text-navy/80 hover:text-teal transition-colors text-left leading-snug"
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-teal ${
                  scrolled ? "text-navy/80" : "text-white/90"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={onConsult}
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,31,75,0.5)] transition-colors duration-200 hover:bg-teal"
            >
              Book Free Consultation
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className={`md:hidden p-2 ${scrolled ? "text-navy" : "text-white"}`}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Mobile Menu — outside header to escape stacking context */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-white md:hidden overflow-y-auto">
          <div className="container-x flex h-16 items-center justify-between border-b border-border">
            <img
              src={logoImg}
              alt="Investment Point"
              className="h-27 w-auto object-contain brightness-0"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-navy"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <div className="container-x flex flex-col gap-5 pt-6 pb-12">
            {/* Mobile Services Accordion */}
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-between text-2xl font-display text-navy text-left w-full"
            >
              Services
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  mobileServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="pl-2 space-y-5 border-l-2 border-teal/30 ml-1">
                {servicesDropdown.map((group) => (
                  <div key={group.category}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal mb-2">
                      {group.category}
                    </p>
                    <ul className="space-y-2 pl-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <button
                            onClick={() => scrollToContact(item)}
                            className="text-base text-navy/80 hover:text-teal transition-colors text-left"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Home link */}
            <a
              href="#home"
              onClick={() => setOpen(false)}
              className="text-2xl font-display text-navy"
            >
              Home
            </a>

            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-display text-navy"
              >
                {l.label}
              </a>
            ))}

            <button
              onClick={() => {
                setOpen(false);
                onConsult();
              }}
              className="mt-4 rounded-full bg-navy px-6 py-3 text-base font-semibold text-white"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
}
