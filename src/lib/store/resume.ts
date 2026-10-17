"use client";

import type { NexaColorId } from "@/lib/catalog";

const KEY = "nexa-resume-v1";
const EVT = "nexa-resume-change";

export type ResumeState = {
  sku?: string;
  colorId?: NexaColorId;
  lastPath?: string;
  updatedAt: number;
};

/** Stable reference for useSyncExternalStore getSnapshot */
let cachedRaw: string | null | undefined = undefined;
let cachedValue: ResumeState | null = null;

function parseFresh(): ResumeState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    if (!raw) {
      cachedValue = null;
      return null;
    }
    const parsed = JSON.parse(raw) as ResumeState;
    if (Date.now() - parsed.updatedAt >= 1000 * 60 * 60 * 24 * 14) {
      cachedValue = null;
      return null;
    }
    cachedValue = parsed;
    return cachedValue;
  } catch {
    cachedRaw = null;
    cachedValue = null;
    return null;
  }
}

export function loadResume(): ResumeState | null {
  return parseFresh();
}

export function saveResume(partial: Omit<ResumeState, "updatedAt">) {
  try {
    const prev = loadResume();
    const next: ResumeState = {
      ...prev,
      ...partial,
      updatedAt: Date.now(),
    };
    const raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
    cachedRaw = raw;
    cachedValue = next;
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

export function subscribeResume(onChange: () => void) {
  window.addEventListener(EVT, onChange);
  return () => window.removeEventListener(EVT, onChange);
}

export function getResumeSnapshot(): ResumeState | null {
  return parseFresh();
}

export function getResumeServerSnapshot(): ResumeState | null {
  return null;
}
