import Image from "next/image";
import Link from "next/link";
import { ACCESSORIES, FLAGSHIP, LAUNCH, STUDIO_BUNDLE } from "@/lib/catalog";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { copy } from "@/lib/copy/he";
import { SimLabel } from "@/components/brand/sim-label";
import { FaqAccordion } from "@/components/commerce/FaqAccordion";
import { Reveal } from "./Reveal";

const BENEFITS = [
  {
    k: "01",
    title: "שקט שעובד",
    body: "ANC שמנתק רעש רקע — בלי להרגיש שאתם בבועה מלאכותית.",
  },
  {
    k: "02",
    title: `${FLAGSHIP.batteryHours} שעות`,
    body: "יום עבודה מלא, טיסה ארוכה, סשן ערבוב — בלי ציד שקע.",
  },
  {
    k: "03",
    title: "אחריות עד הבית",
    body: `${FLAGSHIP.warrantyYears} שנים חלופי עד הדלת. לא «תשלחו אלינו ותחכו».`,
  },
] as const;

const GALLERY = [
  LIFESTYLE.desk,
  LIFESTYLE.wear,
  LIFESTYLE.studio,
  LIFESTYLE.detail,
  LIFESTYLE.parts,
  LIFESTYLE.case,
] as const;

export function HomeBelowFold() {
  return (
    <>
      <section className="relative overflow-hidden border-t border-[var(--color-border)]">
        <div className="relative min-h-[52vh] md:min-h-[62vh]">
          <Image
            src={LIFESTYLE.desk.src}
            alt={LIFESTYLE.desk.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-black/55 to-black/25" />
          <Reveal className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
                מהסרטון אל האוזן
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.8vw,2.75rem)] leading-[1.1] tracking-[-0.035em] text-[var(--color-text)]">
                מהסרטון — אל האוזן.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">
                הסינמה מהצילומים האמיתיים. אחר כך המודל בתלת־ממד זז איתכם עד
                לתשלום.
              </p>
              <Link href="/#buy" className="nexa-btn-buy mt-8 inline-flex">
                לרכישה · {copy.priceLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        data-depth="bone"
        className="nexa-atmosphere nexa-depth-wash relative overflow-hidden border-t border-[var(--color-border)] px-5 py-20 sm:px-8"
      >
        <Reveal className="relative z-[1] mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
                למה Nexa
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.2vw,2.5rem)] tracking-[-0.035em] text-[var(--color-text)]">
                שלושה דברים מהיום הראשון
              </h2>
            </div>
            <div className="relative hidden h-28 w-40 overflow-hidden border border-white/10 md:block">
              <Image
                src={LIFESTYLE.desk.src}
                alt=""
                fill
                className="object-cover object-center"
                sizes="160px"
              />
            </div>
          </div>
          <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <li key={b.title} className="bg-[var(--color-bg)] p-7">
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-text-faint)]">
                  {b.k}
                </p>
                <p className="mt-3 text-xl tracking-[-0.02em] text-white">
                  {b.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section
        data-depth="cyan"
        className="nexa-depth-wash relative border-t border-[var(--color-border)]"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative order-2 min-h-[340px] md:order-1 md:min-h-[520px]">
            <Image
              src={LIFESTYLE.studio.src}
              alt={LIFESTYLE.studio.alt}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-black/35" />
          </div>
          <div className="order-1 flex flex-col justify-center bg-gradient-to-b from-[#12161c] to-[#0c0c0c] px-5 py-16 sm:px-12 md:order-2">
            <Reveal>
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
                בלי סיכון
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.035em] text-white">
                {copy.lossAversion}
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-white/60">
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)]">—</span>
                  אחריות {FLAGSHIP.warrantyYears} שנים חלופי עד הבית
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)]">—</span>
                  משלוח עד 48 שעות בארץ
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)]">—</span>
                  {copy.priceLabel} כולל מע״מ — בלי הפתעות
                </li>
              </ul>
              <Link href="/#buy" className="nexa-btn-buy mt-10 inline-flex w-fit">
                לבחירת צבע ותשלום
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] px-5 py-12 sm:px-8">
        <Reveal className="mx-auto grid max-w-4xl grid-cols-2 gap-6 border border-white/8 bg-white/[0.02] p-6 sm:grid-cols-4 sm:p-8">
          {[
            { l: "סוללה", v: `${FLAGSHIP.batteryHours}ש׳` },
            { l: "עמידות", v: FLAGSHIP.waterRating },
            { l: "משקל", v: copy.weightDraft },
            { l: "מחיר", v: copy.priceLabel },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
                {s.l}
              </p>
              <p className="mt-1 text-xl tracking-[-0.02em] text-white">{s.v}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative border-t border-[var(--color-border)]">
        <div className="relative min-h-[300px] md:min-h-[420px]">
          <Image
            src={LIFESTYLE.studio.src}
            alt={LIFESTYLE.studio.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-black/50 to-transparent" />
          <Reveal className="absolute inset-0 z-10 flex items-end px-5 py-12 sm:px-8 md:items-center">
            <div className="max-w-md">
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em] text-white sm:text-3xl">
                נבנה לרגעי עבודה ארוכים
              </h2>
              <p className="mt-3 text-sm text-white/60">
                כריות אקוסטיות, קשת יציבה, ושקט שמחזיק גם אחרי שמונה שעות.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] px-5 py-16 sm:px-8">
        <Reveal className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-text-faint)] uppercase">
            גלריה
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em] text-white sm:text-3xl">
            איך זה נראה מחוץ למסך
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {GALLERY.map((img) => (
              <li
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-500 hover:scale-[1.03]"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
                <span className="nexa-sim-badge">
                  <SimLabel />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* השלימו את המארז */}
      <section className="relative border-t border-[var(--color-border)]">
        <div className="relative min-h-[360px] md:min-h-[440px]">
          <Image
            src={LIFESTYLE.case.src}
            alt={LIFESTYLE.case.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-black/60 to-black/35" />
          <Reveal className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
                Studio bundle
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em] text-white sm:text-3xl">
                השלימו את המארז
              </h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ACCESSORIES.map((a) => (
                  <li
                    key={a.sku}
                    className="border border-white/15 bg-black/55 px-5 py-5 backdrop-blur-md transition hover:border-white/30"
                  >
                    <p className="text-white">{a.nameHe}</p>
                    <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">
                      ₪{a.priceIls}
                    </p>
                    <Link
                      href="/#buy"
                      className="mt-4 inline-block text-[11px] tracking-[0.14em] text-white/70 uppercase transition hover:text-white"
                    >
                      להוסיף בקופה ←
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-white/55">
                מארז אולפן ₪{STUDIO_BUNDLE.priceIls.toLocaleString("he-IL")} — חיסכון
                מול קנייה נפרדת ·{" "}
                <Link href="/shop" className="text-[var(--color-accent)] hover:opacity-80">
                  לחנות
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — all questions */}
      <section className="relative overflow-hidden border-t border-[var(--color-border)] px-5 py-20 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(216,214,210,0.06), transparent 55%)",
          }}
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-3xl">
          <p className="text-center font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
            FAQ
          </p>
          <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.035em] text-white">
            שאלות שעוצרים לפני תשלום
          </h2>
          <FaqAccordion className="mt-10" />
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-white/50">{copy.reassurance}</p>
            <Link href="/#buy" className="nexa-btn-buy inline-flex">
              {copy.checkoutCta} · {copy.priceLabel}
            </Link>
            <Link
              href="/faq"
              className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase"
            >
              לכל השאלות
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--color-border)] px-5 py-20 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 70% 40%, rgba(216,214,210,0.08), transparent 55%)",
          }}
        />
        <Reveal className="relative z-10 mx-auto max-w-xl text-center">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
            מלאי השקה
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-[-0.035em] text-white sm:text-4xl">
            {copy.identityClose}
          </h2>
          <p className="mt-4 text-sm text-white/55">
            {LAUNCH.totalUnits} יחידות · {LAUNCH.unitsPerColor} לכל צבע · אחרי
            שהמלאי נגמר — בלי הבטחות על «עוד סבב בקרוב».
          </p>
          <Link href="/#buy" className="nexa-btn-buy mt-8 inline-flex">
            לשריין זוג עכשיו
          </Link>
        </Reveal>
      </section>
    </>
  );
}
