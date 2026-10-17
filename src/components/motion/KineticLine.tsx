"use client";

import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

/** CSS clip/slide line reveal — MOTION Tier 1 (no SplitText dependency) */
export function KineticLine({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <span className={`nexa-kinetic ${className}`}>
      <span
        className="nexa-kinetic-inner"
        style={
          reduced
            ? undefined
            : { animationDelay: `${delayMs}ms` }
        }
      >
        {children}
      </span>
    </span>
  );
}
