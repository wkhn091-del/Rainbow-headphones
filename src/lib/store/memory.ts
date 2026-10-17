"use client";

/** Script rule 17 — site remembers the customer (local only, no PII). */

const VIEWED_KEY = "nexa-viewed-v1";
const SEARCH_KEY = "nexa-last-search-v1";
const MAX_VIEWED = 8;

export type ViewedItem = {
  sku: string;
  nameHe: string;
  href: string;
  at: number;
};

export function getViewed(): ViewedItem[] {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ViewedItem[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushViewed(item: Omit<ViewedItem, "at">) {
  try {
    const prev = getViewed().filter((v) => v.sku !== item.sku);
    const next = [{ ...item, at: Date.now() }, ...prev].slice(0, MAX_VIEWED);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("nexa-viewed-change"));
  } catch {
    /* ignore */
  }
}

export function getLastSearch(): string {
  try {
    return localStorage.getItem(SEARCH_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setLastSearch(q: string) {
  try {
    const t = q.trim().slice(0, 64);
    if (!t) return;
    localStorage.setItem(SEARCH_KEY, t);
  } catch {
    /* ignore */
  }
}
