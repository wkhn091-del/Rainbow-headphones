"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FLAGSHIP, LAUNCH } from "@/lib/catalog";

/**
 * Quiet luxury motion — MOTION_MAP + motion-kit "luxury" (no broken scrub/rotate).
 */
const ROWS = [
  {
    k: "01",
    title: "עברית ראשונה",
    body: "מסלול רכישה, תמיכה ומדיניות בעברית — בלי לנעול לאקוסיסטם אחד.",
  },
  {
    k: "02",
    title: "סיכון נמוך",
    body: `${FLAGSHIP.returnDays} יום החזרה · אחריות ${FLAGSHIP.warrantyYears} שנים חלופי עד הבית.`,
  },
  {
    k: "03",
    title: "מלאי השקה אמיתי",
    body: `${LAUNCH.totalUnits} יחידות · ${LAUNCH.couponCode} ${LAUNCH.discountPercent}% על הזוג הראשון · מקס ${FLAGSHIP.maxQtyPerOrder} להזמנה.`,
  },
  {
    k: "04",
    title: "מחיר שקוף",
    body: "₪ כולל מע״מ על המסך · Guest checkout · פרטי אשראי אצל הסולק בלבד.",
  },
] as const;

export function WhyNexa() {
  const rootRef = useRef<HTMLElement>(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => setHot(Boolean(e?.isIntersecting && e.intersectionRatio > 0.2)),
      { threshold: [0.15, 0.35, 0.55] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="why-nexa"
      data-depth="steel"
      className={`nexa-why nexa-depth-wash relative overflow-hidden border-t border-[var(--color-border)] px-5 py-24 sm:px-8 sm:py-28 ${hot ? "nexa-why-hot" : ""}`}
      aria-labelledby="why-nexa-title"
    >
      <div className="why-mesh" aria-hidden />
      <div className="why-grain" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
              למה אנחנו
            </p>
            <h2
              id="why-nexa-title"
              className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.8vw,2.85rem)] tracking-[-0.035em] text-[var(--color-text)]"
            >
              לא «טוב מכולם» —
              <br />
              <span className="why-accent-line">ברור מה מקבלים</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
              בלי דירוג מתחרים. רק התחייבויות שאפשר לבדוק בקופה ובשירות.
            </p>
          </div>
          <p className="max-w-[11rem] font-[family-name:var(--font-mono)] text-[10px] leading-relaxed tracking-[0.14em] text-[var(--color-text-faint)] uppercase">
            פחות הבטחות.
            <br />
            יותר שקט בראש.
          </p>
        </div>

        <ul className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2">
          {ROWS.map((r, i) => (
            <li
              key={r.title}
              className="why-card-quiet group relative bg-[var(--color-bg)] p-7 sm:p-8"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-text-faint)]">
                {r.k}
              </span>
              <h3 className="mt-3 text-lg tracking-[-0.02em] text-[var(--color-text)]">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {r.body}
              </p>
              <span className="why-card-bar" aria-hidden />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#buy" className="nexa-btn-buy">
            לבחירת צבע
          </Link>
          <Link href="/faq" className="nexa-btn-accent">
            שאלות נפוצות
          </Link>
        </div>
      </div>
    </section>
  );
}
