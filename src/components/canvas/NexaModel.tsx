"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { NexaColor } from "@/lib/catalog";
import { NEXA_MODEL_URL } from "@/lib/3d/model-source";
import { useNexaExplode } from "./useNexaExplode";

type Props = {
  color: NexaColor;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
};

const EDGE = "#D8D6D2";

function polishMaterials(root: THREE.Object3D, color: NexaColor) {
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.castShadow = true;
    o.receiveShadow = true;
    o.frustumCulled = false;

    const srcList = Array.isArray(o.material) ? o.material : [o.material];
    const next = srcList.map((mat) => {
      const n = `${(mat as THREE.Material)?.name ?? ""} ${o.name}`.toLowerCase();
      const phys = new THREE.MeshPhysicalMaterial({
        color: color.hex,
        metalness: 0.72,
        roughness: 0.28,
        clearcoat: 0.6,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.2,
      });

      if (
        mat instanceof THREE.MeshStandardMaterial ||
        mat instanceof THREE.MeshPhysicalMaterial
      ) {
        if (mat.map) phys.map = mat.map;
        if (mat.normalMap) phys.normalMap = mat.normalMap;
        if (mat.roughnessMap) phys.roughnessMap = mat.roughnessMap;
        if (mat.metalnessMap) phys.metalnessMap = mat.metalnessMap;
        if (mat.aoMap) phys.aoMap = mat.aoMap;
        phys.color.copy(mat.color);
      }

      if (n.includes("cushion") || n.includes("felt") || n.includes("soft")) {
        phys.metalness = 0.02;
        phys.roughness = 0.9;
        phys.clearcoat = 0;
        phys.color.lerp(new THREE.Color("#121316"), 0.4);
      } else if (n.includes("yoke") || n.includes("steel") || n.includes("galvanized")) {
        phys.metalness = 0.9;
        phys.roughness = 0.2;
        phys.clearcoat = 0.75;
        phys.color.lerp(new THREE.Color(color.hex), 0.45);
      } else if (n.includes("shell") || n.includes("powder") || n.includes("charcoal")) {
        phys.metalness = 0.58;
        phys.roughness = 0.36;
        phys.clearcoat = 0.45;
        phys.color.lerp(new THREE.Color(color.hex), 0.6);
      } else if (n.includes("headband") || n.includes("arch")) {
        phys.metalness = 0.5;
        phys.roughness = 0.4;
        phys.color.lerp(new THREE.Color(color.hex), 0.55);
      }

      phys.needsUpdate = true;
      return phys;
    });
    o.material = Array.isArray(o.material) ? next : next[0];
  });
}

function worldX(obj: THREE.Object3D) {
  const v = new THREE.Vector3();
  obj.getWorldPosition(v);
  return v.x;
}

/**
 * Innerscene Monitor Cans (CC0) — graphite studio over-ears.
 * Explode: headband · L/R shell+yoke · cushions · drivers/chip overlays.
 */
export function NexaModel({ color, reducedMotion, onProgress }: Props) {
  const { scene } = useGLTF(NEXA_MODEL_URL);

  const groupRef = useRef<THREE.Group>(null);
  const headbandRef = useRef<THREE.Object3D>(null);
  const earcupLRef = useRef<THREE.Object3D>(null);
  const earcupRRef = useRef<THREE.Object3D>(null);
  const cushionLRef = useRef<THREE.Object3D>(null);
  const cushionRRef = useRef<THREE.Object3D>(null);
  const driverLRef = useRef<THREE.Object3D>(null);
  const driverRRef = useRef<THREE.Object3D>(null);
  const chipRef = useRef<THREE.Object3D>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    polishMaterials(c, color);
    c.updateMatrixWorld(true);

    const headband = c.getObjectByName("Padded headband arch");
    const shells = [
      c.getObjectByName("Ear cup outer shell"),
      c.getObjectByName("Ear cup outer shell.001"),
    ].filter(Boolean) as THREE.Object3D[];
    const cushions = [
      c.getObjectByName("Soft ear cushion"),
      c.getObjectByName("Soft ear cushion.001"),
    ].filter(Boolean) as THREE.Object3D[];
    const yokes = [
      c.getObjectByName("Ear cup metal yoke"),
      c.getObjectByName("Ear cup metal yoke.001"),
    ].filter(Boolean) as THREE.Object3D[];

    shells.sort((a, b) => worldX(a) - worldX(b));
    cushions.sort((a, b) => worldX(a) - worldX(b));
    yokes.sort((a, b) => worldX(a) - worldX(b));

    const wrapSide = (side: "L" | "R", shell?: THREE.Object3D, yoke?: THREE.Object3D) => {
      const g = new THREE.Group();
      g.name = `earcup_${side}`;
      const host = shell?.parent ?? yoke?.parent ?? c;
      host.add(g);
      if (shell) g.attach(shell);
      if (yoke) g.attach(yoke);
      return g;
    };

    return {
      root: c,
      headband: headband ?? null,
      earL: wrapSide("L", shells[0], yokes[0]),
      earR: wrapSide("R", shells[1], yokes[1]),
      cushionL: cushions[0] ?? null,
      cushionR: cushions[1] ?? null,
    };
  }, [scene, color]);

  useLayoutEffect(() => {
    headbandRef.current = clone.headband;
    earcupLRef.current = clone.earL;
    earcupRRef.current = clone.earR;
    cushionLRef.current = clone.cushionL;
    cushionRRef.current = clone.cushionR;
  }, [clone]);

  const stableProgress = useCallback(
    (p: number) => onProgress?.(p),
    [onProgress],
  );

  useNexaExplode(
    {
      group: groupRef,
      headband: headbandRef,
      earcupL: earcupLRef,
      earcupR: earcupRRef,
      cushionL: cushionLRef,
      cushionR: cushionRRef,
      driverL: driverLRef,
      driverR: driverRRef,
      chip: chipRef,
    },
    { reducedMotion, onProgress: stableProgress },
  );

  return (
    <Center cacheKey={`monitor-cans-${color.id}`}>
      <group ref={groupRef} scale={7.4}>
        <primitive object={clone.root} />

        <mesh position={[0.085, 0.015, 0.035]}>
          <sphereGeometry args={[0.0035, 12, 12]} />
          <meshStandardMaterial
            color={EDGE}
            emissive={EDGE}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>

        <group ref={driverLRef} position={[-0.055, 0.035, 0.012]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.005, 24]} />
            <meshPhysicalMaterial
              color="#9aa0a8"
              metalness={0.85}
              roughness={0.22}
              clearcoat={0.5}
            />
          </mesh>
        </group>
        <group ref={driverRRef} position={[0.055, 0.035, 0.012]}>
          <mesh rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.026, 0.01, 0.014]} />
            <meshPhysicalMaterial
              color="#d0d3d8"
              metalness={0.7}
              roughness={0.28}
              clearcoat={0.4}
            />
          </mesh>
        </group>
        <group ref={chipRef} position={[0.008, 0.03, 0.032]}>
          <mesh rotation={[0.5, 0.35, 0.1]}>
            <boxGeometry args={[0.03, 0.003, 0.018]} />
            <meshStandardMaterial color="#145c38" metalness={0.3} roughness={0.48} />
          </mesh>
        </group>
      </group>
    </Center>
  );
}

useGLTF.preload(NEXA_MODEL_URL);
