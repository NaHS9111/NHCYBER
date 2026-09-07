"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type OrbitsSymbolProps = {
  size?: number;
  className?: string;
  /** Enables slow continuous rotation of the three orbits. */
  animated?: boolean;
  /** Enables desktop mouse-parallax tilt. Ignored if reduced motion is on. */
  parallax?: boolean;
  /** Enables optional mobile gyroscope tilt (off by default, user-toggled). */
  gyroscope?: boolean;
  /**
   * Card-hover mode: the symbol itself stays still, but one orbit turns
   * slowly on `:hover` of an ancestor `.group` — used on product cards
   * instead of a plain image zoom.
   */
  hoverOrbit?: boolean;
};

/**
 * Brand mark: three intersecting orbits (evoking superposed quantum paths)
 * around a gold nucleus — a nod to the atomic symbol of gold (Au, 79).
 */
export default function OrbitsSymbol({
  size = 96,
  className = "",
  animated = true,
  parallax = true,
  gyroscope = false,
  hoverOrbit = false,
}: OrbitsSymbolProps) {
  const prefersReducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 40, damping: 12, mass: 0.6 });
  const springY = useSpring(tiltY, { stiffness: 40, damping: 12, mass: 0.6 });

  const enableMotion = animated && !prefersReducedMotion;
  const enableParallax = parallax && !prefersReducedMotion;

  useEffect(() => {
    if (!enableParallax) return;

    function handleMouseMove(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      tiltX.set(dx * 8);
      tiltY.set(dy * 8);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableParallax, tiltX, tiltY]);

  const [gyroActive, setGyroActive] = useState(false);
  useEffect(() => {
    if (!gyroscope || prefersReducedMotion) return;

    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.beta == null || e.gamma == null) return;
      tiltX.set(Math.max(-10, Math.min(10, e.gamma / 3)));
      tiltY.set(Math.max(-10, Math.min(10, (e.beta - 45) / 3)));
    }

    window.addEventListener("deviceorientation", handleOrientation);
    setGyroActive(true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      setGyroActive(false);
    };
  }, [gyroscope, prefersReducedMotion, tiltX, tiltY]);

  return (
    <div
      ref={wrapRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={false}
      role="img"
      aria-label="Symbole the new al-khīmist : trois orbites entrelacées autour d'un noyau doré, Au 79"
    >
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ rotateX: springY, rotateY: springX }}
        className="[transform-style:preserve-3d]"
      >
        <defs>
          <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8934A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B8934A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform="translate(100 100)">
          {/* orbit 1 */}
          <g
            className={enableMotion ? "animate-orbit-1" : ""}
            style={{ transformOrigin: "0px 0px" }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="82"
              ry="34"
              transform="rotate(0)"
              fill="none"
              stroke="#B8934A"
              strokeWidth="2.2"
            />
          </g>

          {/* orbit 2 */}
          <g
            className={
              enableMotion
                ? "animate-orbit-2"
                : hoverOrbit && !prefersReducedMotion
                ? "group-hover:animate-orbit-2"
                : ""
            }
            style={{ transformOrigin: "0px 0px" }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="82"
              ry="34"
              transform="rotate(60)"
              fill="none"
              stroke="#B8934A"
              strokeWidth="2.2"
            />
          </g>

          {/* orbit 3 */}
          <g
            className={enableMotion ? "animate-orbit-3" : ""}
            style={{ transformOrigin: "0px 0px" }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="82"
              ry="34"
              transform="rotate(120)"
              fill="none"
              stroke="#B8934A"
              strokeWidth="2.2"
            />
          </g>

          {/* gold nucleus */}
          <circle r="20" fill="url(#nucleus-glow)" />
          <circle r="8" fill="#B8934A" />
        </g>
      </motion.svg>
    </div>
  );
}
