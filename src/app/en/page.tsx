import Link from "next/link";
import { FLAGSHIP, PRODUCT_PRICE_ILS } from "@/lib/catalog";

/** Hebrew-first launch — EN shell until localization pass */
export default function EnglishStubPage() {
  return (
    <main
      id="main-content"
      lang="en"
      dir="ltr"
      className="mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center px-6 py-16 text-start"
    >
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
        English · Coming after Hebrew launch
      </p>
      <h1 className="mt-4 text-3xl tracking-[-0.03em] text-[var(--color-text)]">
        {FLAGSHIP.name}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        Full English storefront ships after Hebrew go-live. Price{" "}
        <bdi dir="ltr">₪{PRODUCT_PRICE_ILS.toLocaleString("he-IL")}</bdi> incl.
        VAT · 14-day returns · 2-year home replacement warranty.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="nexa-btn-buy" hrefLang="he">
          המשך בעברית
        </Link>
        <Link href="/shop" className="nexa-btn-accent" hrefLang="he">
          Shop (HE)
        </Link>
      </div>
    </main>
  );
}
