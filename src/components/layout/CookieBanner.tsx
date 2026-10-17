"use client";

import { useState } from "react";
import { useIsClient } from "@/lib/client/mounted";
import {
  readConsent,
  writeConsent,
  type Consent,
} from "@/lib/analytics/consent";

export function CookieBanner() {
  const mounted = useIsClient();
  const [hidden, setHidden] = useState(false);

  if (!mounted || hidden) return null;
  if (readConsent() !== "unset") return null;

  function setConsent(value: Consent) {
    writeConsent(value);
    setHidden(true);
  }

  return (
    <div
      role="dialog"
      aria-label="הסכמה לעוגיות"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
          עוגיות הכרחיות לתפעול האתר תמיד פעילות. אנליטיקס (GA4, Meta Pixel, Clarity)
          רק אחרי אישור.{" "}
          <a href="/legal/privacy" className="text-[var(--color-accent)] hover:opacity-80">
            מדיניות פרטיות
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-white"
          >
            רק הכרחיות
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="nexa-btn-accent text-xs"
          >
            מאשר אנליטיקס
          </button>
        </div>
      </div>
    </div>
  );
}
