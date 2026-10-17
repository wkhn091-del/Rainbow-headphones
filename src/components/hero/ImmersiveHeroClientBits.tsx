"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

/** Applies on-load entrance classes to SSR hero nodes (no layout shift on H1). */
export function ImmersiveHeroClientBits() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = document.querySelector('[aria-label="Hero"]');
    if (!root) return;
    root.classList.add("nexa-hero-enter");
  }, [reduced]);

  return null;
}
