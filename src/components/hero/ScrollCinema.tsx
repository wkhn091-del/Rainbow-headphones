"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { CINEMA } from "@/lib/media/cinema";
import {
  clamp,
  filmProgress,
  lerp,
  smoothstep,
  subProgress,
  trackProgress,
} from "@/lib/motion/scroll-math";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { useIsClient } from "@/lib/client/mounted";
import { copy } from "@/lib/copy/he";
import { track } from "@/lib/analytics/track";

import { MOTION } from "@/lib/motion/tokens";
import { useIsMobile } from "@/lib/client/mobile";

const LERP = MOTION.filmLerp;
const SEEK_EPS = 0.008;

/**
 * Full-bleed scroll cinema — sits below ImmersiveHero.
 * Explode chapter zooms out so the full assembly stays on screen.
 */
export function ScrollCinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fpsFail, setFpsFail] = useState(false);
  const cinemaDoneRef = useRef(false);
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const staticMode = reduced || fpsFail;
  const trackVh = mobile ? CINEMA.trackVhMobile : CINEMA.trackVh;

  useEffect(() => {
    if (!mounted || staticMode) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.pause();
    video.muted = true;
    video.playsInline = true;

    let lastT = performance.now();
    let slow = 0;

    const tick = () => {
      const now = performance.now();
      const dt = now - lastT;
      lastT = now;
      if (dt > 22) slow += 1;
      else slow = Math.max(0, slow - 1);
      if (slow > 45) {
        setFpsFail(true);
        rafRef.current = 0;
        return;
      }

      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        rafRef.current = 0;
        return;
      }

      const raw = trackProgress(section);
      const p = filmProgress(raw);
      if (raw >= 0.92 && !cinemaDoneRef.current) {
        cinemaDoneRef.current = true;
        track("scroll_cinema_complete");
      }
      targetRef.current = p * video.duration;

      if (!video.seeking) {
        const cur = currentRef.current;
        const next = cur + (targetRef.current - cur) * LERP;
        currentRef.current =
          Math.abs(targetRef.current - next) < SEEK_EPS
            ? targetRef.current
            : next;
        if (Math.abs(video.currentTime - currentRef.current) > SEEK_EPS) {
          video.currentTime = currentRef.current;
        }
      }

      setProgress(raw);

      if (
        Math.abs(targetRef.current - currentRef.current) < SEEK_EPS &&
        !video.seeking
      ) {
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (rafRef.current) return;
      lastT = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMeta = () => {
      setReady(true);
      currentRef.current = 0;
      video.currentTime = 0;
      kick();
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta, { once: true });

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });

    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.on("scroll", kick);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) kick();
      },
      { threshold: 0.01 },
    );
    io.observe(section);

    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      lenis?.off("scroll", kick);
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, staticMode]);

  const hookOpacity = clamp(
    1 - smoothstep(subProgress(progress, 0, 0.06)) * 1.15,
  );
  const midIn = smoothstep(subProgress(progress, 0.32, 0.4));
  const midOut = smoothstep(subProgress(progress, 0.52, 0.6));
  const midOpacity = midIn * (1 - midOut);
  const closeIn = smoothstep(subProgress(progress, 0.72, 0.82));
  const closeOut = smoothstep(subProgress(progress, 0.92, 0.98));
  const closeOpacity = closeIn * (1 - closeOut);

  const explodeIn = smoothstep(subProgress(progress, 0.28, 0.36));
  const explodeOut = smoothstep(subProgress(progress, 0.62, 0.72));
  const explodeAmt = explodeIn * (1 - explodeOut);
  const filmScale = lerp(1, 0.58, explodeAmt);
  const useContain = explodeAmt > 0.2;

  return (
    <section
      ref={sectionRef}
      id="cinema"
      className="nexa-cinema relative z-[1] bg-[var(--color-bg)]"
      style={{ height: staticMode ? "100dvh" : `${trackVh}vh` }}
      aria-label={`${copy.brand} — סינמה בגלילה`}
    >
      <p className="sr-only" aria-live="polite">
        סרטון מוצר בגלילה: פירוק שכבות האוזניות. אפשר לדלג לרכישה.
      </p>
      <div
        className={`relative overflow-hidden bg-[var(--color-bg)] ${
          staticMode ? "h-[100dvh]" : "sticky top-0 h-[100dvh]"
        }`}
      >
        <Image
          src={CINEMA.poster}
          alt=""
          fill
          className={useContain ? "object-contain" : "object-cover"}
          sizes="100vw"
          style={{
            opacity: ready && !staticMode ? 0 : 1,
            transform: `scale(${filmScale})`,
          }}
        />
        {!staticMode && mounted ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 z-0 h-full w-full ${
              useContain ? "object-contain" : "object-cover"
            }`}
            style={{
              opacity: ready ? 1 : 0,
              transform: `scale(${filmScale})`,
              transformOrigin: "center center",
            }}
            src={`${CINEMA.scrubSrc}?v=below-hero`}
            poster={CINEMA.poster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 45%, transparent 45%, rgba(7,7,8,0.5) 100%)",
            opacity: lerp(0.3, 0.55, explodeAmt),
          }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-[40%] z-10 px-6 text-center sm:top-[42%]"
          style={{
            opacity: hookOpacity,
            transform: `translate3d(0, ${(1 - hookOpacity) * -20}px, 0)`,
          }}
        >
          <p className="mx-auto max-w-lg font-[family-name:var(--font-display)] text-[clamp(1.35rem,3.8vw,2.35rem)] leading-[1.25] font-medium tracking-[-0.02em] text-white">
            {copy.hook}
          </p>
          {!staticMode ? (
            <p className="mt-5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-white/40 uppercase">
              גללו לפירוק
            </p>
          ) : null}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-[18%] z-10 px-6 text-center"
          style={{
            opacity: midOpacity,
            transform: `translate3d(0, ${(1 - midOpacity) * 16}px, 0)`,
          }}
        >
          <p className="mx-auto max-w-md text-[clamp(1rem,2.4vw,1.35rem)] font-light tracking-[0.02em] text-white/85">
            {copy.cinemaMid}
          </p>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-[14%] z-10 px-6 text-center"
          style={{
            opacity: closeOpacity,
            transform: `translate3d(0, ${(1 - closeOpacity) * 12}px, 0)`,
          }}
        >
          <p className="mx-auto max-w-sm font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-white/70 uppercase">
            {copy.cinemaClose}
          </p>
        </div>

        <a
          href="#buy"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-[var(--color-bg)]"
        >
          {copy.skipToBuy}
        </a>
      </div>
    </section>
  );
}
