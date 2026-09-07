"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  r: number;
};

const PARTICLE_COUNT_DESKTOP = 22;
const PARTICLE_COUNT_MOBILE = 10;

/**
 * A handful of gold motes drifting across the hero, nudged gently toward
 * the cursor — a quiet gesture, never a demo. Disabled entirely under
 * reduced motion, and on connections/devices too weak to spare the cycles.
 */
export default function GoldParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const lowPower =
      nav.connection?.saveData ||
      /2g/.test(nav.connection?.effectiveType ?? "") ||
      (nav.deviceMemory ?? 8) < 2;
    if (lowPower) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;

    function resize() {
      const el = canvas as HTMLCanvasElement;
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      const context = ctx as CanvasRenderingContext2D;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;
      const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          r: 0.8 + Math.random() * 1.6,
        };
      });
    }

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function handlePointerLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function tick() {
      const context = ctx as CanvasRenderingContext2D;
      context.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dxHome = p.homeX - p.x;
        const dyHome = p.homeY - p.y;
        p.vx += dxHome * 0.0015;
        p.vy += dyHome * 0.0015;

        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const dist = Math.hypot(dxMouse, dyMouse);
        if (dist < 140) {
          const pull = (1 - dist / 140) * 0.045;
          p.vx += dxMouse * pull * 0.02;
          p.vy += dyMouse * pull * 0.02;
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = "rgba(184, 147, 74, 0.55)";
        context.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
