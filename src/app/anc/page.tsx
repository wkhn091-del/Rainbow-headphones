import { FLAGSHIP } from "@/lib/catalog";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";

export default function AncPage() {
  return (
    <PageShell title="טכנולוגיית ANC">
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>
          {FLAGSHIP.name} משתמש בביטול רעשים אקטיבי לשיחות, משרדים פתוחים
          וטיסות — בלי להבטיח «הטוב בעולם». המטרה: פוקוס נקי כשהרעש מסביב אגרסיבי.
        </p>
        <p>
          מצב שקיפות (Transparency) מאפשר לשמוע הכרזות וסביבה בלי להוריד את
          האוזניות. כוונון סופי יימדד מול יחידות ייצור.
        </p>
        <p>
          סוללה: עד {FLAGSHIP.batteryHours} שעות · טעינה מהירה{" "}
          {FLAGSHIP.fastChargeMinutes} דקות = {FLAGSHIP.fastChargePlayHours}{" "}
          שעות נגינה.
        </p>
      </div>
      <Link href="/#preorder" className="nexa-btn-buy mt-8 inline-flex">
        שמרו מקום בהשקה
      </Link>
    </PageShell>
  );
}
