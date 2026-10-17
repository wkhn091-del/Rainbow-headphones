import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import {
  FLAGSHIP,
  LAUNCH,
  NEXA_COLORS,
  PRODUCT_SKU,
  type NexaColorId,
} from "@/lib/catalog";
import { buildQuote } from "@/lib/pricing/quote";
import { UpsellStrip } from "@/components/commerce/UpsellStrip";
import { ColdStartTrust } from "@/components/commerce/ColdStartTrust";
import { PaymentMethods } from "@/components/commerce/PaymentMethods";
import { CheckoutOutcome } from "@/components/checkout/CheckoutOutcome";

type Props = {
  searchParams: Promise<{
    sku?: string;
    color?: string;
    qty?: string;
    coupon?: string;
    paid?: string;
    cancel?: string;
    order?: string;
    demo?: string;
  }>;
};

async function CheckoutDetails({ searchParams }: Props) {
  await connection();
  const params = await searchParams;

  if (params.paid === "1" || params.cancel === "1") {
    return (
      <CheckoutOutcome
        paid={params.paid === "1"}
        cancel={params.cancel === "1"}
        orderId={params.order}
        demo={params.demo === "1"}
      />
    );
  }

  const sku = params.sku ?? PRODUCT_SKU;
  const colorId = (params.color ?? "titanium") as NexaColorId;
  const qty = Math.min(
    Math.max(Number(params.qty) || 1, 1),
    FLAGSHIP.maxQtyPerOrder,
  );
  const coupon = params.coupon ?? LAUNCH.couponCode;
  const color = NEXA_COLORS.find((c) => c.id === colorId);

  const quote = buildQuote({
    lines: [{ sku, colorId: sku === PRODUCT_SKU ? colorId : undefined, qty }],
    coupon,
  });

  if (!quote.ok) {
    return (
      <p className="mt-6 text-sm text-[var(--color-danger)]">
        לא הצלחנו לחשב מחיר. בדקו מק״ט וצבע וחזרו.
      </p>
    );
  }

  return (
    <>
      <h1 className="mt-6 text-xl tracking-[-0.02em] text-[var(--color-text)]">
        תשלום מאובטח
      </h1>
      <p className="mt-2 text-xs text-[var(--color-text-faint)]">
        Guest checkout · פרטי אשראי אצל הסולק בלבד · לא נשמרים אצלנו.
      </p>

      <ul className="mx-auto mt-6 w-full max-w-md space-y-3 text-start">
        {quote.lines.map((l) => (
          <li
            key={`${l.sku}-${l.colorId ?? ""}`}
            className="nexa-glass flex justify-between gap-3 p-4 text-sm"
          >
            <div>
              <p className="text-[var(--color-text)]">{l.label}</p>
              <p className="text-[11px] text-[var(--color-text-faint)]" dir="ltr">
                {l.sku}
                {l.colorId ? ` · ${l.colorId}` : ""}
              </p>
            </div>
            <div className="text-end">
              <p className="text-[var(--color-text)]">
                ₪{l.lineTotalIls.toLocaleString("he-IL")}
              </p>
              <p className="text-[11px] text-[var(--color-text-faint)]">×{l.qty}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mx-auto mt-4 w-full max-w-md space-y-1.5 text-start text-sm text-[var(--color-text-muted)]">
        <div className="flex justify-between">
          <dt>סחורה</dt>
          <dd>₪{quote.merchandiseIls.toLocaleString("he-IL")}</dd>
        </div>
        {quote.discountIls > 0 ? (
          <div className="flex justify-between text-[var(--color-text)]">
            <dt>הנחה {quote.couponApplied}</dt>
            <dd>−₪{quote.discountIls.toLocaleString("he-IL")}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>משלוח</dt>
          <dd>
            {quote.shippingIls === 0
              ? "חינם"
              : `₪${quote.shippingIls.toLocaleString("he-IL")}`}
          </dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-base text-[var(--color-text)]">
          <dt>סה״כ כולל מע״מ</dt>
          <dd>₪{quote.totalIls.toLocaleString("he-IL")}</dd>
        </div>
      </dl>

      <ul className="mx-auto mt-3 max-w-md space-y-1 text-start text-[11px] text-[var(--color-text-faint)]">
        {quote.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <ColdStartTrust />
      <PaymentMethods
        variant="full"
        className="mx-auto mt-4 w-full max-w-md text-start"
        colorId={colorId}
      />

      <div className="mx-auto mt-6 w-full max-w-md text-start">
        <UpsellStrip sku={sku} title="לפני התשלום — משלימים?" />
      </div>

      <div className="mt-8 w-full max-w-md rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-start text-sm text-[var(--color-text-muted)]">
        <p className="text-[var(--color-text)]">מעבר לסליקה (Grow Mesh)</p>
        <p className="mt-2 text-xs leading-relaxed">
          ממתין ל־GROW_API_KEY. אחרי חיבור: Session בשרת עם הסכום למעלה בלבד ·
          Bit / Apple Pay / Google Pay / אשראי.{" "}
          {color ? `${color.nameHe} · ` : ""}
          {FLAGSHIP.name}.
        </p>
        <Link href="/#buy" className="nexa-btn-buy mt-4 inline-flex">
          שריון מהעמוד הראשי
        </Link>
      </div>
    </>
  );
}

export default function CheckoutPage({ searchParams }: Props) {
  return (
    <main
      id="main-content"
      className="flex min-h-[100dvh] flex-col items-center bg-[var(--color-bg)] px-6 py-12 text-center text-[var(--color-text)]"
    >
      <p className="text-2xl tracking-[-0.03em]">Nexa Audio</p>
      <Suspense
        fallback={
          <p className="mt-6 text-sm text-[var(--color-text-faint)]">
            מחשבים מחיר מהשרת…
          </p>
        }
      >
        <CheckoutDetails searchParams={searchParams} />
      </Suspense>
      <Link
        href="/"
        className="mt-8 border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
      >
        חזרה למוצר
      </Link>
    </main>
  );
}
