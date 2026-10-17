"use client";

/* eslint-disable react-hooks/immutability -- Three.js Scene is a mutable host object; IBL requires scene.environment */
import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

/**
 * Soft local IBL — no CDN.
 * Mutates scene.environment intentionally (R3F / Three.js pattern).
 */
export function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(2, 3, 1);
    envScene.add(key);
    const fill = new THREE.DirectionalLight(0xa8b8c8, 0.3);
    fill.position.set(-2, 1, 2);
    envScene.add(fill);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ color: 0x1a1b20 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    envScene.add(ground);

    const env = pmrem.fromScene(envScene, 0.04).texture;
    const prev = scene.environment;
    scene.environment = env;
    if ("environmentIntensity" in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity =
        0.5;
    }

    return () => {
      scene.environment = prev;
      env.dispose();
      pmrem.dispose();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
    };
  }, [gl, scene]);

  return null;
}
