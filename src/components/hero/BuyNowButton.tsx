"use client";

import { PRODUCT_PRICE_ILS, type NexaColorId } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { track } from "@/lib/analytics/track";
import { isColorSoldOut } from "@/lib/stock/colors";
import { MagneticButton } from "@/components/motion/MagneticButton";

type Props = {
  colorId: NexaColorId;
  id?: string;
  onCheckout?: () => void;
  onSoldOut?: () => void;
};

export function BuyNowButton({ colorId, id, onCheckout, onSoldOut }: Props) {
  const soldOut = isColorSoldOut(colorId);

  return (
    <div className="flex flex-col items-center gap-2">
      <MagneticButton
        id={id}
        disabled={soldOut && !onSoldOut}
        onClick={() => {
          if (soldOut) {
            track("sold_out_click", { colorId });
            onSoldOut?.();
            return;
          }
          track("buy_cta_click", {
            colorId,
            value: PRODUCT_PRICE_ILS,
            currency: "ILS",
          });
          onCheckout?.();
        }}
        className={
          soldOut
            ? "nexa-btn-accent min-w-[14rem] text-center opacity-90"
            : "nexa-btn-buy min-w-[14rem] text-center"
        }
      >
        {soldOut ? (
          "אזל במלאי · Sold Out"
        ) : (
          <>
            {copy.checkoutCta}
            <span className="mx-2 text-black/25">·</span>
            <span className="tabular-nums">
              ₪{PRODUCT_PRICE_ILS.toLocaleString("he-IL")}
            </span>
          </>
        )}
      </MagneticButton>
      <p className="text-[11px] text-[var(--color-text-faint)]">
        {soldOut
          ? "השאירו מייל + נייד — נעדכן כשהצבע חוזר (בלי הבטחת מועד)"
          : copy.reassurance}
      </p>
    </div>
  );
}
