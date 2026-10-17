import { FLAGSHIP, LAUNCH } from "@/lib/catalog";

const ITEMS = [
  { k: "החזרה", v: `${FLAGSHIP.returnDays} יום` },
  { k: "אחריות", v: `${FLAGSHIP.warrantyYears} שנים עד הבית` },
  { k: "משלוח", v: "עד 48 ש׳" },
  { k: "מלאי", v: `${LAUNCH.totalUnits} יחידות` },
  { k: "מחיר", v: "כולל מע״מ" },
] as const;

/** Quiet policy strip */
export function TrustRow() {
  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--color-border)] px-5 py-5 sm:px-8">
      {ITEMS.map((item) => (
        <li key={item.k} className="text-[12px]">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
            {item.k}
          </span>
          <span className="ms-2 text-[var(--color-text-muted)]">{item.v}</span>
        </li>
      ))}
    </ul>
  );
}
