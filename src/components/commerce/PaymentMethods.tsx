"use client";

import Image from "next/image";
import { NEXA_COLORS, type NexaColorId } from "@/lib/catalog";
import { productTint } from "@/lib/color/product-tint";
import { isColorSoldOut } from "@/lib/stock/colors";

type Props = {
  variant?: "compact" | "full";
  className?: string;
  /** Sync with buy color — headphones + strip accents */
  colorId?: NexaColorId;
  onColorChange?: (id: NexaColorId) => void;
};

function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-3.5 w-11" aria-hidden>
      <text
        x="0"
        y="13"
        fill="#1A1F71"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="14"
        fontStyle="italic"
        fontWeight="900"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 36 22" className="h-5 w-8" aria-hidden>
      <circle cx="13" cy="11" r="9" fill="#EB001B" />
      <circle cx="23" cy="11" r="9" fill="#F79E1B" />
      <path
        d="M18 4.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-3.5 w-11" aria-hidden>
      <rect width="48" height="16" rx="2" fill="#2E77BC" />
      <text
        x="24"
        y="11.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.5"
      >
        AMEX
      </text>
    </svg>
  );
}

function IsracardMark() {
  return (
    <svg viewBox="0 0 40 16" className="h-3.5 w-9" aria-hidden>
      <rect width="40" height="16" rx="2" fill="#E31837" />
      <text
        x="20"
        y="11.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontSize="6"
        fontWeight="700"
      >
        ISRACARD
      </text>
    </svg>
  );
}

function MaxMark() {
  return (
    <svg viewBox="0 0 36 16" className="h-3.5 w-8" aria-hidden>
      <rect width="36" height="16" rx="2" fill="#0057B8" />
      <text
        x="18"
        y="11.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="800"
      >
        MAX
      </text>
    </svg>
  );
}

function BitMark() {
  return (
    <svg viewBox="0 0 40 16" className="h-3.5 w-9" aria-hidden>
      <rect width="40" height="16" rx="2" fill="#00AEEF" />
      <text
        x="20"
        y="11.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
      >
        bit
      </text>
    </svg>
  );
}

function ApplePayMark() {
  return (
    <svg viewBox="0 0 52 16" className="h-3.5 w-12" aria-hidden>
      <path
        fill="#fff"
        d="M9.2 3.4c.55-.65.9-1.55.8-2.45-.85.05-1.9.55-2.5 1.25-.55.6-1.05 1.55-.85 2.45.95.05 1.9-.45 2.55-1.25zM9.5 4.4c-1.3-.05-2.4.75-3 .75s-1.55-.7-2.6-.7c-1.35 0-2.55.75-3.25 1.95-1.4 2.4-.35 5.95 1 7.85.65.95 1.45 2 2.5 1.95 1 0 1.4-.65 2.6-.65s1.5.65 2.6.65c1.1 0 1.8-.95 2.45-1.9.75-1.1 1.05-2.15 1.05-2.2-.05 0-2-.75-2-3 0-1.85 1.5-2.75 1.55-2.8-.9-1.3-2.25-1.45-2.7-1.45-.05 0-.15 0-.2 0z"
      />
      <text
        x="36"
        y="12"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="600"
      >
        Pay
      </text>
    </svg>
  );
}

function GooglePayMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-3.5 w-11" aria-hidden>
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
        <tspan fill="#5F6368"> Pay</tspan>
      </text>
    </svg>
  );
}

const NETWORKS = [
  { id: "visa", label: "Visa", Mark: VisaMark, dark: false },
  { id: "mc", label: "Mastercard", Mark: MastercardMark, dark: false },
  { id: "amex", label: "American Express", Mark: AmexMark, dark: false },
  { id: "isra", label: "Isracard", Mark: IsracardMark, dark: false },
  { id: "max", label: "MAX", Mark: MaxMark, dark: false },
  { id: "bit", label: "bit", Mark: BitMark, dark: false },
  { id: "apple", label: "Apple Pay", Mark: ApplePayMark, dark: true },
  { id: "google", label: "Google Pay", Mark: GooglePayMark, dark: false },
] as const;

const PRODUCT_SRC = "/videos/product/poster-01.jpg";

/**
 * Payment strip + Silent Gallery cans that drop into the checkout zone.
 * Color swatches sync headphones filter + strip accent to buy color.
 */
export function PaymentMethods({
  variant = "compact",
  className = "",
  colorId = "titanium",
  onColorChange,
}: Props) {
  const color = NEXA_COLORS.find((c) => c.id === colorId) ?? NEXA_COLORS[0];
  const tint = productTint(colorId);
  const interactive = Boolean(onColorChange);

  return (
    <div className={className} aria-label="אמצעי תשלום וצבע">
      {/* Headphones descend into payment — Quiet / NEXA plate */}
      <div
        className="relative mb-4 overflow-hidden border transition-[border-color,box-shadow] duration-500"
        style={{
          borderColor: `${color.hex}55`,
          boxShadow: `0 0 40px ${tint.glow}`,
          background: `linear-gradient(105deg, #0a0c10 0%, #1a1e26 45%, ${color.hex}33 100%)`,
        }}
      >
        <p className="absolute inset-x-0 top-3 z-10 text-center font-[family-name:var(--font-mono)] text-[9px] tracking-[0.28em] text-white/45 uppercase">
          Silent Gallery
        </p>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-30 sm:px-6">
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-black/50 sm:text-3xl">
            Quiet
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-black/50 sm:text-3xl">
            Nexa
          </span>
        </div>

        <div
          key={colorId}
          className="nexa-pay-drop relative mx-auto h-40 w-full max-w-[220px] sm:h-48"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl sm:h-36 sm:w-36"
            style={{ background: tint.glow }}
            aria-hidden
          />
          <Image
            src={PRODUCT_SRC}
            alt={`${color.nameHe} — לתשלום`}
            fill
            className="object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-[filter] duration-500"
            style={{ filter: tint.filter }}
            sizes="220px"
          />
        </div>

        {interactive ? (
          <div className="relative z-10 flex flex-col items-center gap-2 pb-4">
            <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-white/50 uppercase">
              צבע בסליקה
            </p>
            <div
              className="flex items-center gap-3"
              role="radiogroup"
              aria-label="צבע האוזניות בתשלום"
            >
              {NEXA_COLORS.map((c) => {
                const on = c.id === colorId;
                const sold = isColorSoldOut(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={c.nameHe}
                    disabled={sold}
                    onClick={() => onColorChange?.(c.id)}
                    className="relative"
                  >
                    <span
                      className="block h-8 w-8 rounded-full transition-transform duration-300"
                      style={{
                        background: `radial-gradient(circle at 30% 28%, #fff8, ${c.hex} 50%, #0a0a0c)`,
                        boxShadow: on
                          ? `0 0 0 2px #0c0c0c, 0 0 0 3px ${c.hex}, 0 0 16px ${c.hex}`
                          : "0 0 0 1px #333",
                        transform: on ? "scale(1.12)" : "scale(1)",
                        opacity: sold ? 0.4 : 1,
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: tint.ring }}
            >
              {color.nameHe}
            </p>
          </div>
        ) : (
          <p
            className="relative z-10 pb-3 text-center text-xs"
            style={{ color: tint.ring }}
          >
            {color.nameHe}
          </p>
        )}
      </div>

      {/* Exact strip style — white logo cards like reference */}
      <div
        className="overflow-hidden border transition-colors duration-500"
        style={{ borderColor: `${color.hex}40` }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b px-3 py-2.5 transition-colors duration-500"
          style={{
            borderColor: `${color.hex}28`,
            background: `linear-gradient(90deg, ${color.hex}14, transparent)`,
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
            מקבלים תשלום
          </p>
          <p className="text-[10px] text-[var(--color-text-faint)]">
            Grow · סליקה מאובטחת
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 bg-black/40 px-3 py-3">
          {NETWORKS.map(({ id, label, Mark, dark }) => (
            <li
              key={id}
              title={label}
              className={`flex h-9 min-w-[3.25rem] items-center justify-center rounded-sm px-2.5 ${
                dark
                  ? "bg-[#111] ring-1 ring-white/20"
                  : "bg-white"
              }`}
            >
              <Mark />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {variant === "full" ? (
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-text-faint)]">
          Visa · Mastercard · Amex · Isracard · MAX · bit · Apple Pay · Google Pay
        </p>
      ) : (
        <p className="mt-2 text-[10px] text-[var(--color-text-faint)]">
          תשלום מאובטח · כולל מע״מ · בלי התחברות חובה
        </p>
      )}
    </div>
  );
}
