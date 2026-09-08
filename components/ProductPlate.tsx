"use client";

import { useId } from "react";
import OrbitsSymbol from "./OrbitsSymbol";
import AuTag from "./AuTag";
import ArabicMark from "./ArabicMark";
import ProductIllustration from "./ProductIllustration";
import type { Product } from "@/lib/products";
import { pickMarkColor } from "@/lib/color";

type ProductPlateProps = {
  product: Product;
  className?: string;
  /** Disables the idle orbit rotation — used for small grid thumbnails. */
  animated?: boolean;
};

/**
 * A designed "specimen plate" standing in for product photography: the
 * real coloris as a lit panel, a fine grain texture, and the house's own
 * mark — never an AI-drawn reinterpretation of it — placed exactly where
 * the tech pack specifies, at a scale and angle unique to that piece.
 */
export default function ProductPlate({ product, className = "", animated = true }: ProductPlateProps) {
  const uid = useId().replace(/[:]/g, "");
  const { plate, swatch, ref } = product;

  const markSize = 64 * plate.scale;
  const markColor = pickMarkColor(swatch);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: swatch }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay" aria-hidden="true">
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${uid})`} />
      </svg>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(13,13,13,0.28) 100%)",
        }}
        aria-hidden="true"
      />

      <ProductIllustration
        slug={product.slug}
        color={markColor}
        className="absolute inset-0 h-full w-full p-10"
      />

      {plate.mark !== "none" && (
        <div
          className="absolute"
          style={{
            top: plate.top,
            left: plate.left,
            transform: `translate(-50%, -50%) rotate(${plate.rotate}deg)`,
          }}
        >
          {plate.mark === "orbit" && (
            <OrbitsSymbol size={markSize} animated={animated} parallax={false} color={markColor} />
          )}
          {plate.mark === "lockup" && (
            <AuTag size={markSize} animated={animated} color={markColor} />
          )}
          {plate.mark === "arabic" && <ArabicMark size={markSize} color={markColor} />}
        </div>
      )}

      <span
        className="absolute bottom-4 left-4 font-sans text-[10px] uppercase tracking-[0.3em]"
        style={{ color: markColor, opacity: 0.55 }}
      >
        {ref}
      </span>
    </div>
  );
}
