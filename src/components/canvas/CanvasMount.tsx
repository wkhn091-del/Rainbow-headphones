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
import { useIsMobile } from "@/lib/client/mobile";

type Props = {
  color: NexaColor;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
  explodeOnScroll?: boolean;
  showBlueprint?: boolean;
};

/**
 * Cold Studio WebGL — mobile: lower DPR, farther camera, no blueprint clutter.
 */
export function CanvasMount({
  color,
  reducedMotion,
  onProgress,
  explodeOnScroll = true,
  showBlueprint = true,
}: Props) {
  const ready = useIsClient();
  const mobile = useIsMobile();
  const rafRef = useRef(0);
  const lastRef = useRef(-1);

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
  const blueprint = showBlueprint && !mobile;
  const camZ = fillViewport ? (mobile ? 2.55 : 2.15) : mobile ? 2.7 : 2.45;
  const fov = fillViewport ? (mobile ? 38 : 32) : mobile ? 40 : 36;

  return (
    <div
      className={`relative h-full w-full ${fillViewport ? "min-h-[100dvh]" : "min-h-0"}`}
    >
      <Canvas
        frameloop="always"
        camera={{
          position: [mobile ? 0.08 : 0.15, mobile ? 0.12 : 0.2, camZ],
          fov,
          near: 0.05,
          far: 80,
        }}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: mobile ? "default" : "high-performance",
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor("#0c0c0c", 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.95;
          scene.background = new THREE.Color("#0c0c0c");
          camera.lookAt(0, 0.08, 0);
        }}
      >
        <AdaptiveDpr pixelated />
        <StudioEnvironment />
        <ambientLight intensity={mobile ? 1.25 : 1.1} color="#e4e8f0" />
        <hemisphereLight args={["#f0f2f6", "#1a1a1e", 0.85]} />
        <directionalLight
          position={[2.5, 3.5, 2]}
          intensity={mobile ? 1.8 : 2.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-2.2, 1.2, 1.5]}
          intensity={1.0}
          color="#9eb4c8"
        />
        {!mobile ? (
          <pointLight
            position={[0.8, -0.2, 1.2]}
            intensity={0.8}
            color="#D8D6D2"
            distance={6}
          />
        ) : null}

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
          {blueprint ? <BlueprintStage /> : null}
        </Suspense>

        <ContactShadows
          position={[0, -0.95, 0]}
          opacity={mobile ? 0.35 : 0.5}
          scale={8}
          blur={mobile ? 1.6 : 2.2}
          far={3}
          color="#000000"
        />
        {blueprint ? (
          <gridHelper
            args={[8, 16, "#1a1c22", "#101114"]}
            position={[0, -0.96, 0]}
          />
        ) : null}
      </Canvas>
    </div>
  );
}
