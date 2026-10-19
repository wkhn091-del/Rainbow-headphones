import { FLAGSHIP, LAUNCH } from "@/lib/catalog";

/**
 * E1-15 / P12 — real catalog numbers only (Motion of Millions rule 7: truth).
 */
export function ProofStrip() {
  const items = [
    { k: "סוללה", v: `${FLAGSHIP.batteryHours} שעות` },
    { k: "השקה", v: `${LAUNCH.totalUnits} יחידות` },
    { k: "אחריות", v: `${FLAGSHIP.warrantyYears} שנים` },
    { k: "החזרה", v: `${FLAGSHIP.returnDays} יום` },
  ] as const;

  return (
    <section
      className="border-y border-white/8 bg-[#0e0e10] px-5 py-14 sm:px-8"
      aria-label="מספרים אמיתיים"
      data-depth="steel"
    >
      <p className="mb-8 text-center font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-text-faint)] uppercase">
        בלי סיסמאות · רק מה שבקטלוג
      </p>
      <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
        {items.map((item) => (
          <li key={item.k} className="text-center">
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.4rem)] tracking-[-0.04em] text-white">
              {item.v}
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/40 uppercase">
              {item.k}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
