/**
 * Live business identity — override via env before launch.
 * Locked from Footer Engine interrogation (2026-10-16).
 */

export const BUSINESS = {
  legalName:
    process.env.NEXT_PUBLIC_LEGAL_NAME || "Nexa Technologies Ltd",
  /** ח.פ — company number */
  vatId: process.env.NEXT_PUBLIC_VAT_ID || "518889992",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@nexapro.co.il",
  phoneDisplay: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "073-9998877",
  /** E.164 without + for wa.me / tel: */
  phoneE164: process.env.NEXT_PUBLIC_SUPPORT_PHONE_E164 || "972739998877",
  hoursHe: process.env.NEXT_PUBLIC_SUPPORT_HOURS || "א׳–ה׳ 09:00–17:00",
  cityHe: process.env.NEXT_PUBLIC_BUSINESS_CITY || "תל אביב",
} as const;

export function vatLabel() {
  return BUSINESS.vatId
    ? `ח.פ ${BUSINESS.vatId}`
    : "ח.פ [יושלם לפני השקה]";
}

export function phoneIsPlaceholder() {
  return (
    !process.env.NEXT_PUBLIC_SUPPORT_PHONE &&
    BUSINESS.phoneDisplay.includes("0000000")
  );
}
