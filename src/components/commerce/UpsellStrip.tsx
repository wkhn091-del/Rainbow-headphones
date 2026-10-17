"use client";

import Image from "next/image";
import { ACCESSORIES, FLAGSHIP, PRODUCT_SKU, STUDIO_BUNDLE } from "@/lib/catalog";
import { getUpsellSkus } from "@/lib/search/catalog-index";
import { useCartStore } from "@/lib/store/cart";

type Props = {
  sku?: string;
  title?: string;
};

/** Distinct real stills — dock vs cable, not the same crop twice */
const VISUAL: Record<
  string,
  { src: string; alt: string; position: string; badge: string }
> = {
  "nexa-dock": {
    src: "/images/accessories-atmosphere.jpg",
    alt: "עמדת טעינה מגנטית על אבן",
    position: "object-[30%_35%] scale-[1.15]",
    badge: "רוב הקונים מוסיפים",
  },
  "nexa-link": {
    src: "/images/lifestyle/nexa-real-parts.jpg",
    alt: "כבל ואביזרים — מקרוב",
    position: "object-center scale-105",
    badge: "₪90 במקום ₪120",
  },
};

function priceFor(sku: string) {
  if (sku === PRODUCT_SKU) return FLAGSHIP.priceIls;
  return ACCESSORIES.find((a) => a.sku === sku)?.priceIls ?? 0;
}

function nameFor(sku: string) {
  if (sku === PRODUCT_SKU) return FLAGSHIP.name;
  return ACCESSORIES.find((a) => a.sku === sku)?.nameHe ?? sku;
}

function blurbFor(sku: string) {
  if (sku === "nexa-dock") return "טעינה בלי כבל · על השולחן";
  if (sku === "nexa-link") return "קלוע · עמיד · תמיד בתיק";
  return "משלים את החוויה";
}

export function UpsellStrip({
  sku = PRODUCT_SKU,
  title = "קונים עם זה גם",
}: Props) {
  const add = useCartStore((s) => s.add);
  const lines = useCartStore((s) => s.lines);
  const inCart = new Set(lines.map((l) => l.sku));
  const offers = getUpsellSkus(sku).filter((s) => !inCart.has(s));

  if (!offers.length) return null;

  return (
    <div className={title ? "mt-6 text-start" : "mt-10 text-start"}>
      {title ? (
        <p className="text-xs tracking-[0.12em] text-[var(--color-text-faint)] uppercase">
          {title}
        </p>
      ) : null}

      <p className="mb-6 text-center text-sm text-[var(--color-accent)]">
        מארז אולפן ₪{STUDIO_BUNDLE.priceIls.toLocaleString("he-IL")} — חיסכון מול
        קנייה נפרדת
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {offers.map((s) => {
          const added = inCart.has(s);
          const visual = VISUAL[s] ?? {
            src: "/images/lifestyle/nexa-real-case.jpg",
            alt: nameFor(s),
            position: "object-cover",
            badge: "להוסיף",
          };
          return (
            <li
              key={s}
              className="group flex flex-col overflow-hidden border border-white/12 bg-[#121212] transition hover:border-white/28"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  className={`object-cover transition duration-500 group-hover:scale-[1.04] ${visual.position}`}
                  sizes="(max-width:640px) 100vw, 340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <p className="absolute start-3 bottom-3 max-w-[90%] font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--color-accent)] uppercase">
                  {visual.badge}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-base text-white">{nameFor(s)}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {blurbFor(s)}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-lg text-[var(--color-accent)]">
                    ₪{priceFor(s).toLocaleString("he-IL")}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={added}
                  className="nexa-btn-buy mt-auto w-full py-3 text-sm disabled:opacity-50"
                  onClick={() =>
                    add({
                      sku: s,
                      qty: 1,
                      colorId: s === PRODUCT_SKU ? "titanium" : undefined,
                    })
                  }
                >
                  {added ? "בעגלה ✓" : "להוסיף עכשיו"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
