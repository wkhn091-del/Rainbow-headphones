"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { NEXA_MODEL_URL } from "@/lib/3d/model-source";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

type Props = {
  onDone: () => void;
};

/**
 * Act 1 — black cinematic preload with % while GLB warms the GPU cache.
 */
export function CinematicPreloader({ onDone }: Props) {
  const reduced = usePrefersReducedMotion();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }

    let cancelled = false;
    let raf = 0;
    let displayed = 0;
    let target = 8;

    const tick = () => {
      if (cancelled) return;
      displayed += (target - displayed) * 0.08;
      setPct(Math.min(100, Math.round(displayed)));
      if (displayed < 99.5 || target < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        window.setTimeout(() => {
          if (!cancelled) onDone();
        }, 520);
      }
    };
    raf = requestAnimationFrame(tick);

    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      if (!total) return;
      target = Math.max(target, Math.round((loaded / total) * 92));
    };

    const draco = new DRACOLoader(manager);
    draco.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(draco);

    loader.load(
      `${NEXA_MODEL_URL}?v=experience`,
      () => {
        target = 100;
      },
      (e) => {
        if (e.total) target = Math.max(target, Math.round((e.loaded / e.total) * 92));
      },
      () => {
        // Still reveal — procedural fallback exists in product-scroll
        target = 100;
      },
    );

    // Safety unlock
    const safety = window.setTimeout(() => {
      target = 100;
    }, 9000);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      draco.dispose();
    };
  }, [onDone, reduced]);

  if (reduced) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-busy={!leaving}
      aria-live="polite"
    >
      <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.42em] text-white/35 uppercase">
        Nexa Pro 3D
      </p>
      <p className="mt-8 font-[family-name:var(--font-mono)] text-[clamp(2.8rem,10vw,5rem)] font-medium tabular-nums tracking-[-0.04em] text-white">
        {String(pct).padStart(2, "0")}
        <span className="text-white/35">%</span>
      </p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
        <div
          className="h-full bg-white/70 transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
