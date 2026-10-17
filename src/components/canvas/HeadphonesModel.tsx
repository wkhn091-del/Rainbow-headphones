"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { NexaColor } from "@/lib/catalog";

const MODEL_PATH = "/models/nexa-pro.glb";

type Props = {
  color: NexaColor;
  explode: number;
  autoSpin?: boolean;
};

function easeSmooth(t: number) {
  const e = THREE.MathUtils.clamp(t, 0, 1);
  return e * e * (3 - 2 * e);
}

/**
 * Beats stand-in GLB — oriented upright, centered, tinted.
 * Framing handled by parent Bounds (not manual TARGET_HEIGHT).
 */
export function HeadphonesModel({ color, explode, autoSpin = true }: Props) {
  const { scene } = useGLTF(MODEL_PATH);
  const spin = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Object3D>(null);
  const cushions = useRef<THREE.Object3D>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = true;
      o.receiveShadow = true;
      if (o.name === "Object_2") {
        o.visible = false;
        return;
      }
      if (Array.isArray(o.material)) {
        o.material = o.material.map((m) => m.clone());
      } else if (o.material) {
        o.material = o.material.clone();
      }
    });
    return c;
  }, [scene]);

  useEffect(() => {
    clone.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || !o.visible) return;
      if (o.name === "Object_4") shell.current = o;
      if (o.name === "Object_3") cushions.current = o;

      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of mats) {
        if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
        const n = (mat.name || "").toLowerCase();

        if (n.includes("plastic") || o.name === "Object_4") {
          mat.color.set(color.hex);
          mat.metalness = Math.min(color.metalness, 0.72);
          mat.roughness = Math.max(color.roughness, 0.28);
          mat.emissive.set(color.hex);
          mat.emissiveIntensity = color.id === "obsidian" ? 0.28 : 0.1;
        } else if (n.includes("ear") || o.name === "Object_3") {
          mat.color.set("#1e1e24");
          mat.roughness = 0.9;
          mat.metalness = 0.04;
        }
        mat.needsUpdate = true;
      }
    });
  }, [clone, color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const e = easeSmooth(explode);
    if (spin.current) {
      spin.current.rotation.y =
        0.55 + (autoSpin ? Math.sin(t * 0.3) * 0.08 : 0) + e * Math.PI * 0.9;
      spin.current.position.y = Math.sin(t * 0.45) * 0.03;
    }
    if (shell.current) shell.current.position.y = e * 0.04;
    if (cushions.current) {
      cushions.current.position.z = e * 0.04;
      cushions.current.position.y = -e * 0.02;
    }
  });

  return (
    <Center cacheKey="nexa-pro">
      {/* Stand-in often imports flat — tip upright toward camera */}
      <group rotation={[0.35, 0, 0]}>
        <group ref={spin}>
          <primitive object={clone} />
        </group>
      </group>
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);
