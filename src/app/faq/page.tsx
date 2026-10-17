import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/copy/faq";
import { PageShell } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/commerce/FaqAccordion";
import { copy } from "@/lib/copy/he";

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <PageShell title="שאלות נפוצות">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />
      <p className="mb-10 max-w-xl text-sm text-[var(--color-text-muted)]">
        כל מה שעוצרים עליו לפני תשלום — שקיפות מלאה, בלי אותיות קטנות.
      </p>
      <FaqAccordion />
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link href="/#buy" className="nexa-btn-buy">
          {copy.checkoutCta} · {copy.priceLabel}
        </Link>
        <Link
          href="/support"
          className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase"
        >
          צרו קשר
        </Link>
      </div>
    </PageShell>
  );
}
