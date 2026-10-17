"use client";

import { useEffect, useState } from "react";
import { LAUNCH } from "@/lib/catalog";

/** Soft remaining count from /api/stock — never blocks render */
export function LiveStockHint({ className = "" }: { className?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stock")
      .then((r) => r.json())
      .then((d: { remaining?: number }) => {
        if (!cancelled && typeof d.remaining === "number") {
          setRemaining(d.remaining);
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const n = remaining ?? LAUNCH.totalUnits;
  return (
    <span className={className}>
      נותרו <bdi dir="ltr">{n}</bdi> / {LAUNCH.totalUnits}
    </span>
  );
}
