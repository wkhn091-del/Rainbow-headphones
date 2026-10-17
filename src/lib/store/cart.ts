"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NexaColorId } from "@/lib/catalog";

export type CartLine = {
  sku: string;
  colorId?: NexaColorId;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: CartLine) => void;
  remove: (sku: string, colorId?: NexaColorId) => void;
  setQty: (sku: string, qty: number, colorId?: NexaColorId) => void;
  clear: () => void;
};

function keyOf(l: Pick<CartLine, "sku" | "colorId">) {
  return `${l.sku}::${l.colorId ?? ""}`;
}

/** Client display only — prices resolved at checkout (Security Baseline) */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (line) => {
        const qty = Math.min(Math.max(line.qty, 1), 2);
        const lines = [...get().lines];
        const i = lines.findIndex((l) => keyOf(l) === keyOf(line));
        if (i >= 0) {
          lines[i] = {
            ...lines[i]!,
            qty: Math.min(lines[i]!.qty + qty, 2),
          };
        } else {
          lines.push({ ...line, qty });
        }
        set({ lines, open: true });
      },
      remove: (sku, colorId) =>
        set({
          lines: get().lines.filter((l) => keyOf(l) !== keyOf({ sku, colorId })),
        }),
      setQty: (sku, qty, colorId) => {
        const q = Math.min(Math.max(qty, 0), 2);
        if (q === 0) {
          get().remove(sku, colorId);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            keyOf(l) === keyOf({ sku, colorId }) ? { ...l, qty: q } : l,
          ),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "nexa-cart-v1" },
  ),
);
