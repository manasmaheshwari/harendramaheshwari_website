//CustomCursor.tsx
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    setEnabled(true);
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      setPos({ x, y });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999] hidden md:block"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%,-50%)" }}
    >
      <div
        className="h-3 w-3 rounded-full bg-navy"
        style={{ boxShadow: "0 0 0 6px oklch(0.22 0.09 260 / 0.08)" }}
      />
    </div>
  );
}
