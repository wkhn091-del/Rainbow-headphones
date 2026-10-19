/**
 * Motion of Millions — cinematic tokens (mood: cinematic).
 * Single language for the whole site.
 */
export const MOTION = {
  mood: "cinematic" as const,
  ease: "expo.inOut",
  easeOut: "power2.out",
  duration: 1.6,
  distance: 40,
  stagger: 0.12,
  /** Lenis lerp — lower = heavier, slower (book cinematic = 0.07) */
  lerp: 0.07,
  /** Video scrub catch-up */
  filmLerp: 0.065,
  /** Cinema pin length */
  cinemaTrackVh: 520,
  cinemaTrackVhMobile: 400,
  /** Product-scroll chapter height per screen */
  productSectionVh: 150,
  productSectionVhMobile: 130,
} as const;
