"use client";

import Image from "next/image";
import { ACCESSORIES, FLAGSHIP, STUDIO_BUNDLE } from "@/lib/catalog";
import { useCartStore } from "@/lib/store/cart";

/**
 * Act 4 — asymmetric bento upsell + glass trust chips.
 */
export function StudioBento() {
  const add = useCartStore((s) => s.add);
  const dock = ACCESSORIES.find((a) => a.sku === "nexa-dock")!;
  const link = ACCESSORIES.find((a) => a.sku === "nexa-link")!;

  return (
    <section
      className="nexa-atmosphere relative z-10 border-t border-white/10 px-4 py-16 sm:px-8 sm:py-24"
      data-depth="steel"
      aria-label="מארז אולפן"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[var(--color-accent)] uppercase">
              Ecosystem
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.55rem,6vw,2.8rem)] tracking-[-0.035em] text-white">
              מארז האולפן
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
              עמדת טעינה מגנטית וכבל קלוע — בלי רשימה משעממת, בקוביות נקיות.
            </p>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-sm text-white/70">
            ₪{STUDIO_BUNDLE.priceIls.toLocaleString("he-IL")}
            <span className="ms-2 text-white/30 line-through">
              ₪{STUDIO_BUNDLE.separateTotalIls.toLocaleString("he-IL")}
            </span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 md:grid-cols-6 md:grid-rows-2 md:gap-4">
          <article className="group relative min-h-[220px] overflow-hidden border border-white/12 bg-[#121214] sm:min-h-[280px] md:col-span-4 md:row-span-2 md:min-h-[420px]">
            <Image
              src="/images/accessories-atmosphere.jpg"
              alt={dock.nameHe}
              fill
              className="object-cover object-[30%_40%] transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width:768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-8">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-accent)] uppercase">
                  Nexa Dock
                </p>
                <h3 className="mt-2 text-lg text-white sm:text-2xl">{dock.nameHe}</h3>
                <p className="mt-1 text-sm text-white/55">טעינה בלי כבל · על השולחן</p>
              </div>
              <button
                type="button"
                onClick={() => add({ sku: dock.sku, qty: 1 })}
                className="nexa-btn-buy w-full shrink-0 px-5 py-3 text-sm sm:w-auto"
              >
                ₪{dock.priceIls}
              </button>
            </div>
          </article>

          <article className="group relative min-h-[180px] overflow-hidden border border-white/12 bg-[#121214] sm:min-h-[200px] md:col-span-2">
            <Image
              src="/images/lifestyle/nexa-real-parts.jpg"
              alt={link.nameHe}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-white/50 uppercase">
                Nexa Link
              </p>
              <h3 className="mt-1 text-lg text-white">{link.nameHe}</h3>
              <button
                type="button"
                onClick={() => add({ sku: link.sku, qty: 1 })}
                className="mt-3 text-sm text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                להוסיף · ₪{link.priceIls}
              </button>
            </div>
          </article>

          <div className="flex flex-col justify-between gap-3 border border-white/10 bg-white/[0.03] p-5 md:col-span-2">
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              {FLAGSHIP.name} + Dock + Link — הכל מוכן מהקופסה הראשונה.
            </p>
            <ul className="flex flex-wrap gap-2">
              <GlassChip>שנתיים אחריות</GlassChip>
              <GlassChip>משלוח חינם</GlassChip>
              <GlassChip>14 יום החזרה</GlassChip>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassChip({ children }: { children: string }) {
  return (
    <li className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-white/80 uppercase backdrop-blur-md">
      {children}
    </li>
  );
}
