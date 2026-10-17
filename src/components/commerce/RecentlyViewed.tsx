"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getViewed, type ViewedItem } from "@/lib/store/memory";
import { useIsClient } from "@/lib/client/mounted";

export function RecentlyViewed({ className = "" }: { className?: string }) {
  const mounted = useIsClient();
  const [items, setItems] = useState<ViewedItem[]>([]);

  useEffect(() => {
    if (!mounted) return;
    const refresh = () => setItems(getViewed());
    refresh();
    window.addEventListener("nexa-viewed-change", refresh);
    return () => window.removeEventListener("nexa-viewed-change", refresh);
  }, [mounted]);

  if (!mounted || items.length === 0) return null;

  return (
    <section className={className} aria-label="נצפו לאחרונה">
      <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
        נצפו לאחרונה
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={`${item.sku}-${item.at}`}>
            <Link
              href={item.href}
              className="inline-flex border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              {item.nameHe}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
