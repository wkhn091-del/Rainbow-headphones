"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { NexaColor } from "@/lib/catalog";
import { HeadphonesModel } from "./HeadphonesModel";

type Props = {
  color: NexaColor;
  explode: number;
  reducedMotion?: boolean;
};

export default function NexaScene({ color, explode, reducedMotion }: Props) {
  return (
    <div className="h-full w-full min-h-[320px]">
      <Canvas
        camera={{ position: [0, 0.15, 3.4], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <color attach="background" args={["#0c0c0c"]} />
        <ambientLight intensity={0.6} color="#eceae6" />
        <spotLight position={[4, 6, 3]} angle={0.4} penumbra={0.9} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-3, 2, 2]} intensity={1.0} color="#d8d6d2" />
        <pointLight position={[0, 0.5, -3]} intensity={1.5} color="#D8D6D2" distance={12} />
        <pointLight position={[-2, 1, 2]} intensity={0.6} color="#D8D6D2" distance={8} />
        <HeadphonesModel
          color={color}
          explode={explode}
          autoSpin={!reducedMotion}
        />
        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.45}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
