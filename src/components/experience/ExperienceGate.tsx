"use client";

import { useState, type ReactNode } from "react";
import { CinematicPreloader } from "./CinematicPreloader";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

/** Short cinematic preload, then the real scroll cinema + descending cans. */
export function ExperienceGate({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  if (!ready) {
    return <CinematicPreloader onDone={() => setReady(true)} />;
  }

  return <>{children}</>;
}
