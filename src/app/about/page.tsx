import Image from "next/image";
import Link from "next/link";
import { FLAGSHIP, LAUNCH } from "@/lib/catalog";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { PageShell } from "@/components/layout/PageShell";

export default function AboutPage() {
  return (
    <PageShell title="Nexa Audio">
      <div className="relative mb-8 aspect-[16/9] overflow-hidden">
        <Image
          src={LIFESTYLE.studio.src}
          alt={LIFESTYLE.studio.alt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 720px"
          priority
        />
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
        נבנו אוזניות אלחוטיות אחת סביב חומרת אולפן: ביטול רעשים אקטיבי, סוללה של{" "}
        {FLAGSHIP.batteryHours} שעות, ואחריות {FLAGSHIP.warrantyYears} שנים חלופי עד
        הבית. המותג חדש — רוכשי ההשקה הם הלקוחות הראשונים: {LAUNCH.totalUnits} יחידות
        ממוספרות, בלי מלאי אינסופי ובלי מבצעים מזויפים.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
        מה שתראו באתר זה מה שיש: סרטונים אמיתיים, מודל תלת־ממד לבדיקת זווית, ומחיר כולל
        מע״מ. בלי דירוגי כוכבים מזויפים ובלי «נמכרו 50,000».
      </p>
      <Link href="/#buy" className="nexa-btn-buy mt-8 inline-flex">
        לרכישת {FLAGSHIP.name}
      </Link>
    </PageShell>
  );
}
