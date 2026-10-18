"use client";

import { useEffect, useRef, useState } from "react";
import { LAUNCH } from "@/lib/catalog";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

type Props = {
  className?: string;
  target?: number;
};

/** Act 5 — quiet FOMO: count 0 → launch units when in view */
export function FomoCounter({
  className = "",
  target = LAUNCH.totalUnits,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const dur = 1600;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - (1 - t) ** 3;
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || started) return;
        started = true;
        run();
        io.disconnect();
      },
      { threshold: 0.45 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, target]);

  return (
    <div ref={ref} className={className}>
      <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[var(--color-text-faint)] uppercase">
        יחידות השקה
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl tabular-nums tracking-[-0.04em] text-white sm:text-4xl">
        {value.toLocaleString("he-IL")}
        <span className="ms-2 text-base text-white/35">/ {target}</span>
      </p>
    </div>
  );
}
