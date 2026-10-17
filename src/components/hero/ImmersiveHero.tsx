import Image from "next/image";
import { copy } from "@/lib/copy/he";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { ImmersiveHeroClientBits } from "./ImmersiveHeroClientBits";
import { MagneticLink } from "@/components/motion/MagneticButton";

/**
 * First viewport — H1 / short support / CTA only.
 * Scroll cinema renders below in page.tsx.
 */
export function ImmersiveHero() {
  return (
    <section
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-[var(--color-bg)] md:justify-center"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <Image
          src={LIFESTYLE.desk.src}
          alt={LIFESTYLE.desk.alt}
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[center_40%] scale-[1.02]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-[var(--color-bg)]/25 md:via-[var(--color-bg)]/40 md:to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 35%, rgba(216,214,210,0.12), transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-20 pt-28 text-center sm:px-8 md:pb-28 md:pt-20">
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[var(--color-accent)] uppercase">
          {copy.eyebrow}
        </p>

        <h1 className="nexa-hero-h1 mt-5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--color-text)]">
          {copy.headline}
        </h1>
        <p className="nexa-hero-h2 mx-auto mt-5 max-w-md text-[0.95rem] font-light tracking-[0.02em] text-[var(--color-text-muted)] sm:text-base">
          {copy.support}
        </p>
        <div className="nexa-hero-cta mt-9 flex flex-col items-center gap-3">
          <MagneticLink
            href="/#preorder"
            className="nexa-btn-buy min-h-12 min-w-[15rem] px-10 text-center tracking-[-0.01em]"
          >
            {copy.buyNow}
          </MagneticLink>
          <p className="text-[11px] tracking-[0.04em] text-[var(--color-text-faint)]">
            {copy.reassurance}
          </p>
        </div>
        <a
          href="/#cinema"
          className="mt-12 inline-flex flex-col items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[var(--color-text-faint)] uppercase transition hover:text-[var(--color-text)]"
        >
          <span>{copy.scrollHint}</span>
          <span className="block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" aria-hidden />
        </a>
      </div>

      <span className="pointer-events-none absolute start-4 top-20 z-10 border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase backdrop-blur-sm md:start-8 md:top-24">
        הדמיה
      </span>

      <ImmersiveHeroClientBits />
    </section>
  );
}
