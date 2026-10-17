import { Suspense } from "react";
import Link from "next/link";
import { AuthButton } from "@/components/auth/AuthButton";

/** Account routes are private / session-bound — allow blocking dynamic render */
export const instant = false;

const NAV = [
  { href: "/account/orders", label: "הזמנות" },
  { href: "/account/tracking", label: "מעקב משלוח" },
  { href: "/account/warranty", label: "אחריות דיגיטלית" },
  { href: "/account/addresses", label: "כתובות" },
  { href: "/account/settings", label: "הגדרות" },
] as const;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg)] text-white">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-tight"
        >
          Nexa Audio
        </Link>
        <AuthButton />
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row">
        <nav
          aria-label="אזור אישי"
          className="flex shrink-0 flex-row gap-2 overflow-x-auto md:w-44 md:flex-col md:gap-1"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface)] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <Suspense
            fallback={
              <p className="text-sm text-[var(--color-text-faint)]">טוענים…</p>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
