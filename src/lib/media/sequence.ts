/**
 * Tier 2 Image Sequence stand-in — lifestyle + refs until true 4K frames land.
 * Order: assembled → wear/desk → detail → explode parts → case close.
 * Marked הדמיה in UI.
 */
export const SEQUENCE = {
  trackVh: 260,
  poster: "/images/refs/nexa-assembled.png",
  frames: [
    "/images/refs/nexa-assembled.png",
    "/images/lifestyle/nexa-real-desk.jpg",
    "/images/lifestyle/nexa-real-wear.jpg",
    "/images/lifestyle/nexa-real-detail.jpg",
    "/images/lifestyle/nexa-real-studio.jpg",
    "/images/refs/nexa-exploded-ref.png",
    "/images/lifestyle/nexa-real-parts.jpg",
    "/images/refs/headphones-target.png",
    "/images/lifestyle/nexa-real-case.jpg",
    "/images/refs/nexa-assembled.png",
  ],
} as const;

export type SequenceFrame = (typeof SEQUENCE.frames)[number];
