"use client";

import { Suspense, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { NexaColor } from "@/lib/catalog";
import { NexaModel } from "./NexaModel";
import { BlueprintStage } from "./BlueprintStage";
import { StudioEnvironment } from "./StudioEnvironment";
import { useIsClient } from "@/lib/client/mounted";

type Props = {
  color: NexaColor;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
  explodeOnScroll?: boolean;
  showBlueprint?: boolean;
};

/**
 * Cold Studio WebGL — 5-node blueprint + line HUD (no drei Html portals).
 */
export function CanvasMount({
  color,
  reducedMotion,
  onProgress,
  explodeOnScroll = true,
  showBlueprint = true,
}: Props) {
  const ready = useIsClient();
  const rafRef = useRef(0);
  const lastRef = useRef(-1);

  // Throttle progress → DOM so GSAP scrub doesn't thrash React every frame
  const handleProgress = useCallback(
    (p: number) => {
      if (!onProgress) return;
      const rounded = Math.round(p * 100) / 100;
      if (rounded === lastRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        lastRef.current = rounded;
        onProgress(rounded);
      });
    },
    [onProgress],
  );

  if (!ready) return null;

  const fillViewport = explodeOnScroll;

  return (
    <div
      className={`relative h-full w-full ${fillViewport ? "min-h-[100dvh]" : "min-h-0"}`}
    >
      <Canvas
        frameloop="always"
        camera={{
          position: fillViewport ? [0.15, 0.2, 2.15] : [0.1, 0.12, 2.45],
          fov: fillViewport ? 32 : 36,
          near: 0.05,
          far: 80,
        }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor("#0c0c0c", 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.95;
          scene.background = new THREE.Color("#0c0c0c");
          camera.lookAt(0, 0.1, 0);
        }}
      >
        <AdaptiveDpr pixelated />
        <StudioEnvironment />
        <ambientLight intensity={1.1} color="#e4e8f0" />
        <hemisphereLight args={["#f0f2f6", "#1a1a1e", 0.85]} />
        <directionalLight
          position={[2.5, 3.5, 2]}
          intensity={2.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-2.2, 1.2, 1.5]}
          intensity={1.0}
          color="#9eb4c8"
        />
        <pointLight
          position={[0.8, -0.2, 1.2]}
          intensity={0.8}
          color="#D8D6D2"
          distance={6}
        />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[0.4, 0.2, 0.15]} />
              <meshBasicMaterial color="#2a2c33" wireframe />
            </mesh>
          }
        >
          <NexaModel
            color={color}
            reducedMotion={reducedMotion}
            onProgress={handleProgress}
            explodeOnScroll={explodeOnScroll}
          />
          {showBlueprint ? <BlueprintStage /> : null}
        </Suspense>

        <ContactShadows
          position={[0, -0.95, 0]}
          opacity={0.5}
          scale={8}
          blur={2.2}
          far={3}
          color="#000000"
        />
        {showBlueprint ? (
          <gridHelper
            args={[8, 16, "#1a1c22", "#101114"]}
            position={[0, -0.96, 0]}
          />
        ) : null}
      </Canvas>
    </div>
  );
}
