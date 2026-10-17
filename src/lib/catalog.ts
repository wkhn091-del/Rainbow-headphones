export const BRAND = {
  name: "Nexa Audio",
  bg: "#0C0C0C",
  /** Warm bone — Silent Gallery (restraint > gold) */
  accent: "#D8D6D2",
} as const;

export type NexaColorId = "titanium" | "obsidian" | "ice";

export type NexaColor = {
  id: NexaColorId;
  nameEn: string;
  nameHe: string;
  hex: string;
  metalness: number;
  roughness: number;
  launchStock: number;
};

export const NEXA_COLORS: NexaColor[] = [
  {
    id: "titanium",
    nameEn: "Titanium Slate",
    nameHe: "טיטניום סלייט",
    hex: "#c2c8d0",
    metalness: 0.72,
    roughness: 0.38,
    launchStock: 100,
  },
  {
    id: "obsidian",
    nameEn: "Obsidian Black",
    nameHe: "אובסידיאן בלאק",
    hex: "#3a3a40",
    metalness: 0.8,
    roughness: 0.28,
    launchStock: 100,
  },
  {
    id: "ice",
    nameEn: "Ice Cyan",
    nameHe: "אייס סיאן",
    hex: "#7eb8c4",
    metalness: 0.78,
    roughness: 0.32,
    launchStock: 100,
  },
];

export const FLAGSHIP = {
  sku: "nexa-pro-3d",
  name: "Nexa Pro 3D",
  priceIls: 1290,
  vatIncluded: true,
  batteryHours: 48,
  /** 10 minutes charge → 3 hours playback */
  fastChargeMinutes: 10,
  fastChargePlayHours: 3,
  waterRating: "IPX4",
  returnDays: 14,
  warrantyYears: 2,
  weightGramsDraft: 280,
  maxQtyPerOrder: 2,
} as const;

export const ACCESSORIES = [
  {
    sku: "nexa-dock",
    name: "Nexa Dock",
    nameHe: "עמדת טעינה מגנטית אלחוטית",
    priceIls: 220,
    colors: ["obsidian", "titanium"] as NexaColorId[],
  },
  {
    sku: "nexa-link",
    name: "Nexa Link",
    nameHe: "כבל USB-C קלוע 1.5 מ׳",
    priceIls: 90,
  },
] as const;

export const STUDIO_BUNDLE = {
  sku: "nexa-studio-bundle",
  nameHe: "מארז אולפן",
  priceIls: 1420,
  separateTotalIls: 1510,
} as const;

export const LAUNCH = {
  unitsPerColor: 100,
  totalUnits: 300,
  hardCaseUnits: 300,
  couponCode: "LAUNCH15",
  discountPercent: 15,
  couponDays: 7,
  earlyAccessHours: 48,
  appliesToSku: FLAGSHIP.sku,
  discountAppliesToFirstUnitOnly: true,
  oncePerEmail: true,
  shippingFreeFromIls: 500,
  shippingFlatIls: 39,
} as const;

/** חלקי Explode — חייבים להתאים ל-GLB העתידי */
export const EXPLODE_NODES = [
  "headband",
  "earcups",
  "cushions",
  "drivers",
  "chipboard",
] as const;

export type ExplodeNode = (typeof EXPLODE_NODES)[number];

export const ACCENT = BRAND.accent;
export const PRODUCT_SKU = FLAGSHIP.sku;
export const PRODUCT_PRICE_ILS = FLAGSHIP.priceIls;
