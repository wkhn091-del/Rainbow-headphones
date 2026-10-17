"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { useIsClient } from "@/lib/client/mounted";

const LERP = 0.15;

/**
 * M2 — desktop magnetic cursor (Bone field).
 * Disabled on touch / reduced-motion / <lg.
 */
export function MagneticCursor() {
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("nexa-has-magnetic");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let magnet = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      magnet = Boolean(
        t?.closest(
          "a, button, [role='button'], .nexa-btn-buy, .nexa-btn-accent, .nexa-magnetic, .nexa-footer-link",
        ),
      );
    };

    const loop = () => {
      rx += (x - rx) * LERP;
      ry += (y - ry) * LERP;
      const s = magnet ? 1.85 : 1;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${magnet ? 0.35 : 1})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${s})`;
      ring.style.borderColor = magnet
        ? "var(--color-accent)"
        : "color-mix(in srgb, var(--color-accent) 50%, transparent)";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("nexa-has-magnetic");
    };
  }, [mounted, reduced]);

  if (!mounted || reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] hidden lg:block"
      aria-hidden
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 border-[var(--color-accent)] will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-2 w-2 rounded-full bg-[var(--color-buy)] will-change-transform"
      />
    </div>
  );
}
