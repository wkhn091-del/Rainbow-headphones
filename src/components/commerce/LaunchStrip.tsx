import Link from "next/link";
import { LAUNCH } from "@/lib/catalog";
import { LiveStockHint } from "@/components/commerce/LiveStockHint";

/** Honest scarcity — quiet bar, no neon wash */
export function LaunchStrip() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-1.5 text-[12px] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:text-[13px]">
        <p>
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
            השקה
          </span>
          <span className="ms-2 text-[var(--color-text)]/85">
            <LiveStockHint /> ·{" "}
            <bdi dir="ltr">{LAUNCH.couponCode}</bdi>{" "}
            {LAUNCH.discountPercent}% על הזוג הראשון
          </span>
        </p>
        <Link
          href="/#buy"
          className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text)] uppercase transition hover:opacity-70"
        >
          לתשלום
        </Link>
      </div>
    </div>
  );
}
