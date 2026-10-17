import type { NexaColorId } from "@/lib/catalog";

/** Visible color washes on in-scene product plates */
export function productTint(colorId: NexaColorId) {
  switch (colorId) {
    case "ice":
      return {
        filter:
          "brightness(1.1) contrast(1.1) saturate(1.5) hue-rotate(160deg) sepia(0.15)",
        wash: "linear-gradient(160deg, rgba(90,200,220,0.5), rgba(20,50,60,0.35))",
        glow: "rgba(126, 184, 196, 0.65)",
        ring: "#7eb8c4",
      };
    case "obsidian":
      return {
        filter: "brightness(0.7) contrast(1.22) saturate(0.55)",
        wash: "linear-gradient(160deg, rgba(0,0,0,0.45), rgba(30,30,40,0.3))",
        glow: "rgba(70, 70, 90, 0.5)",
        ring: "#3a3a40",
      };
    case "titanium":
    default:
      return {
        filter: "brightness(1.05) contrast(1.08) saturate(0.92)",
        wash: "linear-gradient(160deg, rgba(190,198,210,0.32), rgba(20,20,24,0.2))",
        glow: "rgba(194, 200, 208, 0.45)",
        ring: "#c2c8d0",
      };
  }
}
