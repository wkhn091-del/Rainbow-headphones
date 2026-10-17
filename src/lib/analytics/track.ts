"use client";

import { readConsent } from "./consent";
import type { KpiEvent } from "./kpis";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/** Fire only after analytics consent */
export function track(event: KpiEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (readConsent() !== "accepted") return;

  window.gtag?.("event", event, params ?? {});
  if (event === "purchase" || event === "begin_checkout" || event === "buy_cta_click") {
    window.fbq?.("trackCustom", event, params ?? {});
  }
  window.clarity?.("event", event);
}
