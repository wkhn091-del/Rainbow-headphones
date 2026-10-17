"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { ExplodeNode, NexaColor } from "@/lib/catalog";

type Props = {
  color: NexaColor;
  explode: number;
  autoSpin?: boolean;
};

const OFFSETS: Record<ExplodeNode, THREE.Vector3> = {
  headband: new THREE.Vector3(0, 0.55, 0),
  earcups: new THREE.Vector3(0.62, 0, 0),
  cushions: new THREE.Vector3(0.72, 0, 0.12),
  drivers: new THREE.Vector3(0.78, 0, 0.38),
  chipboard: new THREE.Vector3(0, -0.42, 0.28),
};

function easeSmooth(t: number) {
  const e = THREE.MathUtils.clamp(t, 0, 1);
  return e * e * (3 - 2 * e);
}

type MatProps = {
  color: string;
  wire?: boolean;
  emissive?: string;
  opacity?: number;
};

function BlueprintMat({ color, wire = false, emissive, opacity = 1 }: MatProps) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={wire ? 0.15 : 0.65}
      roughness={wire ? 0.55 : 0.32}
      wireframe={wire}
      transparent={opacity < 1}
      opacity={opacity}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissive ? 0.85 : 0}
    />
  );
}

/**
 * Engineering blueprint — nodes: headband · earcups · cushions · drivers · chipboard
 * Swap for faithful GLB later without changing explode contract.
 */
export function BlueprintHeadphones({
  color,
  explode,
  autoSpin = true,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const headband = useRef<THREE.Group>(null);
  const earcups = useRef<THREE.Group>(null);
  const cushions = useRef<THREE.Group>(null);
  const drivers = useRef<THREE.Group>(null);
  const chipboard = useRef<THREE.Group>(null);

  const shell = useMemo(() => color.hex, [color.hex]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const e = easeSmooth(explode);

    if (root.current) {
      root.current.rotation.y =
        0.45 + (autoSpin ? Math.sin(t * 0.25) * 0.05 : 0) + e * Math.PI * 0.95;
      root.current.rotation.x = 0.12;
    }

    if (headband.current) {
      headband.current.position.set(0, OFFSETS.headband.y * e, 0);
    }
    if (chipboard.current) {
      chipboard.current.position.set(
        0,
        OFFSETS.chipboard.y * e,
        OFFSETS.chipboard.z * e,
      );
    }

    earcups.current?.children.forEach((child, i) => {
      const side = i === 0 ? -1 : 1;
      child.position.x = 0.78 * side + OFFSETS.earcups.x * e * side;
      child.position.y = -0.05;
      child.position.z = 0;
    });
    cushions.current?.children.forEach((child, i) => {
      const side = i === 0 ? -1 : 1;
      child.position.set(
        0.78 * side + OFFSETS.cushions.x * e * side,
        -0.05,
        0.12 + OFFSETS.cushions.z * e,
      );
    });
    drivers.current?.children.forEach((child, i) => {
      const side = i === 0 ? -1 : 1;
      child.position.set(
        0.78 * side + OFFSETS.drivers.x * e * side,
        -0.05,
        0.02 + OFFSETS.drivers.z * e,
      );
    });
  });

  return (
    <group ref={root} scale={1.05} position={[0, 0.05, 0]}>
      <group ref={headband} name="headband">
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.72, 0.055, 12, 48, Math.PI]} />
          <BlueprintMat color={shell} />
          <Edges threshold={15} color="#D8D6D2" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
          <torusGeometry args={[0.72, 0.055, 12, 48, Math.PI]} />
          <BlueprintMat color={shell} wire opacity={0.4} />
        </mesh>
      </group>

      <group ref={earcups} name="earcups">
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 0.78, -0.05, 0]}>
            <mesh castShadow rotation={[0, 0, side * 0.12]}>
              <cylinderGeometry args={[0.28, 0.3, 0.22, 24]} />
              <BlueprintMat color={shell} />
              <Edges threshold={12} color="#2A2C33" />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={cushions} name="cushions">
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 0.78, -0.05, 0.12]}>
            <mesh castShadow>
              <torusGeometry args={[0.2, 0.06, 10, 24]} />
              <BlueprintMat color="#1a1a1e" />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={drivers} name="drivers">
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 0.78, -0.05, 0.02]}>
            <mesh castShadow>
              <circleGeometry args={[0.16, 24]} />
              <BlueprintMat color="#3a3a40" wire />
              <Edges color="#D8D6D2" />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={chipboard} name="chipboard" position={[0, -0.15, 0.05]}>
        <mesh castShadow rotation={[0.4, 0.2, 0]}>
          <boxGeometry args={[0.28, 0.04, 0.2]} />
          <BlueprintMat color="#121316" emissive="#D8D6D2" />
          <Edges color="#D8D6D2" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.22, 0.005, 0.005]} />
          <meshBasicMaterial color="#D8D6D2" />
        </mesh>
      </group>
    </group>
  );
}
