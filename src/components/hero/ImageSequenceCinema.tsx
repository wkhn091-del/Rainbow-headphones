"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SEQUENCE } from "@/lib/media/sequence";
import { clamp, filmProgress } from "@/lib/motion/scroll-math";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { useIsClient } from "@/lib/client/mounted";
import { track } from "@/lib/analytics/track";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tier 2 Apple-style image sequence — canvas scrub pinned to Lenis/ScrollTrigger.
 * Desktop only; mobile keeps ImmersiveHero poster (60FPS).
 */
export function ImageSequenceCinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const doneRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!mounted || reduced) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let cancelled = false;
    const imgs: HTMLImageElement[] = [];

    const boot = () => {
      void Promise.all(
        SEQUENCE.frames.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.decoding = "async";
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
              imgs.push(img);
            }),
        ),
      ).then(() => {
        if (cancelled) return;
        framesRef.current = imgs;
        setEnabled(true);
      });
    };

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({} as IdleDeadline), 100) as unknown as number);
    const handle = ric(() => boot());

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(handle as number);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, [mounted, reduced]);

  useEffect(() => {
    if (!enabled || reduced) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (p: number) => {
      const frames = framesRef.current;
      if (!frames.length) return;
      const idx = Math.min(
        frames.length - 1,
        Math.floor(filmProgress(p) * (frames.length - 0.001)),
      );
      const img = frames[idx];
      if (!img?.complete || !img.naturalWidth) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0C0C0C";
      ctx.fillRect(0, 0, w, h);

      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      setDrawn(true);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${SEQUENCE.trackVh}vh`,
      pin: true,
      scrub: 0.45,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = clamp(self.progress);
        draw(p);
        if (p >= 0.92 && !doneRef.current) {
          doneRef.current = true;
          track("scroll_cinema_complete");
        }
      },
    });

    draw(0);
    ScrollTrigger.refresh();

    const onResize = () => draw(st.progress);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [enabled, reduced]);

  if (!mounted || reduced) return null;

  return (
    <section
      ref={sectionRef}
      className="relative hidden h-[100dvh] bg-[var(--color-bg)] md:block"
      aria-label="פירוק מוצר בגלילה"
    >
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-300 ${
          drawn ? "opacity-100" : "opacity-0"
        }`}
      />
    </section>
  );
}
