import { LAUNCH } from "@/lib/catalog";

/**
 * Studio bundle appears after launch window (7 days) OR launch stock gone.
 * Force with NEXT_PUBLIC_FORCE_STUDIO_BUNDLE=1 for staging demos.
 */
export function isStudioBundleLive(remainingUnits?: number): boolean {
  if (process.env.NEXT_PUBLIC_FORCE_STUDIO_BUNDLE === "1") return true;

  const ends = process.env.NEXT_PUBLIC_LAUNCH_ENDS_AT;
  if (ends) {
    const t = Date.parse(ends);
    if (!Number.isNaN(t) && Date.now() > t) return true;
  }

  if (typeof remainingUnits === "number" && remainingUnits <= 0) return true;

  // Default: hidden during launch (honest scarcity of flagship only)
  void LAUNCH;
  return false;
}
