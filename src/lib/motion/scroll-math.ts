/** Pure helpers for Apple-style scroll keyframes (Kompose / MacBook Pro pattern). */

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/** Map global progress into a 0..1 window between start and end. */
export function subProgress(p: number, start: number, end: number) {
  if (end <= start) return p >= end ? 1 : 0;
  return clamp((p - start) / (end - start));
}

/** Section track progress: 0 when sticky locks, 1 when it unlocks. */
export function trackProgress(section: HTMLElement) {
  const r = section.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  if (total <= 0) return 0;
  return clamp(-r.top / total);
}

/** Even pace start→end — 1:1 scroll to film time (no fast start / slow middle). */
export function filmProgress(p: number) {
  return clamp(p);
}
