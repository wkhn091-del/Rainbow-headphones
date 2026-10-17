import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { CartButton } from "@/components/cart/CartButton";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";

/** Premium top bar — logo · search · links · cart icon */
export function HomeNav() {
  return (
    <header className="sticky top-0 z-[55] border-b border-white/[0.06] bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:gap-5 sm:px-8">
        <BrandMark size="sm" />

        <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
          <SmartSearchBar compact />
        </div>

        <nav
          className="ms-auto flex items-center gap-1 sm:gap-2"
          aria-label="ניווט ראשי"
        >
          <Link
            href="/shop"
            className="hidden px-2 py-1.5 text-[11px] tracking-[0.16em] text-[var(--color-text-muted)] uppercase transition hover:text-[var(--color-text)] sm:inline"
          >
            חנות
          </Link>
          <Link
            href="/#why-nexa"
            className="hidden px-2 py-1.5 text-[11px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase transition hover:text-[var(--color-text)] lg:inline"
          >
            למה אנחנו
          </Link>
          <Link
            href="/#buy"
            className="hidden px-2 py-1.5 text-[11px] tracking-[0.16em] text-[var(--color-text)] uppercase transition hover:opacity-70 sm:inline"
          >
            לרכישה
          </Link>
          <span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
