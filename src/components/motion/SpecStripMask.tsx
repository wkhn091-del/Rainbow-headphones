"use client";

import { useEffect, useRef, useState } from "react";
import { FLAGSHIP } from "@/lib/catalog";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

const LINES = [
  { label: "סוללה", value: `${FLAGSHIP.batteryHours} שעות` },
  {
    label: "טעינה מהירה",
    value: `${FLAGSHIP.fastChargeMinutes} דק׳ → ${FLAGSHIP.fastChargePlayHours} ש׳`,
  },
  { label: "ANC", value: "שיחות · טיסות · משרד" },
  {
    label: "אחריות",
    value: `${FLAGSHIP.warrantyYears} שנים עד הבית`,
  },
] as const;

/**
 * M3 — Spec strip after cinema. Always painted; mask reveal on enter.
 */
export function SpecStripMask() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setOn(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="specs-strip"
      className="relative z-[2] border-y border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-16 sm:px-8"
      aria-label="מפרט מהיר"
    >
      <p className="mx-auto mb-10 max-w-5xl text-center font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[var(--color-accent)] uppercase">
        למה זה רלוונטי · במספרים
      </p>
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {LINES.map((line, i) => (
          <div
            key={line.label}
            className={`border-s border-[var(--color-border)] ps-4 transition-[opacity,transform,clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              on
                ? "opacity-100 [clip-path:inset(0_0_0_0)] translate-y-0"
                : "opacity-0 [clip-path:inset(0_0_100%_0)] translate-y-3"
            }`}
            style={{ transitionDelay: on ? `${i * 70}ms` : "0ms" }}
          >
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
              {line.label}
            </p>
            <p className="mt-2 text-xl tracking-[-0.02em] text-[var(--color-text)]">
              {line.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
