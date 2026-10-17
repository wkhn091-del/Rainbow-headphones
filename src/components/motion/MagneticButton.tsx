"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";

const LERP = 0.15;
const PULL = 0.28;

type Common = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * M2 — Bone Magnetic Field: subtle pull toward cursor (desktop).
 * transform only · reduced-motion → static.
 */
export function MagneticButton({
  children,
  className = "nexa-btn-buy",
  style,
  type = "button",
  onClick,
  id,
  disabled,
}: Common & {
  type?: "button" | "submit";
  onClick?: () => void;
  id?: string;
  disabled?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const anim = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  const loop = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const a = anim.current;
    a.x += (a.tx - a.x) * LERP;
    a.y += (a.ty - a.y) * LERP;
    el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
    if (Math.abs(a.tx - a.x) > 0.05 || Math.abs(a.ty - a.y) > 0.05) {
      a.raf = requestAnimationFrame(loop);
    } else {
      a.raf = 0;
      el.style.transform = `translate3d(${a.tx}px, ${a.ty}px, 0)`;
    }
  }, []);

  const onMove = (e: MouseEvent) => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    anim.current.tx = (e.clientX - r.left - r.width / 2) * PULL;
    anim.current.ty = (e.clientY - r.top - r.height / 2) * PULL - 1;
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(loop);
  };

  const onLeave = () => {
    anim.current.tx = 0;
    anim.current.ty = 0;
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(loop);
  };

  return (
    <button
      ref={ref}
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`nexa-magnetic will-change-transform ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function MagneticLink({
  href,
  children,
  className = "nexa-btn-buy",
  style,
}: Common & { href: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const anim = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  const loop = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const a = anim.current;
    a.x += (a.tx - a.x) * LERP;
    a.y += (a.ty - a.y) * LERP;
    el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
    if (Math.abs(a.tx - a.x) > 0.05 || Math.abs(a.ty - a.y) > 0.05) {
      a.raf = requestAnimationFrame(loop);
    } else {
      a.raf = 0;
      el.style.transform = `translate3d(${a.tx}px, ${a.ty}px, 0)`;
    }
  }, []);

  const onMove = (e: MouseEvent) => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    anim.current.tx = (e.clientX - r.left - r.width / 2) * PULL;
    anim.current.ty = (e.clientY - r.top - r.height / 2) * PULL - 1;
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(loop);
  };

  const onLeave = () => {
    anim.current.tx = 0;
    anim.current.ty = 0;
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(loop);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`nexa-magnetic will-change-transform ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}
