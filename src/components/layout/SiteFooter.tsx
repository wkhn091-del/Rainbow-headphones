"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy/he";
import { BUSINESS, vatLabel } from "@/lib/business";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { MagneticLink } from "@/components/motion/MagneticButton";

const CORE = {
  title: "ליבה",
  links: [
    { href: "/specs", label: "מפרט טכני" },
    { href: "/anc", label: "טכנולוגיית ANC" },
    { href: "/faq", label: "שאלות נפוצות" },
    { href: "/support", label: "תמיכה ושירות" },
  ],
} as const;

const LEGAL = {
  title: "משפטי",
  links: [
    { href: "/legal/terms", label: "תקנון האתר" },
    { href: "/legal/privacy", label: "מדיניות פרטיות (תיקון 13)" },
    { href: "/legal/accessibility", label: "הצהרת נגישות · ת״י 5568" },
  ],
} as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="nexa-footer-link group relative inline-flex min-h-12 items-center text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] md:min-h-0 md:py-1.5"
    >
      <span>{label}</span>
      <span
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 rtl:origin-left rtl:group-hover:origin-right"
        aria-hidden
      />
    </Link>
  );
}

function AccordionCol({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)] md:border-0">
      <button
        type="button"
        className="flex w-full min-h-12 items-center justify-between py-3 text-start text-sm font-medium text-[var(--color-text)] md:pointer-events-none md:min-h-0 md:py-0"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <span className="text-[var(--color-text-faint)] md:hidden" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      <ul
        className={`flex flex-col gap-0.5 overflow-hidden pb-3 transition-[max-height] duration-300 md:mt-4 md:max-h-none md:pb-0 ${
          open ? "max-h-64" : "max-h-0 md:max-h-none"
        }`}
      >
        {links.map((l) => (
          <li key={l.href}>
            <FooterLink href={l.href} label={l.label} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ultimate Footer Engine — Mini-Hero + trust + core/legal · no socials */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <footer
      ref={ref}
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        {/* Mini-Hero */}
        <div
          className={`flex flex-col gap-6 border-b border-[var(--color-border)] pb-12 sm:flex-row sm:items-end sm:justify-between ${
            revealed ? "nexa-reveal" : "opacity-0"
          }`}
        >
          <div>
            <p className="text-[clamp(1.25rem,3vw,1.75rem)] font-medium tracking-[-0.02em] text-[var(--color-text)]">
              {copy.identityClose}
            </p>
            <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
              {copy.identityCloseSub}
            </p>
          </div>
          <MagneticLink
            href="/#buy"
            className="nexa-btn-buy inline-flex min-h-12 shrink-0 items-center px-8"
          >
            {copy.checkoutCta}
          </MagneticLink>
        </div>

        <div
          className={`mt-12 grid gap-2 md:grid-cols-3 md:gap-10 ${
            revealed ? "nexa-reveal" : "opacity-0"
          }`}
          style={revealed && !reduced ? { animationDelay: "60ms" } : undefined}
        >
          {/* Business — always visible */}
          <div className="pb-6 md:pb-0">
            <p className="text-lg tracking-[-0.02em] text-[var(--color-text)]">
              Nexa Audio
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {BUSINESS.legalName}
              <br />
              {vatLabel()}
              <br />
              <a
                href={`mailto:${BUSINESS.supportEmail}`}
                className="text-[var(--color-text)] underline-offset-4 hover:underline"
              >
                {BUSINESS.supportEmail}
              </a>
              <br />
              <a
                href={`tel:+${BUSINESS.phoneE164}`}
                className="text-[var(--color-text)] underline-offset-4 hover:underline"
                dir="ltr"
              >
                {BUSINESS.phoneDisplay}
              </a>
              <br />
              <span className="text-[var(--color-text-faint)]">
                {BUSINESS.hoursHe} · {BUSINESS.cityHe}
              </span>
            </p>
          </div>

          <AccordionCol title={CORE.title} links={CORE.links} />
          <AccordionCol title={LEGAL.title} links={LEGAL.links} />
        </div>

        <p className="mt-12 text-[11px] text-[var(--color-text-faint)]">
          © 2026 {BUSINESS.legalName} · מחירים כולל מע״מ · תמונות מסומנות הדמיה
          עד צילום אמיתי
        </p>
      </div>
    </footer>
  );
}
