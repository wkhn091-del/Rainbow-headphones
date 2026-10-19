"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { MOTION } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * Single Lenis instance (book rule) — cinematic lerp, synced to ScrollTrigger.
 * Skips when reduced-motion. Forms use data-lenis-prevent.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: MOTION.lerp,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
      // Book A03 — no smooth hijack inside conversion fields
      prevent: (node) =>
        Boolean(
          node instanceof HTMLElement &&
            node.closest(
              "[data-lenis-prevent], input, textarea, select, [contenteditable='true']",
            ),
        ),
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduced]);

  return null;
}
