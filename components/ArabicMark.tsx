"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ArabicMarkProps = {
  size?: number;
  className?: string;
  /** Defaults to brand gold; pass a contrasting color on gold/light backgrounds. */
  color?: string;
};

/**
 * The house's Arabic mark: "الجديد" (the new) riding an orbit path like an
 * electron trail, with a small gold point — the electron itself — traveling
 * the same path. A second brand signature alongside the Au/79 symbol.
 */
export default function ArabicMark({ size = 96, className = "", color = "#B8934A" }: ArabicMarkProps) {
  const uid = useId().replace(/[:]/g, "");
  const prefersReducedMotion = useReducedMotion();
  const pathId = `orbitPath-${uid}`;
  const glowId = `nucleus-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="الجديد — the new, symbole d'orbite en arabe"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <path
          id={pathId}
          d="M 25,120 A 95,40 0 1,1 215,120 A 95,40 0 1,1 25,120"
          transform="rotate(-30 120 120)"
        />
      </defs>

      <ellipse
        cx="120"
        cy="120"
        rx="95"
        ry="40"
        transform="rotate(30 120 120)"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeOpacity="0.35"
      />
      <ellipse
        cx="120"
        cy="120"
        rx="95"
        ry="40"
        transform="rotate(90 120 120)"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeOpacity="0.35"
      />
      <use href={`#${pathId}`} fill="none" stroke={color} strokeWidth="1.4" strokeOpacity="0.35" />

      <circle cx="120" cy="120" r="22" fill={`url(#${glowId})`} />
      <circle cx="120" cy="120" r="8" fill={color} />

      <text fontFamily="Amiri, serif" fontSize="26" fill={color} letterSpacing="0.5">
        <textPath href={`#${pathId}`} startOffset="27%">
          الجديد
        </textPath>
      </text>

      {prefersReducedMotion ? (
        <circle cx="25" cy="120" r="5.5" fill={color} transform="rotate(-30 120 120)" />
      ) : (
        <motion.circle
          r="5.5"
          fill={color}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{
            offsetPath: `path("M 25,120 A 95,40 0 1,1 215,120 A 95,40 0 1,1 25,120")`,
            offsetRotate: "0deg",
            transform: "rotate(-30deg)",
            transformOrigin: "120px 120px",
          }}
        />
      )}
    </svg>
  );
}
