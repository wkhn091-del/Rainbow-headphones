import "server-only";

import {
  ACCESSORIES,
  FLAGSHIP,
  LAUNCH,
  NEXA_COLORS,
  PRODUCT_SKU,
  type NexaColorId,
} from "@/lib/catalog";
import { z } from "zod";

export const quoteLineSchema = z.object({
  sku: z.string().min(1).max(64),
  colorId: z.enum(["titanium", "obsidian", "ice"]).optional(),
  qty: z.number().int().min(1).max(FLAGSHIP.maxQtyPerOrder),
});

export const quoteRequestSchema = z.object({
  lines: z.array(quoteLineSchema).min(1).max(8),
  coupon: z.string().max(32).optional(),
});

export type QuoteLineIn = z.infer<typeof quoteLineSchema>;

function unitPrice(sku: string): number | null {
  if (sku === PRODUCT_SKU) return FLAGSHIP.priceIls;
  const acc = ACCESSORIES.find((a) => a.sku === sku);
  return acc?.priceIls ?? null;
}

function lineLabel(sku: string, colorId?: NexaColorId): string {
  if (sku === PRODUCT_SKU) {
    const c = NEXA_COLORS.find((x) => x.id === colorId);
    return c ? `${FLAGSHIP.name} · ${c.nameHe}` : FLAGSHIP.name;
  }
  return ACCESSORIES.find((a) => a.sku === sku)?.nameHe ?? sku;
}

/** Server-only price truth — never trust client totals */
export function buildQuote(input: z.infer<typeof quoteRequestSchema>) {
  const lines = [];
  let merchandise = 0;
  let flagshipUnits = 0;

  for (const line of input.lines) {
    const price = unitPrice(line.sku);
    if (price == null) {
      return { ok: false as const, error: "unknown_sku" };
    }
    if (line.sku === PRODUCT_SKU && !line.colorId) {
      return { ok: false as const, error: "color_required" };
    }
    const qty = Math.min(line.qty, FLAGSHIP.maxQtyPerOrder);
    const lineTotal = price * qty;
    merchandise += lineTotal;
    if (line.sku === PRODUCT_SKU) flagshipUnits += qty;
    lines.push({
      sku: line.sku,
      colorId: line.colorId,
      qty,
      unitPriceIls: price,
      lineTotalIls: lineTotal,
      label: lineLabel(line.sku, line.colorId),
    });
  }

  const couponCode = input.coupon?.trim().toUpperCase() ?? "";
  let discountIls = 0;
  let couponApplied: string | null = null;

  if (couponCode === LAUNCH.couponCode && flagshipUnits >= 1) {
    const firstUnit = FLAGSHIP.priceIls;
    discountIls = Math.round((firstUnit * LAUNCH.discountPercent) / 100);
    couponApplied = LAUNCH.couponCode;
  }

  const afterDiscount = Math.max(0, merchandise - discountIls);
  const shippingIls =
    afterDiscount >= LAUNCH.shippingFreeFromIls ? 0 : LAUNCH.shippingFlatIls;
  const totalIls = afterDiscount + shippingIls;

  return {
    ok: true as const,
    currency: "ILS" as const,
    vatIncluded: true,
    lines,
    merchandiseIls: merchandise,
    discountIls,
    couponApplied,
    shippingIls,
    totalIls,
    notes: [
      "מחיר סופי מחושב בשרת מול קטלוג.",
      couponApplied
        ? `${couponApplied}: ${LAUNCH.discountPercent}% על זוג Flagship ראשון בלבד.`
        : "ללא קופון פעיל.",
      shippingIls === 0
        ? `משלוח חינם (מעל ₪${LAUNCH.shippingFreeFromIls}).`
        : `משלוח ₪${LAUNCH.shippingFlatIls}.`,
    ],
  };
}
