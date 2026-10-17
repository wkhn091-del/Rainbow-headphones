"use client";

import type { NexaColorId } from "@/lib/catalog";
import { useCartStore } from "@/lib/store/cart";

type Props = {
  sku: string;
  colorId?: NexaColorId;
  qty?: number;
  label?: string;
  className?: string;
};

export function AddToCartButton({
  sku,
  colorId,
  qty = 1,
  label = "להוסיף לעגלה",
  className = "nexa-btn-accent px-3 py-1.5 text-xs",
}: Props) {
  const add = useCartStore((s) => s.add);

  return (
    <button
      type="button"
      className={className}
      onClick={() => add({ sku, colorId, qty })}
    >
      {label}
    </button>
  );
}
