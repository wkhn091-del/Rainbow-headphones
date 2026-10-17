"use client";

import { LAUNCH } from "@/lib/catalog";

/** Physical progress toward free shipping — honest threshold from catalog */
export function FreeShippingBar({
  subtotalIls,
}: {
  subtotalIls: number;
}) {
  const need = LAUNCH.shippingFreeFromIls;
  const left = Math.max(0, need - subtotalIls);
  const pct = Math.min(100, Math.round((subtotalIls / need) * 100));

  return (
    <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-3">
      <p className="text-[11px] text-[var(--color-text-muted)]">
        {left > 0 ? (
          <>
            עוד{" "}
            <bdi dir="ltr">₪{left.toLocaleString("he-IL")}</bdi> למשלוח חינם
          </>
        ) : (
          "משלוח חינם לעגלה הזו"
        )}
      </p>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-bg)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="התקדמות למשלוח חינם"
      >
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
