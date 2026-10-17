import Link from "next/link";
import { AuthButton } from "@/components/auth/AuthButton";
import { CartButton } from "@/components/cart/CartButton";
import { BrandMark } from "@/components/brand/BrandMark";
import { SiteFooter } from "./SiteFooter";
import { CookieBanner } from "./CookieBanner";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function PageShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg)] text-white">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-8">
        <div className="justify-self-start">
          <CartButton />
        </div>
        <BrandMark size="md" className="justify-self-center" />
        <div className="flex items-center justify-end gap-3 justify-self-end">
          <Link
            href="/"
            className="hidden text-[11px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase hover:text-[var(--color-accent)] sm:inline"
          >
            הבית
          </Link>
          <AuthButton />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8"
        tabIndex={-1}
      >
        {title ? (
          <h1 className="text-center font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {title}
          </h1>
        ) : null}
        <div className={title ? "mt-8" : undefined}>{children}</div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}
