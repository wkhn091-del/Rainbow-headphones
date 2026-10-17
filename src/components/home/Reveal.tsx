"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

/** Below-fold reveal once — MOTION_MAP Tier 1 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(false);
  const visible = reduced || on;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`${visible ? "nexa-reveal" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
