"use client";

import { NEXA_COLORS, type NexaColorId } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { isColorSoldOut } from "@/lib/stock/colors";

type Props = {
  value: NexaColorId;
  onChange: (id: NexaColorId) => void;
};

export function ColorSwatches({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap items-center gap-4"
      role="radiogroup"
      aria-label={copy.colorLabel}
    >
      {NEXA_COLORS.map((c) => {
        const on = c.id === value;
        const sold = isColorSoldOut(c.id);
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={sold ? `${c.nameHe} — אזל` : c.nameHe}
            onClick={() => onChange(c.id)}
            className="group relative"
          >
            <span
              className={`block h-12 w-12 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-active:scale-95 ${on ? "scale-110" : ""}`}
              style={{
                background: `radial-gradient(circle at 32% 28%, #ffffff88, ${c.hex} 48%, #0a0a0c 130%)`,
                boxShadow: on
                  ? `0 0 0 2px #0c0c0c, 0 0 0 4px ${c.hex}, 0 0 28px ${c.hex}99`
                  : "inset 0 1px 1px #ffffff40, 0 0 0 1px #2A2C33",
                opacity: sold ? 0.45 : 1,
              }}
            />
            {sold ? (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="h-px w-10 rotate-[-35deg] bg-white/70" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
