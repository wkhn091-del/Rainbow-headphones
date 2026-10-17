"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ACCESSORIES,
  FLAGSHIP,
  NEXA_COLORS,
  PRODUCT_PRICE_ILS,
  PRODUCT_SKU,
  STUDIO_BUNDLE,
} from "@/lib/catalog";
import { isStudioBundleLive } from "@/lib/catalog/studio-bundle";
import { isColorSoldOut } from "@/lib/stock/colors";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { UpsellStrip } from "@/components/commerce/UpsellStrip";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { Product360 } from "@/components/product/Product360";

type Cat = "all" | "flagship" | "accessory" | "bundle";

/** Facets: category + color + price — brief shop rules */
export function ShopCatalog({ remainingUnits }: { remainingUnits?: number }) {
  const [cat, setCat] = useState<Cat>("all");
  const [color, setColor] = useState<"all" | (typeof NEXA_COLORS)[number]["id"]>(
    "all",
  );
  const [maxPrice, setMaxPrice] = useState(2000);
  const bundleLive = isStudioBundleLive(remainingUnits);

  const accessories = useMemo(
    () => ACCESSORIES.filter((a) => a.priceIls <= maxPrice),
    [maxPrice],
  );

  const showFlagship =
    (cat === "all" || cat === "flagship") && PRODUCT_PRICE_ILS <= maxPrice;
  const showAccessories = cat === "all" || cat === "accessory";
  const showBundle =
    bundleLive &&
    (cat === "all" || cat === "bundle") &&
    STUDIO_BUNDLE.priceIls <= maxPrice;

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2 border border-[var(--color-border)] p-3">
        {(
          [
            ["all", "הכל"],
            ["flagship", "דגל"],
            ["accessory", "אביזרים"],
            ...(bundleLive ? [["bundle", "מארז"] as const] : []),
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setCat(id)}
            className={`px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase ${
              cat === id
                ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {label}
          </button>
        ))}
        <label className="ms-auto flex items-center gap-2 text-[11px] text-[var(--color-text-faint)]">
          עד ₪
          <input
            type="range"
            min={90}
            max={2000}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-28"
          />
          <span dir="ltr">{maxPrice}</span>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setColor("all")}
          className={`text-[11px] ${color === "all" ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)]"}`}
        >
          כל הצבעים
        </button>
        {NEXA_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColor(c.id)}
            className={`inline-flex items-center gap-1.5 text-[11px] ${
              color === c.id
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-faint)]"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-white/20"
              style={{ background: c.hex }}
            />
            {c.nameHe}
            {isColorSoldOut(c.id) ? " · אזל" : ""}
          </button>
        ))}
      </div>

      {showFlagship ? (
        <article className="mt-8 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="grid gap-0 md:grid-cols-2">
            <Product360 />
            <div className="p-5">
              <p className="text-xs tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                Flagship
              </p>
              <h2 className="mt-2 text-xl text-white">{FLAGSHIP.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                ₪{PRODUCT_PRICE_ILS.toLocaleString("he-IL")} כולל מע״מ · ANC · עד{" "}
                {FLAGSHIP.batteryHours} שעות
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {NEXA_COLORS.filter(
                  (c) => color === "all" || c.id === color,
                ).map((c) => {
                  const sold = isColorSoldOut(c.id);
                  return (
                    <li key={c.id}>
                      {sold ? (
                        <span className="inline-flex items-center gap-2 border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-faint)] line-through">
                          {c.nameHe} · Sold Out
                        </span>
                      ) : (
                        <Link
                          href={`/checkout?sku=${PRODUCT_SKU}&color=${c.id}`}
                          className="inline-flex items-center gap-2 border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-white"
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-white/20"
                            style={{ background: c.hex }}
                          />
                          {c.nameHe}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/#buy" className="nexa-btn-buy inline-flex">
                  לבחירת צבע ותשלום
                </Link>
                {!isColorSoldOut("titanium") ? (
                  <AddToCartButton
                    sku={PRODUCT_SKU}
                    colorId="titanium"
                    label="להוסיף טיטניום לעגלה"
                  />
                ) : null}
              </div>
              <UpsellStrip sku={PRODUCT_SKU} />
            </div>
          </div>
        </article>
      ) : null}

      {showAccessories ? (
        <>
          <h2 className="mt-12 text-lg text-white">אביזרים</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {accessories.map((a, i) => (
              <li
                key={a.sku}
                className="overflow-hidden border border-[var(--color-border)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={i === 0 ? LIFESTYLE.case.src : LIFESTYLE.parts.src}
                    alt={a.nameHe}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-white">{a.nameHe}</p>
                    <p
                      className="text-xs text-[var(--color-text-faint)]"
                      dir="ltr"
                    >
                      {a.sku}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-[var(--color-accent)]">
                      ₪{a.priceIls}
                    </p>
                    <AddToCartButton sku={a.sku} label="להוסיף" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {showBundle ? (
        <article className="mt-12 border border-[var(--color-border)] p-5">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
            Post-launch
          </p>
          <h2 className="mt-2 text-lg text-white">{STUDIO_BUNDLE.nameHe}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            ₪{STUDIO_BUNDLE.priceIls.toLocaleString("he-IL")} במקום ₪
            {STUDIO_BUNDLE.separateTotalIls.toLocaleString("he-IL")} · אוזניות +
            Dock
          </p>
          <div className="mt-4">
            <AddToCartButton sku={STUDIO_BUNDLE.sku} label="להוסיף מארז" />
          </div>
        </article>
      ) : null}
    </div>
  );
}
