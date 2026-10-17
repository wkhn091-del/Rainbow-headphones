import { FLAGSHIP, LAUNCH } from "@/lib/catalog";
import { BUSINESS } from "@/lib/business";

/**
 * Cold-start trust hierarchy — real anchors only.
 * No fake stars / invented reviews.
 */
export function ColdStartTrust({
  className = "mt-4",
}: {
  className?: string;
}) {
  const items = [
    { k: "החזרה", v: `${FLAGSHIP.returnDays} יום` },
    { k: "אחריות", v: `${FLAGSHIP.warrantyYears} שנים עד הבית` },
    { k: "מלאי", v: `${LAUNCH.totalUnits} יחידות השקה` },
    { k: "מע״מ", v: "כלול במחיר" },
  ];

  return (
    <div className={className} aria-label="אמון ומדיניות">
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => (
          <li key={item.k} className="text-[11px]">
            <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase">
              {item.k}
            </span>
            <span className="ms-1.5 text-[var(--color-text-muted)]">{item.v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-[var(--color-text-faint)]">
        שירות:{" "}
        <a
          href={`mailto:${BUSINESS.supportEmail}`}
          className="underline-offset-2 hover:underline"
        >
          {BUSINESS.supportEmail}
        </a>
        {" · "}
        <a
          href={`tel:+${BUSINESS.phoneE164}`}
          className="underline-offset-2 hover:underline"
          dir="ltr"
        >
          {BUSINESS.phoneDisplay}
        </a>
      </p>
    </div>
  );
}
