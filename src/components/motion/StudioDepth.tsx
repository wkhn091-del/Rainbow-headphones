"use client";

import { useEffect } from "react";

/**
 * Mid-site depth tones — studio / deep-site chapter colors (motion-kit "studio").
 * Sections mark themselves with data-depth="ink|steel|bone|cyan".
 */
export function StudioDepth() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-depth]"),
    );
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target as HTMLElement | undefined;
        const tone = top?.dataset.depth;
        if (!tone) return;
        if (root.dataset.depth === tone) return;
        root.dataset.depth = tone;
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: "-15% 0px -35% 0px" },
    );

    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      delete root.dataset.depth;
    };
  }, []);

  return null;
}
