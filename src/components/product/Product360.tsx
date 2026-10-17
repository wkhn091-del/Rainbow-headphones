"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { NEXA_COLORS, type NexaColorId } from "@/lib/catalog";
import { SimLabel } from "@/components/brand/sim-label";

const FRAMES = [
  LIFESTYLE.detail,
  LIFESTYLE.desk,
  LIFESTYLE.wear,
  LIFESTYLE.studio,
  LIFESTYLE.case,
  LIFESTYLE.parts,
] as const;

type Props = {
  className?: string;
  colorId?: NexaColorId;
  /** Prefer a single premium still instead of 360 drag */
  still?: "detail" | "desk" | "case";
};

/** Lightweight drag 360 — or premium still with color wash */
export function Product360({
  className = "",
  colorId = "titanium",
  still,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);

  const color = useMemo(
    () => NEXA_COLORS.find((c) => c.id === colorId) ?? NEXA_COLORS[0],
    [colorId],
  );

  const tint = useMemo(() => {
    if (colorId === "obsidian") {
      return {
        filter: "brightness(0.88) contrast(1.08) saturate(0.85)",
        overlay: "rgba(20,20,24,0.35)",
        glow: "rgba(90,90,100,0.35)",
      };
    }
    if (colorId === "ice") {
      return {
        filter: "brightness(1.05) contrast(1.02) hue-rotate(165deg) saturate(1.15)",
        overlay: "rgba(126,184,196,0.28)",
        glow: "rgba(126,184,196,0.45)",
      };
    }
    return {
      filter: "brightness(1.02) contrast(1.04) saturate(0.95)",
      overlay: "rgba(194,200,208,0.22)",
      glow: "rgba(194,200,208,0.4)",
    };
  }, [colorId]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || still) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.current = { x: e.clientX, start: idx };
    },
    [idx, reduced, still],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current || reduced || still) return;
      const dx = e.clientX - drag.current.x;
      const step = Math.round(dx / 28);
      const next =
        (((drag.current.start - step) % FRAMES.length) + FRAMES.length) %
        FRAMES.length;
      setIdx(next);
    },
    [reduced, still],
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const frame = still
    ? LIFESTYLE[still]
    : (FRAMES[idx] ?? FRAMES[0]);

  return (
    <div
      className={`relative aspect-[4/5] touch-none select-none overflow-hidden bg-[var(--color-surface)] sm:aspect-square ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label={`${color.nameHe} — תצוגת מוצר`}
      style={{
        boxShadow: `0 0 80px ${tint.glow}`,
      }}
    >
      <Image
        src={frame.src}
        alt={frame.alt}
        fill
        className="object-cover transition-[filter] duration-500"
        style={{ filter: tint.filter }}
        sizes="(max-width:768px) 100vw, 480px"
        draggable={false}
        priority={false}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-color transition-colors duration-500"
        style={{ background: tint.overlay }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
        aria-hidden
      />
      <span className="nexa-sim-badge">
        <SimLabel />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/80 uppercase">
          {color.nameEn}
        </p>
        <p className="mt-0.5 text-sm text-white">{color.nameHe}</p>
        {!still && !reduced ? (
          <p className="mt-2 text-[10px] tracking-[0.16em] text-white/45 uppercase">
            גררו · 360°
          </p>
        ) : null}
      </div>
    </div>
  );
}
