"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { NEXA_COLORS, PRODUCT_SKU } from "@/lib/catalog";
import { useIsClient } from "@/lib/client/mounted";
import { loadResume, type ResumeState } from "@/lib/store/resume";

/** Portal to body — never a sibling of GSAP-pinned Hero (avoids insertBefore). */
export function ContinueResume() {
  const isClient = useIsClient();
  const [resume, setResume] = useState<ResumeState | null>(null);

  useEffect(() => {
    if (!isClient) return;
    const id = window.setTimeout(() => {
      setResume(loadResume());
    }, 50);
    return () => window.clearTimeout(id);
  }, [isClient]);

  if (!isClient || (!resume?.colorId && !resume?.sku)) return null;

  const color = NEXA_COLORS.find((c) => c.id === resume.colorId);
  const href = `/checkout?sku=${encodeURIComponent(resume.sku ?? PRODUCT_SKU)}&color=${encodeURIComponent(resume.colorId ?? "titanium")}`;

  return createPortal(
    <div
      className="pointer-events-auto fixed inset-x-0 top-0 z-[45] border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-5 py-2.5 text-center text-xs text-[var(--color-text-muted)] backdrop-blur-md sm:px-8"
      role="status"
    >
      להמשיך מאיפה שעצרת
      {color ? (
        <>
          {" · "}
          <span className="text-[var(--color-text)]">{color.nameHe}</span>
        </>
      ) : null}
      {" · "}
      <Link href={href} className="text-[var(--color-accent)] hover:opacity-80">
        לתשלום
      </Link>
    </div>,
    document.body,
  );
}
