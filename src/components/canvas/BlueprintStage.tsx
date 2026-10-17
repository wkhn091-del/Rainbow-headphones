"use client";

import { Line } from "@react-three/drei";

const CYAN = "#D8D6D2";

/**
 * Subtle axis ticks only — short lines so they don't dominate as a "wheel hub".
 */
export function BlueprintStage() {
  const len = 1.1;
  return (
    <group position={[0, -0.1, 0]}>
      <Line
        points={[
          [0, 0, 0],
          [len, 0, 0],
        ]}
        color={CYAN}
        lineWidth={1}
        transparent
        opacity={0.45}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, len, 0],
        ]}
        color={CYAN}
        lineWidth={1}
        transparent
        opacity={0.45}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 0, len],
        ]}
        color={CYAN}
        lineWidth={1}
        transparent
        opacity={0.45}
      />
    </group>
  );
}
