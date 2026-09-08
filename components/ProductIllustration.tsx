type ProductIllustrationProps = {
  slug: string;
  color: string;
  className?: string;
};

/**
 * Technical flats — the line-drawn garment/object sketches a real tech
 * pack ships with — standing in for photography until a shoot exists.
 * Deliberately spare: thin single-weight strokes, no fill, no shading.
 */
export default function ProductIllustration({ slug, color, className = "" }: ProductIllustrationProps) {
  const stroke = { stroke: color, strokeWidth: 1.4, fill: "none", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <g opacity={0.55} {...stroke}>
        {ILLUSTRATIONS[slug]?.(stroke) ?? ILLUSTRATIONS.default(stroke)}
      </g>
    </svg>
  );
}

type Stroke = { stroke: string; strokeWidth: number; fill: string };

const ILLUSTRATIONS: Record<string, (s: Stroke) => JSX.Element> = {
  "t-shirt-technique": () => (
    <path d="M70,55 L82,40 L118,40 L130,55 L162,70 L150,95 L130,84 L130,190 L70,190 L70,84 L50,95 L38,70 Z" />
  ),
  "jogger-technique": () => (
    <path d="M72,45 L128,45 L132,120 L146,195 L122,195 L102,130 L98,130 L88,195 L64,195 L68,120 Z" />
  ),
  "hoodie-technique": () => (
    <>
      <path d="M100,32 C78,32 68,50 70,62 L50,78 L62,100 L76,90 L76,195 L124,195 L124,90 L138,100 L150,78 L130,62 C132,50 122,32 100,32 Z" />
      <path d="M84,68 C84,80 116,80 116,68" />
      <path d="M85,105 L115,105 L112,145 L88,145 Z" />
      <line x1="94" y1="70" x2="90" y2="112" />
      <line x1="106" y1="70" x2="110" y2="112" />
    </>
  ),
  "overshirt-technique": () => (
    <>
      <path d="M74,50 L88,38 L100,50 L112,38 L126,50 L140,66 L128,88 L118,78 L118,192 L82,192 L82,78 L72,88 L60,66 Z" />
      <line x1="100" y1="55" x2="100" y2="188" />
      <circle cx="100" cy="80" r="1.6" />
      <circle cx="100" cy="105" r="1.6" />
      <circle cx="100" cy="130" r="1.6" />
      <path d="M84,95 L96,95 L96,115 L84,113 Z" />
    </>
  ),
  "manteau-structure": () => (
    <>
      <path d="M66,48 L86,34 L100,48 L114,34 L134,48 L150,72 L136,96 L124,84 L124,210 L76,210 L76,84 L64,96 L50,72 Z" />
      <line x1="100" y1="52" x2="100" y2="206" />
      <path d="M86,40 L100,58 L114,40" />
    </>
  ),
  "veste-architecturale": () => (
    <>
      <path d="M64,50 L90,36 L100,48 L128,40 L146,62 L132,90 L122,80 L128,200 L92,212 L84,86 L70,96 L52,72 Z" />
      <line x1="100" y1="52" x2="118" y2="196" />
    </>
  ),
  "sac-structure-signature": () => (
    <>
      <rect x="56" y="96" width="88" height="80" rx="4" />
      <path d="M74,96 C74,66 126,66 126,96" />
      <circle cx="100" cy="112" r="4" />
    </>
  ),
  "porte-cartes": () => (
    <>
      <rect x="58" y="90" width="84" height="56" rx="6" />
      <line x1="58" y1="108" x2="142" y2="108" />
      <line x1="58" y1="124" x2="142" y2="124" />
    </>
  ),
  ceinture: () => (
    <>
      <path d="M30,120 L150,120" strokeWidth={10} opacity={0.5} />
      <rect x="148" y="106" width="28" height="28" rx="3" />
      <circle cx="162" cy="120" r="3" />
    </>
  ),
  "foulard-de-soie": () => (
    <>
      <path d="M100,50 L165,150 L100,190 L35,150 Z" />
      <path d="M100,68 L150,148 L100,175 L50,148 Z" opacity={0.6} />
    </>
  ),
  "bracelet-jonc": () => <path d="M100,60 A60,60 0 1 1 46,140" />,
  "montre-automatique": () => (
    <>
      <circle cx="100" cy="120" r="38" />
      <line x1="100" y1="120" x2="100" y2="98" />
      <line x1="100" y1="120" x2="118" y2="128" />
      <rect x="90" y="66" width="20" height="16" rx="2" />
      <rect x="90" y="158" width="20" height="16" rx="2" />
    </>
  ),
  "stylo-plume": () => (
    <>
      <rect x="92" y="60" width="16" height="120" rx="8" />
      <path d="M92,180 L100,206 L108,180 Z" />
      <line x1="92" y1="96" x2="108" y2="96" />
    </>
  ),
  "pendentif-tech": () => (
    <>
      <path d="M80,50 C80,34 120,34 120,50" />
      <rect x="82" y="88" width="36" height="60" rx="3" />
    </>
  ),
  "parfum-de-seuil": () => (
    <>
      <rect x="76" y="90" width="48" height="86" rx="4" />
      <rect x="88" y="66" width="24" height="26" rx="3" />
      <line x1="100" y1="58" x2="100" y2="66" />
    </>
  ),
  default: () => <circle cx="100" cy="120" r="40" />,
};
