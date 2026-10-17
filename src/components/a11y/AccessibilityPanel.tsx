"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/client/mounted";

const KEY = "nexa-a11y-v1";

type Prefs = {
  large: boolean;
  contrast: boolean;
  reduceMotion: boolean;
};

const DEFAULT: Prefs = { large: false, contrast: false, reduceMotion: false };

function apply(prefs: Prefs) {
  const root = document.documentElement;
  root.classList.toggle("nexa-a11y-large", prefs.large);
  root.classList.toggle("nexa-a11y-contrast", prefs.contrast);
  root.classList.toggle("nexa-a11y-motion", prefs.reduceMotion);
}

/** ת״י 5568 — floating accessibility controls */
export function AccessibilityPanel() {
  const mounted = useIsClient();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = { ...DEFAULT, ...(JSON.parse(raw) as Prefs) };
        setPrefs(p);
        apply(p);
      }
    } catch {
      /* ignore */
    }
  }, [mounted]);

  function update(next: Partial<Prefs>) {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      apply(merged);
      return merged;
    });
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 end-4 z-[46] md:bottom-8 md:end-6">
      {open ? (
        <div
          className="mb-2 w-56 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-contact)]"
          role="dialog"
          aria-label="תפריט נגישות"
        >
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
            נגישות
          </p>
          <ul className="mt-3 space-y-2 text-xs text-[var(--color-text)]">
            <li>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span>טקסט גדול</span>
                <input
                  type="checkbox"
                  checked={prefs.large}
                  onChange={(e) => update({ large: e.target.checked })}
                />
              </label>
            </li>
            <li>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span>ניגודיות גבוהה</span>
                <input
                  type="checkbox"
                  checked={prefs.contrast}
                  onChange={(e) => update({ contrast: e.target.checked })}
                />
              </label>
            </li>
            <li>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span>הפחתת תנועה</span>
                <input
                  type="checkbox"
                  checked={prefs.reduceMotion}
                  onChange={(e) => update({ reduceMotion: e.target.checked })}
                />
              </label>
            </li>
          </ul>
          <LinkLegal />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]"
        aria-expanded={open}
        aria-label={open ? "סגור נגישות" : "פתח נגישות"}
      >
        אא
      </button>
    </div>
  );
}

function LinkLegal() {
  return (
    <a
      href="/legal/accessibility"
      className="mt-3 inline-block text-[10px] text-[var(--color-text-muted)] underline-offset-2 hover:underline"
    >
      הצהרת נגישות
    </a>
  );
}
