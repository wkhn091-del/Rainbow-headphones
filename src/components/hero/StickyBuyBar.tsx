"use client";

import { useEffect, useState } from "react";
import type { NexaColorId } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { isColorSoldOut } from "@/lib/stock/colors";

type Props = {
  colorId: NexaColorId;
  onCheckout?: () => void;
  onSoldOut?: () => void;
};

/**
 * Mobile sticky CTA — only inside #buy, never over ProductScroll (was clipping 3D cans).
 */
export function StickyBuyBar({ colorId, onCheckout, onSoldOut }: Props) {
  const [visible, setVisible] = useState(false);
  const soldOut = isColorSoldOut(colorId);

  useEffect(() => {
    const buy = document.getElementById("buy");
    const cta = document.getElementById("buy-cta");
    if (!buy || !cta) return;

    const update = () => {
      const buyRect = buy.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      const inBuy =
        buyRect.top < window.innerHeight * 0.55 && buyRect.bottom > window.innerHeight * 0.35;
      const ctaOnScreen =
        ctaRect.top < window.innerHeight - 24 && ctaRect.bottom > 80;
      setVisible(inBuy && !ctaOnScreen);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    const lenis = (window as unknown as { __lenis?: { on: Function; off: Function } }).__lenis;
    lenis?.on?.("scroll", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.off?.("scroll", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <p className="mb-1.5 text-center font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase">
        Bit · Apple Pay · Google Pay · אשראי
      </p>
      <button
        type="button"
        onClick={() => {
          if (soldOut) onSoldOut?.();
          else onCheckout?.();
        }}
        className={soldOut ? "nexa-btn-accent w-full" : "nexa-btn-buy w-full"}
        data-color={colorId}
      >
        {soldOut ? (
          "אזל במלאי · Sold Out"
        ) : (
          <>
            {copy.checkoutCta}
            <span className="mx-2 text-black/30">·</span>
            {copy.priceLabel}
          </>
        )}
      </button>
    </div>
  );
}
