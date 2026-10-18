"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NEXA_COLORS } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { LazyCanvas } from "@/components/canvas/LazyCanvas";
import { CinematicPreloader } from "./CinematicPreloader";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const WORDS = copy.headline.split(" ");

/**
 * Acts 1–2: reveal + pinned drop + exploded view with floating callouts.
 */
export function ScrollExperience() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const color = useMemo(() => NEXA_COLORS[0]!, []);

  const onProgress = useCallback((p: number) => setProgress(p), []);

  useEffect(() => {
    if (!ready || reduced) return;
    const title = titleRef.current;
    const veil = veilRef.current;
    if (!title) return;

    const inners = title.querySelectorAll<HTMLElement>("[data-word]");
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 110 });
      gsap.set(veil, { opacity: 0.85 });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(veil, { opacity: 0.35, duration: 1.1 }, 0);
      tl.to(
        inners,
        { yPercent: 0, duration: 1.05, stagger: 0.09 },
        0.15,
      );
    });

    return () => ctx.revert();
  }, [ready, reduced]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [ready]);

  const dropPhase = progress < 0.28;
  const explodePhase = progress >= 0.28;
  const calloutOpacity = Math.min(1, Math.max(0, (progress - 0.38) / 0.25));

  return (
    <>
      {!ready ? (
        <CinematicPreloader onDone={() => setReady(true)} />
      ) : null}

      <section
        ref={sectionRef}
        className="nexa-scroll-section relative z-0"
        style={{ height: reduced ? "100dvh" : "420vh" }}
        aria-label="חוויית Nexa Pro 3D"
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#0c0c0c]">
          <div
            ref={veilRef}
            className="pointer-events-none absolute inset-0 z-[2] bg-[#050505]"
            aria-hidden
          />

          <div className="absolute inset-0 z-[1]">
            {ready ? (
              <LazyCanvas
                color={color}
                reducedMotion={reduced}
                onProgress={onProgress}
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-between px-5 pb-10 pt-28 sm:px-10">
            <div className="mx-auto w-full max-w-4xl text-center">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.36em] text-[var(--color-accent)] uppercase">
                {copy.eyebrow}
              </p>
              <h1
                ref={titleRef}
                className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.2rem,6.5vw,4.4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-white"
              >
                {WORDS.map((w) => (
                  <span
                    key={w}
                    className="mx-[0.12em] inline-block overflow-hidden align-bottom"
                  >
                    <span data-word className="inline-block will-change-transform">
                      {w}
                    </span>
                  </span>
                ))}
              </h1>
              <p
                className="mx-auto mt-5 max-w-md text-sm text-white/55 transition-opacity duration-500"
                style={{ opacity: dropPhase ? 0.85 : 0.35 }}
              >
                {copy.support}
              </p>
            </div>

            <div className="relative mx-auto grid w-full max-w-5xl grid-cols-2 gap-6">
              <Callout
                side="start"
                title="ANC אדפטיבי"
                body="מיקרופונים מקשיבים — הרעש נשאר בחוץ"
                opacity={explodePhase ? calloutOpacity : 0}
              />
              <Callout
                side="end"
                title={`${copy.specs[0]?.value ?? "48ש׳"} סוללה`}
                body="יום עבודה שלם · בלי לחפש שקע"
                opacity={explodePhase ? calloutOpacity : 0}
              />
            </div>

            <p className="text-center font-[family-name:var(--font-mono)] text-[10px] tracking-[0.24em] text-white/35 uppercase">
              {explodePhase ? "פירוק · גללו הלאה" : copy.scrollHint}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Callout({
  title,
  body,
  opacity,
  side,
}: {
  title: string;
  body: string;
  opacity: number;
  side: "start" | "end";
}) {
  return (
    <div
      className={`max-w-[14rem] transition-opacity duration-300 ${
        side === "end" ? "justify-self-end text-end" : "justify-self-start text-start"
      }`}
      style={{ opacity }}
    >
      <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-accent)] uppercase">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
    </div>
  );
}
