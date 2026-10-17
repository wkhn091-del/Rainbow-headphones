"use client";

import { useSyncExternalStore } from "react";

/** Client-only gate without setState-in-effect */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
