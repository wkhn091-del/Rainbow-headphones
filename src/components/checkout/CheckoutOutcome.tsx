"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics/track";
import { PRODUCT_PRICE_ILS } from "@/lib/catalog";

type Props = {
  paid?: boolean;
  cancel?: boolean;
  orderId?: string;
  demo?: boolean;
};

/** Post-Grow return states — guest-first, no login wall */
export function CheckoutOutcome({ paid, cancel, orderId, demo }: Props) {
  useEffect(() => {
    if (paid && !demo) {
      track("purchase", {
        transaction_id: orderId,
        value: PRODUCT_PRICE_ILS,
        currency: "ILS",
      });
    }
  }, [paid, orderId, demo]);

  if (paid) {
    return (
      <div className="mx-auto mt-8 w-full max-w-md border border-[var(--color-border)] px-6 py-8 text-start">
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
          {demo ? "סימולציה · לא חויב" : "הזמנה"}
        </p>
        <h1 className="mt-2 text-2xl tracking-[-0.03em] text-[var(--color-text)]">
          {demo ? "סימולציית תשלום הושלמה" : "התשלום התקבל"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {demo
            ? "מצב פיתוח בלבד — אין חיוב, אין מלאי אמיתי, אין מייל. לפני השקה: Supabase + GROW_API_KEY."
            : "אישור יישלח למייל. חשבון נפתח אוטומטית אם עדיין אין — קישור כניסה במייל."}
        </p>
        {orderId ? (
          <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-faint)]" dir="ltr">
            #{orderId.slice(0, 8)}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/account/orders" className="nexa-btn-buy">
            להזמנות שלי
          </Link>
          <Link href="/" className="nexa-btn-accent">
            חזרה לבית
          </Link>
        </div>
      </div>
    );
  }

  if (cancel) {
    return (
      <div className="mx-auto mt-8 w-full max-w-md border border-[var(--color-border)] px-6 py-8 text-start">
        <h1 className="text-2xl tracking-[-0.03em] text-[var(--color-text)]">
          התשלום בוטל
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          המלאי לא חויב. אפשר לחזור ולבחור צבע מחדש.
        </p>
        <Link href="/#buy" className="nexa-btn-buy mt-6 inline-flex">
          חזרה לרכישה
        </Link>
      </div>
    );
  }

  return null;
}
