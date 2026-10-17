/**
 * Launch KPIs — Script 1 measurement loop (3–5 KPIs).
 * Tracked in GA4 custom events when consent = accepted.
 */
export const KPIS = [
  {
    id: "scroll_cinema_complete",
    nameHe: "השלמת סינמה בגלילה",
    event: "scroll_cinema_complete",
    target: "≥45% מהסשנים מגיעים לסוף הסינמה",
  },
  {
    id: "buy_cta_click",
    nameHe: "לחיצה על לתשלום",
    event: "buy_cta_click",
    target: "≥8% מהמבקרים לוחצים CTA",
  },
  {
    id: "checkout_start",
    nameHe: "התחלת Checkout",
    event: "begin_checkout",
    target: "≥50% מלחיצות CTA נכנסות לטופס",
  },
  {
    id: "purchase",
    nameHe: "רכישה הושלמה",
    event: "purchase",
    target: "Conversion ≥2% מהתנועה האורגנית+קמפיין",
  },
  {
    id: "waitlist_join",
    nameHe: "הרשמת Early Access",
    event: "generate_lead",
    target: "≥120 לידים בשבוע לפני פתיחה",
  },
] as const;

export type KpiEvent =
  | "scroll_cinema_complete"
  | "buy_cta_click"
  | "begin_checkout"
  | "purchase"
  | "generate_lead"
  | "sold_out_click";
