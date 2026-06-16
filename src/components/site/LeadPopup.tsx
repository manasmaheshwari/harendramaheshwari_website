import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { toast } from "sonner";

export function LeadPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ip_lead_shown")) return;
    const t = setTimeout(() => trigger(), 10000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY < 5) trigger();
    };
    function trigger() {
      if (sessionStorage.getItem("ip_lead_shown")) return;
      sessionStorage.setItem("ip_lead_shown", "1");
      setOpen(true);
    }
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Get a FREE Financial Plan to achieve your life goals"
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Harendra will personally review your finances, understand your goal and build a roadmap — in
        just 30 minutes, completely free.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.target as HTMLFormElement);
          await fetch("https://formspree.io/f/xwvjwkrd", {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
          toast.success("Got it! We'll reach out within 24 hrs ✓");
          setOpen(false);
        }}
        className="space-y-3"
      >
        <input
          required
          name="name"
          placeholder="Your name"
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
        />
        <input
          required
          name="phone"
          type="tel"
          placeholder="Phone number"
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-teal"
        >
          Get My Free Plan
        </button>
      </form>
    </Modal>
  );
}
