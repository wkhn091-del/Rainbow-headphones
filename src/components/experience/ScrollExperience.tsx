"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NEXA_COLORS } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { LazyCanvas } from "@/components/canvas/LazyCanvas";
import { CinematicPreloader } from "./CinematicPreloader";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { useIsMobile } from "@/lib/client/mobile";

gsap.registerPlugin(ScrollTrigger);

const WORDS = copy.headline.split(" ");

/**
 * Acts 1–2: reveal + pinned drop + exploded view.
 * Mobile: shorter scrub, stacked callouts, more room for the cans.
 */
export function ScrollExperience() {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [ready, setReady] = useState(reduced);
  const [progress, setProgress] = useState(0);
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
      gsap.set(veil, { opacity: mobile ? 0.72 : 0.85 });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(veil, { opacity: mobile ? 0.18 : 0.35, duration: 1.1 }, 0);
      tl.to(
        inners,
        {
          yPercent: 0,
          duration: mobile ? 0.85 : 1.05,
          stagger: mobile ? 0.06 : 0.09,
        },
        0.12,
      );
    });

    return () => ctx.revert();
  }, [ready, reduced, mobile]);

  useEffect(() => {
    if (!ready) return;
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 160);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [ready, mobile]);

  const dropPhase = progress < 0.28;
  const explodePhase = progress >= 0.28;
  const calloutOpacity = Math.min(1, Math.max(0, (progress - 0.38) / 0.25));
  const sectionH = reduced ? "100dvh" : mobile ? "280vh" : "420vh";

  return (
    <>
      {!ready ? (
        <CinematicPreloader onDone={() => setReady(true)} />
      ) : null}

      <section
        className="nexa-scroll-section relative z-0"
        style={{ height: sectionH }}
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

          <div
            className={`pointer-events-none absolute inset-0 z-[3] flex flex-col px-4 sm:px-10 ${
              mobile
                ? "justify-between pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))]"
                : "justify-between px-5 pb-10 pt-28"
            }`}
          >
            <div
              className={`mx-auto w-full text-center transition-opacity duration-500 ${
                mobile && explodePhase ? "opacity-40" : "opacity-100"
              } ${mobile ? "max-w-sm" : "max-w-4xl"}`}
            >
              <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.32em] text-[var(--color-accent)] uppercase sm:text-[10px] sm:tracking-[0.36em]">
                {copy.eyebrow}
              </p>
              <h1
                ref={titleRef}
                className={`mt-3 font-[family-name:var(--font-display)] leading-[1.08] font-semibold tracking-[-0.04em] text-white sm:mt-5 ${
                  mobile
                    ? "text-[clamp(1.65rem,7.2vw,2.35rem)]"
                    : "text-[clamp(2.2rem,6.5vw,4.4rem)] leading-[1.05]"
                }`}
              >
                {WORDS.map((w) => (
                  <span
                    key={w}
                    className="mx-[0.1em] inline-block overflow-hidden align-bottom"
                  >
                    <span data-word className="inline-block will-change-transform">
                      {w}
                    </span>
                  </span>
                ))}
              </h1>
              <p
                className={`mx-auto mt-3 text-white/55 transition-opacity duration-500 sm:mt-5 sm:max-w-md sm:text-sm ${
                  mobile ? "max-w-[16rem] text-xs leading-relaxed" : "text-sm"
                }`}
                style={{
                  opacity: dropPhase ? 0.85 : mobile ? 0 : 0.35,
                }}
              >
                {copy.support}
              </p>
            </div>

            {/* Spacer so cans read in the middle on mobile */}
            {mobile ? <div className="min-h-[38vh] flex-1" aria-hidden /> : null}

            <div
              className={
                mobile
                  ? "mx-auto flex w-full max-w-md flex-col gap-3"
                  : "relative mx-auto grid w-full max-w-5xl grid-cols-2 gap-6"
              }
            >
              <Callout
                side="start"
                compact={mobile}
                title="ANC אדפטיבי"
                body={
                  mobile
                    ? "הרעש נשאר בחוץ"
                    : "מיקרופונים מקשיבים — הרעש נשאר בחוץ"
                }
                opacity={explodePhase ? calloutOpacity : 0}
              />
              <Callout
                side="end"
                compact={mobile}
                title={`${copy.specs[0]?.value ?? "48ש׳"} סוללה`}
                body={mobile ? "יום עבודה שלם" : "יום עבודה שלם · בלי לחפש שקע"}
                opacity={explodePhase ? calloutOpacity : 0}
              />
            </div>

            <p className="mt-3 text-center font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-white/35 uppercase sm:mt-0 sm:text-[10px] sm:tracking-[0.24em]">
              {explodePhase
                ? mobile
                  ? "גללו הלאה"
                  : "פירוק · גללו הלאה"
                : copy.scrollHint}
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
  compact,
}: {
  title: string;
  body: string;
  opacity: number;
  side: "start" | "end";
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className="rounded-sm border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md transition-opacity duration-300"
        style={{ opacity }}
      >
        <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-[var(--color-accent)] uppercase">
          {title}
        </p>
        <p className="mt-1 text-xs leading-snug text-white/75">{body}</p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-[14rem] transition-opacity duration-300 ${
        side === "end"
          ? "justify-self-end text-end"
          : "justify-self-start text-start"
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
