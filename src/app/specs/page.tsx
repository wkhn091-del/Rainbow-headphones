import { FLAGSHIP, NEXA_COLORS, PRODUCT_PRICE_ILS } from "@/lib/catalog";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";

export default function SpecsPage() {
  const rows = [
    { k: "סוללה", v: `עד ${FLAGSHIP.batteryHours} שעות` },
    {
      k: "טעינה מהירה",
      v: `${FLAGSHIP.fastChargeMinutes} דקות → ${FLAGSHIP.fastChargePlayHours} שעות נגינה`,
    },
    { k: "עמידות", v: FLAGSHIP.waterRating },
    { k: "משקל (טיוטה)", v: `~${FLAGSHIP.weightGramsDraft}ג` },
    { k: "מחיר", v: `₪${PRODUCT_PRICE_ILS.toLocaleString("he-IL")} כולל מע״מ` },
    { k: "החזרה", v: `${FLAGSHIP.returnDays} יום` },
    { k: "אחריות", v: `${FLAGSHIP.warrantyYears} שנים חלופי עד הבית` },
    {
      k: "צבעים",
      v: NEXA_COLORS.map((c) => c.nameHe).join(" · "),
    },
  ];

  return (
    <PageShell title="מפרט טכני">
      <p className="text-sm text-[var(--color-text-muted)]">
        {FLAGSHIP.name} — נתונים להשקה. משקל סופי יעודכן עם יחידת הייצור.
      </p>
      <dl className="mt-8 divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
          >
            <dt className="text-[var(--color-text-faint)]">{r.k}</dt>
            <dd className="text-[var(--color-text)]">{r.v}</dd>
          </div>
        ))}
      </dl>
      <Link href="/#buy" className="nexa-btn-buy mt-8 inline-flex">
        לרכישה
      </Link>
    </PageShell>
  );
}
