import { BUSINESS, vatLabel } from "@/lib/business";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";

export default function SupportPage() {
  return (
    <PageShell title="תמיכה ושירות">
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>
          {BUSINESS.legalName} · {vatLabel()}
        </p>
        <p>
          מייל:{" "}
          <a
            href={`mailto:${BUSINESS.supportEmail}`}
            className="text-[var(--color-text)] underline-offset-4 hover:underline"
          >
            {BUSINESS.supportEmail}
          </a>
        </p>
        <p>
          טלפון:{" "}
          <a
            href={`tel:+${BUSINESS.phoneE164}`}
            className="text-[var(--color-text)] underline-offset-4 hover:underline"
            dir="ltr"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </p>
        <p>
          שעות מענה: {BUSINESS.hoursHe} · {BUSINESS.cityHe} (ללא קבלת קהל)
        </p>
        <p>
          אחריות שנתיים חלופי-עד-הבית ·{" "}
          <Link
            href="/warranty/activate"
            className="text-[var(--color-text)] underline-offset-4 hover:underline"
          >
            הפעלת אחריות
          </Link>
        </p>
      </div>
      <Link href="/faq" className="nexa-btn-accent mt-8 inline-flex">
        לשאלות נפוצות
      </Link>
    </PageShell>
  );
}
