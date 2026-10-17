"use client";

import dynamic from "next/dynamic";
import type { NexaColor } from "@/lib/catalog";

const CanvasMount = dynamic(
  () => import("./CanvasMount").then((m) => m.CanvasMount),
  { ssr: false, loading: () => null },
);

type Props = {
  color: NexaColor;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
};

export function LazyCanvas(props: Props) {
  return <CanvasMount {...props} />;
}
