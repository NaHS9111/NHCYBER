import OrbitsSymbol from "./OrbitsSymbol";

type AuTagProps = {
  size?: number;
  className?: string;
  animated?: boolean;
  /** Overrides the default gold — pass a contrasting color on gold/light backgrounds. */
  color?: string;
};

/**
 * The orbits symbol with the "Au / 79" element-card tag at its corner —
 * no wordmark. Used where the full lockup would be too much (engraved on
 * an object, stamped on a product plate) but the "Au 79" identifier still
 * belongs.
 */
export default function AuTag({
  size = 64,
  className = "",
  animated = false,
  color = "#B8934A",
}: AuTagProps) {
  return (
    <span className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <OrbitsSymbol size={size} animated={animated} parallax={false} color={color} />
      <span
        className="pointer-events-none absolute left-0 top-0 flex flex-col leading-none"
        style={{ fontSize: size * 0.2 }}
      >
        <span className="font-sans text-[1em] font-semibold" style={{ color }}>
          Au
        </span>
        <span className="font-sans text-[0.7em]" style={{ color, opacity: 0.7 }}>
          79
        </span>
      </span>
    </span>
  );
}
