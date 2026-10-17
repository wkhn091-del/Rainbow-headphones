import type { NexaColorId } from "@/lib/catalog";

/**
 * Soft sold-out flags via env until Supabase stock-by-color is live.
 * Example: NEXT_PUBLIC_SOLD_OUT_COLORS=ice,obsidian
 */
export function soldOutColorIds(): NexaColorId[] {
  const raw = process.env.NEXT_PUBLIC_SOLD_OUT_COLORS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is NexaColorId =>
      s === "titanium" || s === "obsidian" || s === "ice",
    );
}

export function isColorSoldOut(id: NexaColorId): boolean {
  return soldOutColorIds().includes(id);
}
