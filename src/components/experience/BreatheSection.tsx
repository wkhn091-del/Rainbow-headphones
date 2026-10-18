"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAGSHIP } from "@/lib/catalog";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { useIsMobile } from "@/lib/client/mobile";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { value: `${FLAGSHIP.batteryHours}`, unit: "שעות", label: "סוללה רציפה" },
  {
    value: `${FLAGSHIP.fastChargeMinutes}`,
    unit: "דק׳",
    label: `→ ${FLAGSHIP.fastChargePlayHours} שעות האזנה`,
  },
  { value: "ANC", unit: "", label: "ביטול רעשים אדפטיבי" },
  { value: `${FLAGSHIP.warrantyYears}`, unit: "שנים", label: "אחריות עד הבית" },
  { value: "IPX4", unit: "", label: "עמידות בזיעה וגשם קל" },
] as const;

/**
 * Act 3 — desktop: pinned horizontal scrub.
 * Mobile: native snap swipe (no pin fights with iOS chrome).
 */
export function BreatheSection() {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || reduced || mobile) return;

    const measure = () =>
      Math.max(0, track.scrollWidth - window.innerWidth);

    let total = measure();
    const st = ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: () => `+=${Math.round(measure() * 1.1)}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        total = measure();
        gsap.set(track, { x: -total * self.progress });
      },
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [reduced, mobile]);

  if (mobile || reduced) {
    return (
      <section
        className="nexa-breathe relative z-10 border-t border-white/8 bg-[#0c0c0c] py-14"
        aria-label="נתונים"
        data-depth="bone"
      >
        <p className="mb-6 px-5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-text-faint)] uppercase">
          נתונים · החליקו הצידה
        </p>
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {CARDS.map((card) => (
            <BreatheCard key={card.label} {...card} reduced mobile />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={pinRef}
      className="nexa-breathe relative z-10 bg-[#0c0c0c]"
      aria-label="נתונים"
      data-depth="bone"
    >
      <div className="flex h-[100dvh] items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-[12vw] px-[10vw] will-change-transform"
        >
          {CARDS.map((card) => (
            <BreatheCard key={card.label} {...card} reduced={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BreatheCard({
  value,
  unit,
  label,
  reduced,
  mobile = false,
}: {
  value: string;
  unit: string;
  label: string;
  reduced: boolean;
  mobile?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || mobile) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const text = el.querySelector<HTMLElement>("[data-parallax]");
    if (!text) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(text, {
        x: -nx * 18,
        y: -ny * 12,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, mobile]);

  if (mobile) {
    return (
      <article
        ref={ref}
        className="flex h-[52vh] w-[min(82vw,340px)] shrink-0 snap-center flex-col justify-center border border-white/10 bg-white/[0.02] px-6"
      >
        <div>
          <p className="font-[family-name:var(--font-display)] text-[clamp(3.4rem,18vw,5.5rem)] leading-none font-semibold tracking-[-0.06em] text-white">
            {value}
            {unit ? (
              <span className="ms-2 text-[0.28em] font-normal tracking-normal text-white/40">
                {unit}
              </span>
            ) : null}
          </p>
          <p className="mt-6 max-w-[14rem] text-sm leading-relaxed text-[var(--color-text-muted)]">
            {label}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className="flex h-[70vh] w-[min(78vw,520px)] shrink-0 flex-col justify-center border-s border-white/10 ps-8 sm:ps-14"
    >
      <div data-parallax className="will-change-transform">
        <p className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,14vw,9rem)] leading-none font-semibold tracking-[-0.06em] text-white">
          {value}
          {unit ? (
            <span className="ms-2 text-[0.28em] font-normal tracking-normal text-white/40">
              {unit}
            </span>
          ) : null}
        </p>
        <p className="mt-8 max-w-xs text-sm tracking-[0.04em] text-[var(--color-text-muted)]">
          {label}
        </p>
      </div>
    </article>
  );
}
