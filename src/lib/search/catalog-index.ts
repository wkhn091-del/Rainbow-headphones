import {
  ACCESSORIES,
  FLAGSHIP,
  NEXA_COLORS,
  PRODUCT_PRICE_ILS,
  PRODUCT_SKU,
} from "@/lib/catalog";

export type SearchHit = {
  sku: string;
  nameHe: string;
  nameEn: string;
  priceIls: number;
  href: string;
  swatch?: string;
  kind: "flagship" | "accessory";
};

export function getSearchableCatalog(): SearchHit[] {
  const flagship: SearchHit = {
    sku: PRODUCT_SKU,
    nameHe: FLAGSHIP.name,
    nameEn: FLAGSHIP.name,
    priceIls: PRODUCT_PRICE_ILS,
    href: `/?focus=buy`,
    swatch: NEXA_COLORS[0]?.hex,
    kind: "flagship",
  };

  const accessories: SearchHit[] = ACCESSORIES.map((a) => ({
    sku: a.sku,
    nameHe: a.nameHe,
    nameEn: a.name,
    priceIls: a.priceIls,
    href: "/shop",
    kind: "accessory" as const,
  }));

  return [flagship, ...accessories];
}

/** Complementary SKUs for upsell (ids only — prices from catalog/server) */
export function getUpsellSkus(sku: string): string[] {
  if (sku === PRODUCT_SKU) return ["nexa-dock", "nexa-link"];
  if (sku === "nexa-dock") return [PRODUCT_SKU, "nexa-link"];
  if (sku === "nexa-link") return [PRODUCT_SKU, "nexa-dock"];
  return [PRODUCT_SKU];
}
