"use client";

import { useEffect } from "react";
import { pushViewed } from "@/lib/store/memory";

/** Fire-and-forget view memory for product pages */
export function TrackViewed({
  sku,
  nameHe,
  href,
}: {
  sku: string;
  nameHe: string;
  href: string;
}) {
  useEffect(() => {
    pushViewed({ sku, nameHe, href });
  }, [sku, nameHe, href]);
  return null;
}
