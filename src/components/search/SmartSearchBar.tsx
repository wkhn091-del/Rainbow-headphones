"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { getLastSearch, setLastSearch } from "@/lib/store/memory";
import { FLAGSHIP, ACCESSORIES, PRODUCT_SKU } from "@/lib/catalog";

type Hit = {
  sku: string;
  nameHe: string;
  nameEn: string;
  priceIls: number;
  href: string;
  swatch: string | null;
  kind: string;
};

const POPULAR = [
  { q: FLAGSHIP.name, href: "/#buy" },
  { q: "Dock", href: `/shop` },
  { q: "ANC", href: "/anc" },
  { q: ACCESSORIES[0]?.nameHe ?? "אביזרים", href: "/shop" },
] as const;

export function SmartSearchBar({ compact = false }: { compact?: boolean }) {
  const listId = useId();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const restored = useRef(false);
  const trimmed = q.trim();

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const last = getLastSearch();
    if (last) setQ(last);
  }, []);

  useEffect(() => {
    if (trimmed.length < 1) {
      setHits([]);
      return;
    }
    setLastSearch(trimmed);

    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
        );
        const data = (await res.json()) as { results?: Hit[] };
        setHits(data.results ?? []);
        setOpen(true);
      } catch {
        setHits([]);
      } finally {
        setBusy(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [trimmed]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showPopular = open && trimmed.length < 1;
  const listOpen =
    open && (showPopular || hits.length > 0 || busy);

  return (
    <div
      ref={wrap}
      className={`relative ${compact ? "w-40 sm:w-52" : "w-full max-w-sm"}`}
    >
      <label className="sr-only" htmlFor={listId}>
        חיפוש מוצרים
      </label>
      <input
        id={listId}
        type="search"
        role="combobox"
        autoComplete="off"
        maxLength={64}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="חיפוש · Pro, Dock, ANC…"
        className="nexa-input py-2 text-xs"
        aria-autocomplete="list"
        aria-expanded={listOpen}
        aria-controls={`${listId}-list`}
      />
      {listOpen ? (
        <ul
          id={`${listId}-list`}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+4px)] z-50 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-contact)]"
        >
          {showPopular ? (
            <>
              <li className="px-3 py-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                פופולרי
              </li>
              {POPULAR.map((p) => (
                <li key={p.q} role="option">
                  <Link
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 text-sm text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
                  >
                    {p.q}
                  </Link>
                </li>
              ))}
              <li className="border-t border-[var(--color-border)] px-3 py-2">
                <Link
                  href={`/shop?sku=${PRODUCT_SKU}`}
                  onClick={() => setOpen(false)}
                  className="text-[11px] text-[var(--color-accent)]"
                >
                  לכל החנות →
                </Link>
              </li>
            </>
          ) : null}

          {busy && hits.length === 0 && !showPopular ? (
            <li className="px-3 py-2 text-xs text-[var(--color-text-faint)]">
              מחפש…
            </li>
          ) : null}

          {!showPopular &&
            hits.map((h) => (
              <li key={h.sku} role="option" aria-selected={false}>
                <Link
                  href={h.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition hover:bg-white/5"
                >
                  <span
                    className="h-8 w-8 shrink-0 border border-[var(--color-border)]"
                    style={{ background: h.swatch ?? "#1a1a1e" }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[var(--color-text)]">
                      {h.nameHe}
                    </span>
                    <span
                      className="block text-[11px] text-[var(--color-text-faint)]"
                      dir="ltr"
                    >
                      {h.nameEn}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                    ₪{h.priceIls.toLocaleString("he-IL")}
                  </span>
                </Link>
              </li>
            ))}

          {!showPopular && !busy && trimmed.length > 0 && hits.length === 0 ? (
            <li className="px-3 py-3 text-xs text-[var(--color-text-faint)]">
              אין תוצאות · נסו «Pro» או «Dock»
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
