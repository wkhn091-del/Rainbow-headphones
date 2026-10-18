"use client";

import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/** Reactive ≤767px — hydration-safe (false until mount). */
export function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return mobile;
}
