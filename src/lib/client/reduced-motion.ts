"use client";

import { useSyncExternalStore } from "react";

function a11yMotionOn() {
  return document.documentElement.classList.contains("nexa-a11y-motion");
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    mq.removeEventListener("change", onChange);
    obs.disconnect();
  };
}

function getSnapshot() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    a11yMotionOn()
  );
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
