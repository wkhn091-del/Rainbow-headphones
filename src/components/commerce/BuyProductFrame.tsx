"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NEXA_COLORS, type NexaColorId } from "@/lib/catalog";
import { BUY_PLATES } from "@/lib/media/lifestyle";
import { productTint } from "@/lib/color/product-tint";
import { SimLabel } from "@/components/brand/sim-label";

type Props = {
  colorId: NexaColorId;
};

/**
 * Studio plate: lifestyle scene + full headphones seated inside (object-contain).
 * Never macro-only; never hard circular crop that clips the cans.
 */
export function BuyProductFrame({ colorId }: Props) {
  const color = NEXA_COLORS.find((c) => c.id === colorId) ?? NEXA_COLORS[0];
  const plate = BUY_PLATES[colorId] ?? BUY_PLATES.titanium;
  const tint = productTint(colorId);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 420);
    return () => window.clearTimeout(t);
  }, [colorId]);

  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute -inset-12 -z-10 blur-3xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${tint.glow}, transparent 62%)`,
          opacity: flash ? 1 : 0.7,
        }}
        aria-hidden
      />

      <figure className="relative aspect-[4/5] overflow-hidden border border-white/12 bg-[#0a0a0c] sm:aspect-[5/6]">
        {/* Environment — headphones "live" here */}
        <Image
          key={`${colorId}-scene`}
          src={plate.scene}
          alt=""
          fill
          className="object-cover scale-105 transition-[filter] duration-500"
          style={{ filter: "brightness(0.42) saturate(0.75) contrast(1.05)" }}
          sizes="(max-width:768px) 100vw, 480px"
          aria-hidden
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: tint.wash, opacity: 0.55 }}
          aria-hidden
        />

        {/* Soft seat — oval, soft edges, does NOT clip product */}
        <div
          className="pointer-events-none absolute left-1/2 top-[46%] h-[62%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-90 blur-2xl transition-colors duration-500"
          style={{
            background: `radial-gradient(circle, ${tint.glow} 0%, transparent 68%)`,
          }}
          aria-hidden
        />

        {/* Full product — seated in frame, never clipped by caption */}
        <div
          className={`absolute inset-[8%_6%_18%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${flash ? "scale-[1.02] -translate-y-0.5" : "scale-100"}`}
        >
          <Image
            key={`${colorId}-product`}
            src={plate.product}
            alt={plate.alt}
            fill
            className="object-contain object-center drop-shadow-[0_28px_50px_rgba(0,0,0,0.85)] transition-[filter] duration-500"
            style={{ filter: tint.filter }}
            sizes="(max-width:768px) 90vw, 420px"
            priority
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent"
          aria-hidden
        />

        <span className="pointer-events-none absolute start-3 top-3 h-9 w-9 border-s border-t border-white/35" aria-hidden />
        <span className="pointer-events-none absolute end-3 top-3 h-9 w-9 border-e border-t border-white/35" aria-hidden />
        <span className="pointer-events-none absolute bottom-3 start-3 h-9 w-9 border-s border-b border-white/35" aria-hidden />
        <span className="pointer-events-none absolute bottom-3 end-3 h-9 w-9 border-e border-b border-white/35" aria-hidden />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/70 uppercase">
            Studio plate
          </p>
          <span className="border border-white/15 bg-black/55 px-2 py-1 backdrop-blur-sm">
            <SimLabel />
          </span>
        </div>

        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 pt-16">
          <div>
            <p
              className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase"
              style={{ color: tint.ring }}
            >
              {color.nameEn}
            </p>
            <p className="mt-1 text-xl text-white">{color.nameHe}</p>
          </div>
          <span
            className="mb-1 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white/45 transition-transform duration-300"
            style={{
              background: color.hex,
              transform: flash ? "scale(1.45)" : "scale(1)",
              boxShadow: `0 0 18px ${tint.glow}`,
            }}
            aria-hidden
          />
        </figcaption>
      </figure>
    </div>
  );
}
