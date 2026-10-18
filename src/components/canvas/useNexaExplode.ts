"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export type NexaExplodeRefs = {
  group: RefObject<THREE.Group | null>;
  headband: RefObject<THREE.Object3D | null>;
  earcupL: RefObject<THREE.Object3D | null>;
  earcupR: RefObject<THREE.Object3D | null>;
  cushionL: RefObject<THREE.Object3D | null>;
  cushionR: RefObject<THREE.Object3D | null>;
  driverL: RefObject<THREE.Object3D | null>;
  driverR: RefObject<THREE.Object3D | null>;
  chip: RefObject<THREE.Object3D | null>;
};

type Options = {
  reducedMotion?: boolean;
  /** false = keep assembled rest pose (checkout configurator) */
  enabled?: boolean;
  trigger?: string;
  onProgress?: (progress: number) => void;
};

type XYZ = { x: number; y: number; z: number };

function capture(obj: THREE.Object3D): XYZ {
  return { x: obj.position.x, y: obj.position.y, z: obj.position.z };
}

function ready(refs: NexaExplodeRefs) {
  return Boolean(
    refs.group.current &&
      refs.headband.current &&
      refs.earcupL.current &&
      refs.earcupR.current &&
      refs.cushionL.current &&
      refs.cushionR.current &&
      refs.driverL.current &&
      refs.driverR.current &&
      refs.chip.current,
  );
}

/**
 * Explode from each node's REST pose (never zero the GLB local positions).
 */
export function useNexaExplode(refs: NexaExplodeRefs, options: Options = {}) {
  const {
    reducedMotion = false,
    enabled = true,
    trigger = ".nexa-scroll-section",
    onProgress,
  } = options;

  useEffect(() => {
    let cancelled = false;
    let tl: gsap.core.Timeline | null = null;
    let raf = 0;

    const bind = () => {
      if (cancelled) return;
      if (!ready(refs)) {
        raf = requestAnimationFrame(bind);
        return;
      }

      const group = refs.group.current!;
      const headband = refs.headband.current!;
      const earcupL = refs.earcupL.current!;
      const earcupR = refs.earcupR.current!;
      const cushionL = refs.cushionL.current!;
      const cushionR = refs.cushionR.current!;
      const driverL = refs.driverL.current!;
      const driverR = refs.driverR.current!;
      const chip = refs.chip.current!;

      const rest = {
        headband: capture(headband),
        earcupL: capture(earcupL),
        earcupR: capture(earcupR),
        cushionL: capture(cushionL),
        cushionR: capture(cushionR),
        driverL: capture(driverL),
        driverR: capture(driverR),
        chip: capture(chip),
        rotY: group.rotation.y,
        rotX: group.rotation.x,
      };

      // Restore rest (idempotent)
      gsap.set(headband.position, rest.headband);
      gsap.set(earcupL.position, rest.earcupL);
      gsap.set(earcupR.position, rest.earcupR);
      gsap.set(cushionL.position, rest.cushionL);
      gsap.set(cushionR.position, rest.cushionR);
      gsap.set(driverL.position, rest.driverL);
      gsap.set(driverR.position, rest.driverR);
      gsap.set(chip.position, rest.chip);
      gsap.set(group.scale, { x: 1, y: 1, z: 1 });
      gsap.set(group.position, { y: 0 });

      if (!enabled) {
        onProgress?.(0);
        return;
      }

      if (reducedMotion) {
        gsap.set(earcupL.position, {
          x: rest.earcupL.x - 0.12,
          y: rest.earcupL.y,
          z: rest.earcupL.z,
        });
        gsap.set(earcupR.position, {
          x: rest.earcupR.x + 0.12,
          y: rest.earcupR.y,
          z: rest.earcupR.z,
        });
        gsap.set(cushionL.position, {
          x: rest.cushionL.x - 0.2,
          y: rest.cushionL.y,
          z: rest.cushionL.z,
        });
        gsap.set(cushionR.position, {
          x: rest.cushionR.x + 0.2,
          y: rest.cushionR.y,
          z: rest.cushionR.z,
        });
        gsap.set(driverL.position, {
          x: rest.driverL.x - 0.08,
          y: rest.driverL.y,
          z: rest.driverL.z + 0.04,
        });
        gsap.set(driverR.position, {
          x: rest.driverR.x + 0.08,
          y: rest.driverR.y,
          z: rest.driverR.z + 0.03,
        });
        gsap.set(chip.position, {
          x: rest.chip.x,
          y: rest.chip.y - 0.03,
          z: rest.chip.z + 0.06,
        });
        gsap.set(headband.position, {
          x: rest.headband.x,
          y: rest.headband.y + 0.08,
          z: rest.headband.z,
        });
        onProgress?.(0.55);
        return;
      }

      const mobile =
        typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
      const startScale = mobile ? 1.55 : 2.35;
      const endScale = mobile ? 0.88 : 1;
      const spread = mobile ? 0.72 : 1;

      // Hero entrance scale — Drop then Explode across the pinned scrub
      gsap.set(group.scale, { x: startScale, y: startScale, z: startScale });
      gsap.set(group.position, { y: mobile ? 0.06 : 0.12 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: mobile ? 1.05 : 1.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      });

      // 0 → ~0.28 — The Drop
      tl.to(
        group.scale,
        {
          x: endScale,
          y: endScale,
          z: endScale,
          ease: "power2.out",
          duration: 0.28,
        },
        0,
      );
      tl.to(group.position, { y: 0, ease: "power2.out", duration: 0.28 }, 0);
      tl.to(
        group.rotation,
        { y: rest.rotY + 0.12, x: rest.rotX - 0.02, z: 0, duration: 0.28 },
        0,
      );

      // ~0.28 → 1 — Exploded view (tighter on mobile so parts stay on-screen)
      const e = 0.28;
      tl.to(
        group.rotation,
        {
          y: rest.rotY + 0.38 * spread,
          x: rest.rotX - 0.06,
          duration: 0.72,
        },
        e,
      );
      tl.to(
        earcupL.position,
        {
          x: rest.earcupL.x - 0.14 * spread,
          z: rest.earcupL.z - 0.02,
          duration: 0.55,
        },
        e,
      );
      tl.to(
        earcupR.position,
        {
          x: rest.earcupR.x + 0.14 * spread,
          z: rest.earcupR.z - 0.02,
          duration: 0.55,
        },
        e,
      );
      tl.to(
        cushionL.position,
        { x: rest.cushionL.x - 0.24 * spread, duration: 0.5 },
        e + 0.06,
      );
      tl.to(
        cushionR.position,
        { x: rest.cushionR.x + 0.24 * spread, duration: 0.5 },
        e + 0.06,
      );
      tl.to(
        driverL.position,
        {
          x: rest.driverL.x - 0.1 * spread,
          z: rest.driverL.z + 0.06 * spread,
          duration: 0.48,
        },
        e + 0.1,
      );
      tl.to(
        driverR.position,
        {
          x: rest.driverR.x + 0.1 * spread,
          z: rest.driverR.z + 0.05 * spread,
          duration: 0.48,
        },
        e + 0.1,
      );
      tl.to(
        chip.position,
        {
          y: rest.chip.y - 0.05 * spread,
          z: rest.chip.z + 0.09 * spread,
          duration: 0.45,
        },
        e + 0.14,
      );
      tl.to(
        headband.position,
        { y: rest.headband.y + 0.12 * spread, duration: 0.55 },
        e,
      );
    };

    bind();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, enabled, trigger, onProgress]);
}
