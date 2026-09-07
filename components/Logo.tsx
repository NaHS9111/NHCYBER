import Link from "next/link";
import OrbitsSymbol from "./OrbitsSymbol";

type LogoProps = {
  symbolSize?: number;
  className?: string;
};

/**
 * Full lockup: orbits symbol with the "Au / 79" element-card mark at its
 * corner, a thin gold divider, then the wordmark stacked as
 * "the new" / "al-khīmist" — matching the house's official logo artwork.
 */
export default function Logo({ symbolSize = 48, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-4 ${className}`}
      aria-label="the new al-khīmist — accueil"
    >
      <span
        className="flex items-center gap-4"
        style={{ fontSize: symbolSize * 0.31 }}
        aria-hidden="true"
      >
        <span className="relative inline-flex" style={{ width: symbolSize, height: symbolSize }}>
          <OrbitsSymbol size={symbolSize} parallax={false} />
          <span className="pointer-events-none absolute left-0 top-0 flex flex-col leading-none">
            <span className="font-sans text-[0.8em] font-semibold text-or">Au</span>
            <span className="font-sans text-[0.55em] text-or/70">79</span>
          </span>
        </span>

        <span
          className="self-stretch w-px bg-gradient-to-b from-transparent via-or/60 to-transparent"
        />

        <span className="flex flex-col justify-center leading-none">
          <span className="text-[0.7em] tracking-[0.25em] text-pierre lowercase">
            the new
          </span>
          <span className="mt-1 font-wordmark text-[1.6em] font-semibold leading-none tracking-tight text-ecru lowercase">
            al-khīmist
          </span>
        </span>
      </span>
    </Link>
  );
}
