export const CONSENT_KEY = "nexa_cookie_consent";
export const CONSENT_EVENT = "nexa:consent";

export type Consent = "accepted" | "rejected";

export function readConsent(): Consent | "unset" {
  if (typeof window === "undefined") return "unset";
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
    return "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { value } }),
  );
}
