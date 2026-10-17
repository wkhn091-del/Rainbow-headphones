"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/copy/faq";

type Props = {
  items?: readonly { q: string; a: string }[];
  className?: string;
  limit?: number;
};

export function FaqAccordion({
  items = FAQ_ITEMS,
  className = "",
  limit,
}: Props) {
  const list = limit ? items.slice(0, limit) : items;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className={`divide-y divide-white/10 border-y border-white/10 ${className}`}>
      {list.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-5 text-start transition hover:text-[var(--color-accent)]"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-base font-medium text-white sm:text-lg">
                {item.q}
              </span>
              <span
                className={`mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-faint)] transition ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
