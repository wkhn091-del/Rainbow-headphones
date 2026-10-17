/**
 * Documentary / product stills — full product in-frame for buy plates.
 */
export const LIFESTYLE = {
  desk: {
    src: "/images/lifestyle/nexa-real-desk.jpg",
    alt: "Nexa Pro על שולחן עבודה ליד לפטופ",
  },
  wear: {
    src: "/images/lifestyle/nexa-real-wear.jpg",
    alt: "Nexa Pro על האוזן — נוף עירוני",
  },
  parts: {
    src: "/images/lifestyle/nexa-real-parts.jpg",
    alt: "חלקי אוזניות מקרוב",
  },
  studio: {
    src: "/images/lifestyle/nexa-real-studio.jpg",
    alt: "Nexa Pro באולפן",
  },
  case: {
    src: "/images/lifestyle/nexa-real-case.jpg",
    alt: "Nexa Pro בנרתיק קשיח",
  },
  detail: {
    src: "/images/lifestyle/nexa-real-detail.jpg",
    alt: "מקרו כרית וציר",
  },
  /** Full headphones seated in studio — primary buy product */
  productFull: {
    src: "/videos/product/poster-01.jpg",
    alt: "Nexa Pro — צילום מוצר מלא",
  },
  productAlt: {
    src: "/images/refs/nexa-assembled.png",
    alt: "Nexa Pro — תצוגת מוצר",
  },
  accessories: {
    src: "/images/accessories-atmosphere.jpg",
    alt: "עמדת טעינה וכבל Nexa",
  },
} as const;

/**
 * Buy plates: scene (environment) + product (full cans, never macro-only).
 * Product always fits — object-contain with padding.
 */
export const BUY_PLATES = {
  titanium: {
    scene: "/images/lifestyle/nexa-real-studio.jpg",
    product: "/videos/product/poster-01.jpg",
    alt: "טיטניום סלייט — Nexa Pro",
  },
  obsidian: {
    scene: "/images/lifestyle/nexa-real-desk.jpg",
    product: "/images/refs/nexa-assembled.png",
    alt: "אובסידיאן — Nexa Pro על שולחן",
  },
  ice: {
    scene: "/images/lifestyle/nexa-real-case.jpg",
    product: "/videos/product/poster-01.jpg",
    alt: "אייס סיאן — Nexa Pro",
  },
} as const;
