import Link from "next/link";
import OrbitsSymbol from "./OrbitsSymbol";

type LogoProps = {
  size?: number;
  showMark?: boolean;
  className?: string;
};

export default function Logo({ size = 40, showMark = true, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label="the new al-khīmist — accueil"
    >
      <OrbitsSymbol size={size} />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg tracking-wordmark text-ecru lowercase">
          the new al-khīmist
        </span>
        {showMark && (
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gris">
            Au 79
          </span>
        )}
      </span>
    </Link>
  );
}
