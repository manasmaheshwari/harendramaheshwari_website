import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-soft-grey"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="font-display text-2xl text-navy">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Book Your Free 30-min Session">
      <p className="mb-4 text-sm text-muted-foreground">
        No commitment. Just clarity from Harendra.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const data = new FormData(e.target as HTMLFormElement);
          await fetch("https://formspree.io/f/xwvjwkrd", {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
          setSubmitting(false);
          toast.success("Thanks! Harendra will reach out shortly ✓");
          onClose();
        }}
        className="space-y-3"
      >
        <Field label="Name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Best Time to Call</label>
          <select
            name="time"
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
          >
            <option>Morning (9am – 12pm)</option>
            <option>Afternoon (12pm – 5pm)</option>
            <option>Evening (5pm – 8pm)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Message (optional)</label>
          <textarea
            name="message"
            rows={3}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-teal disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Book My Free Session"}
        </button>
      </form>
    </Modal>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
      />
    </div>
  );
}
