import { FLAGSHIP, LAUNCH, PRODUCT_PRICE_ILS } from "@/lib/catalog";

/** Silent Gallery microcopy — concrete, no AI slogans · Hero Option A locked */
export const copy = {
  brand: "Nexa Audio",
  product: FLAGSHIP.name,
  eyebrow: FLAGSHIP.name,
  /** Hero H1 — Option A */
  headline: "הרעש במשרד נגמר כאן",
  /** Hero H2 — short, premium */
  support: `שקט אמיתי · ${FLAGSHIP.batteryHours} שעות · טעינה מהירה`,
  /** Immersive Hero primary CTA */
  buyNow: "שמרו מקום בהשקה",
  preorderCta: "שמרו מקום בהשקה",
  /** Commerce close — checkout */
  checkoutCta: "לתשלום",
  priceLabel: `₪${PRODUCT_PRICE_ILS.toLocaleString("he-IL")}`,
  priceNote: "כולל מע״מ",
  reassurance: "משלוח חינם · אחריות שנתיים",
  launchNote: `${LAUNCH.earlyAccessHours} ש׳ לפני כולם · ${LAUNCH.couponCode} ${LAUNCH.discountPercent}%`,
  preorderTitle: "רשימת Early Access",
  preorderSubmit: "לשמירת מקום",
  preorderSuccess: "נשמר. הקוד יישלח בפתיחה.",
  namePlaceholder: "שם מלא",
  emailPlaceholder: "מייל",
  phonePlaceholder: "טלפון נייד",
  colorLabel: "צבע",
  scrollHint: "גללו לפירוק",
  skipToBuy: "לרכישה",
  stockHint: `${LAUNCH.unitsPerColor} יחידות השקה לכל צבע`,
  placeholder3d: "3D",
  placeholder3dEn: "3D",
  weightDraft: `~${FLAGSHIP.weightGramsDraft}ג`,
  hook: "גללו. האוזניות נפתחות איתכם.",
  cinemaMid: "שכבה אחר שכבה — עד השקט.",
  cinemaClose: "אותו מוצר. עכשיו ביד.",
  identityClose: "השקט שלך מגיע לרמה הבאה.",
  identityCloseSub: "אל תפספס את מהדורת ההשקה.",
  lossAversion: "14 יום לבדוק. לא מתאים — מחזירים.",
  buyHeadline: "בחרו צבע · שריינו יחידה",
  buySub: "האוזנייה בתמונה מתעדכנת לצבע — מה שרואים זה מה שמגיע",
  specs: [
    { label: "סוללה", value: `${FLAGSHIP.batteryHours}ש׳` },
    { label: "טעינה מהירה", value: `${FLAGSHIP.fastChargeMinutes}דק׳→${FLAGSHIP.fastChargePlayHours}ש׳` },
    { label: "אחריות", value: `${FLAGSHIP.warrantyYears}ש׳` },
  ],
} as const;
