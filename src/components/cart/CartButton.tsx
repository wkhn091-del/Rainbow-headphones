"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/store/cart";

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 8h11l-1.1 9.2a1.5 1.5 0 0 1-1.5 1.3H9.1a1.5 1.5 0 0 1-1.5-1.3L6.5 8Z" />
      <path d="M9 8V6.8A3 3 0 0 1 12 3.8a3 3 0 0 1 3 3V8" />
    </svg>
  );
}

export function CartButton() {
  const lines = useCartStore((s) => s.lines);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const prev = useRef(count);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count > prev.current) {
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 220);
      prev.current = count;
      return () => window.clearTimeout(t);
    }
    prev.current = count;
  }, [count]);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-[var(--motion-instant)] ease-[var(--ease-out)] hover:text-[var(--color-text)]"
      aria-label={count ? `עגלה, ${count} פריטים` : "עגלה"}
    >
      <CartIcon className="h-[1.35rem] w-[1.35rem]" />
      {count > 0 ? (
        <span
          className={`absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-semibold text-[var(--color-bg)] ${pulse ? "nexa-cart-badge-pulse" : ""}`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
