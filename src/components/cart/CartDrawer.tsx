"use client";

import Link from "next/link";
import { ACCESSORIES, FLAGSHIP, PRODUCT_SKU } from "@/lib/catalog";
import { useCartStore } from "@/lib/store/cart";
import { UpsellStrip } from "@/components/commerce/UpsellStrip";
import { FreeShippingBar } from "@/components/commerce/FreeShippingBar";

function label(sku: string) {
  if (sku === PRODUCT_SKU) return FLAGSHIP.name;
  return ACCESSORIES.find((a) => a.sku === sku)?.nameHe ?? sku;
}

function unitPrice(sku: string) {
  if (sku === PRODUCT_SKU) return FLAGSHIP.priceIls;
  return ACCESSORIES.find((a) => a.sku === sku)?.priceIls ?? 0;
}

export function CartDrawer() {
  const { open, setOpen, lines, remove, setQty } = useCartStore();
  const displayTotal = lines.reduce(
    (sum, l) => sum + unitPrice(l.sku) * l.qty,
    0,
  );
  const primarySku = lines[0]?.sku ?? PRODUCT_SKU;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-label="עגלה">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="סגירת עגלה"
        onClick={() => setOpen(false)}
      />
      <aside className="nexa-drawer-panel absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
          <h2 className="text-base font-medium text-white">העגלה</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-[var(--color-text-faint)] hover:text-white"
          >
            סגור
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">העגלה ריקה.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li
                  key={`${l.sku}-${l.colorId ?? ""}`}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-white">{label(l.sku)}</p>
                      {l.colorId ? (
                        <p className="text-[11px] text-[var(--color-text-faint)]" dir="ltr">
                          {l.colorId}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-[var(--color-accent)]">
                        ₪{unitPrice(l.sku).toLocaleString("he-IL")}
                        <span className="text-[var(--color-text-faint)]"> · לתצוגה</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] text-[var(--color-text-faint)] hover:text-[var(--color-danger)]"
                      onClick={() => remove(l.sku, l.colorId)}
                    >
                      הסר
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded border border-[var(--color-border)] text-white"
                      onClick={() => setQty(l.sku, l.qty - 1, l.colorId)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{l.qty}</span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded border border-[var(--color-border)] text-white"
                      onClick={() => setQty(l.sku, l.qty + 1, l.colorId)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <UpsellStrip sku={primarySku} title="השלימו את המארז" />
          <FreeShippingBar subtotalIls={displayTotal} />
        </div>

        <div className="border-t border-[var(--color-border)] px-4 py-4">
          <p className="flex justify-between text-sm text-[var(--color-text-muted)]">
            <span>סכום משוער</span>
            <span className="text-white">
              ₪{displayTotal.toLocaleString("he-IL")}
              <span className="text-[10px] text-[var(--color-text-faint)]"> כולל מע״מ*</span>
            </span>
          </p>
          <p className="mt-1 text-[10px] text-[var(--color-text-faint)]">
            *המחיר הסופי מחושב בשרת בצ׳קאאוט.
          </p>
          <Link
            href={
              lines[0]
                ? `/checkout?sku=${encodeURIComponent(lines[0].sku)}&color=${encodeURIComponent(lines[0].colorId ?? "titanium")}`
                : "/checkout"
            }
            onClick={() => setOpen(false)}
            className="nexa-btn-buy mt-3 w-full"
          >
            לתשלום מאובטח
          </Link>
        </div>
      </aside>
    </div>
  );
}
