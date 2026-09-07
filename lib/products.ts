export type SpecRow = { label: string; value: string };

export type Category = {
  slug: string;
  label: string;
  eyebrow: string;
  tagline: string;
};

export type PlateMark = "orbit" | "lockup" | "arabic" | "none";

export type Plate = {
  mark: PlateMark;
  /** Position as a percentage of the plate, matching the tech pack's real branding spot. */
  top: string;
  left: string;
  scale: number;
  rotate: number;
};

export type Product = {
  slug: string;
  ref: string;
  category: string;
  name: string;
  coloris: string;
  swatch: string;
  rarity: string;
  specs: SpecRow[];
  plate: Plate;
};

export const CATEGORIES: Category[] = [
  {
    slug: "de-plomb-a-or",
    label: "De plomb à or",
    eyebrow: "Prêt-à-porter",
    tagline:
      "Le quotidien technique — porté tous les jours, pendant la préparation du cap.",
  },
  {
    slug: "realiser-limpossible",
    label: "Réaliser l'impossible",
    eyebrow: "Pièce rare",
    tagline:
      "Édition très limitée, jamais réassortie à l'identique. Portée pour un cap précis.",
  },
  {
    slug: "maroquinerie",
    label: "Maroquinerie",
    eyebrow: "Cuir",
    tagline:
      "La transition vers l'objet sculptural — savoir-faire cuir, monogramme discret, hardware gravé.",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    eyebrow: "Entrée dans la maison",
    tagline:
      "Le point d'entrée le plus accessible dans la maison — porté au quotidien, sans jamais être anodin.",
  },
  {
    slug: "objets-de-consecration",
    label: "Les objets de consécration",
    eyebrow: "Sur commande",
    tagline:
      "Jamais en vente libre. Offerts ou acquis uniquement au moment où un cap réel vient d'être franchi.",
  },
];

const NOIR = "#0D0D0D";
const CHARBON = "#2B2B2B";
const ECRU = "#F2EDE3";
const PIERRE = "#C9BDA4";
const OR = "#B8934A";

export const PRODUCTS: Product[] = [
  // Prêt-à-porter — de plomb à or
  {
    slug: "t-shirt-technique",
    ref: "RTW-Q01",
    category: "de-plomb-a-or",
    name: "T-shirt technique",
    coloris: "Noir profond, charbon, écru",
    swatch: NOIR,
    rarity: "Permanent — réassort continu",
    specs: [
      { label: "Matière", value: "92% coton peigné mercerisé, 8% élasthanne — grammage 180g/m²" },
      { label: "Construction", value: "Coutures rabattues, col côtelé auto-régénérant" },
      { label: "Branding", value: "Sceau brodé ton sur ton, 3cm, poitrine gauche" },
      { label: "Coloris", value: "Noir profond, charbon, écru" },
      { label: "Rareté", value: "Permanent — réassort continu" },
    ],
    plate: { mark: "orbit", top: "38%", left: "42%", scale: 0.5, rotate: -6 },
  },
  {
    slug: "jogger-technique",
    ref: "RTW-Q02",
    category: "de-plomb-a-or",
    name: "Jogger technique",
    coloris: "Charbon, pierre",
    swatch: CHARBON,
    rarity: "Permanent — réassort continu",
    specs: [
      { label: "Matière", value: "Molleton technique gratté intérieur, mélange coton/polyester recyclé" },
      { label: "Construction", value: "Taille élastique cordon plat, poches zippées, ourlets zippés chevilles" },
      { label: "Branding", value: "Sceau tissé ton sur ton, poche cuisse gauche" },
      { label: "Coloris", value: "Charbon, pierre" },
      { label: "Rareté", value: "Permanent — réassort continu" },
    ],
    plate: { mark: "orbit", top: "68%", left: "38%", scale: 0.5, rotate: 4 },
  },
  {
    slug: "hoodie-technique",
    ref: "RTW-Q03",
    category: "de-plomb-a-or",
    name: "Hoodie technique",
    coloris: "Noir profond, charbon",
    swatch: NOIR,
    rarity: "Permanent — réassort continu",
    specs: [
      { label: "Matière", value: "Molleton lourd 420g/m², intérieur brossé" },
      { label: "Construction", value: "Capuche doublée, cordons embouts métal gravés, poche kangourou renforcée" },
      { label: "Branding", value: "Sceau brodé 4cm poitrine, étiquette tissée intérieure nuque" },
      { label: "Coloris", value: "Noir profond, charbon" },
      { label: "Rareté", value: "Permanent — réassort continu" },
    ],
    plate: { mark: "orbit", top: "42%", left: "50%", scale: 0.75, rotate: 0 },
  },
  {
    slug: "overshirt-technique",
    ref: "RTW-Q04",
    category: "de-plomb-a-or",
    name: "Overshirt technique",
    coloris: "Pierre, écru",
    swatch: PIERRE,
    rarity: "Saisonnière — 2 sorties par an",
    specs: [
      { label: "Matière", value: "Coton ripstop enduit déperlant" },
      { label: "Construction", value: "Poches plaquées à rabat, boutonnage corne mate" },
      { label: "Branding", value: "Sceau gravé sur bouton du haut" },
      { label: "Coloris", value: "Pierre, écru" },
      { label: "Rareté", value: "Saisonnière — 2 sorties par an" },
    ],
    plate: { mark: "orbit", top: "22%", left: "50%", scale: 0.35, rotate: 0 },
  },

  // Pièce rare — Réaliser l'impossible
  {
    slug: "manteau-structure",
    ref: "RARE-01",
    category: "realiser-limpossible",
    name: "Manteau structuré",
    coloris: "Noir profond uniquement",
    swatch: NOIR,
    rarity: "150 exemplaires numérotés par sortie, 1 sortie par an",
    specs: [
      { label: "Matière", value: "Laine technique 90%, cachemire 10%, doublure bemberg" },
      { label: "Construction", value: "Épaule structurée, col officier, fermeture zip + boutons cornes invisibles" },
      { label: "Branding", value: "Sceau gravé sur bouton unique intérieur, aucune marque visible extérieure" },
      { label: "Coloris", value: "Noir profond uniquement" },
      { label: "Rareté", value: "150 exemplaires numérotés par sortie, 1 sortie par an" },
    ],
    plate: { mark: "none", top: "50%", left: "50%", scale: 1, rotate: 0 },
  },
  {
    slug: "veste-architecturale",
    ref: "RARE-02",
    category: "realiser-limpossible",
    name: "Veste architecturale",
    coloris: "Charbon",
    swatch: CHARBON,
    rarity: "80 exemplaires numérotés, édition unique",
    specs: [
      { label: "Matière", value: "Laine mélangée technique, empiècements cuir pleine fleur" },
      { label: "Construction", value: "Silhouette asymétrique, doublure imprimée motif orbites en interne uniquement" },
      { label: "Branding", value: "Étiquette cuir gaufrée ton sur ton, col intérieur, numérotée à la main" },
      { label: "Coloris", value: "Charbon" },
      { label: "Rareté", value: "80 exemplaires numérotés, édition unique" },
    ],
    plate: { mark: "none", top: "50%", left: "50%", scale: 1, rotate: 0 },
  },

  // Maroquinerie
  {
    slug: "sac-structure-signature",
    ref: "MAR-01",
    category: "maroquinerie",
    name: "Sac structuré signature",
    coloris: "Noir profond, pierre, écru",
    swatch: NOIR,
    rarity: "Permanent, production limitée mensuelle",
    specs: [
      { label: "Matière", value: "Cuir pleine fleur tannage végétal, intérieur suédine" },
      { label: "Construction", value: "Forme géométrique rigide, poignée sellier cousue main, bandoulière amovible" },
      { label: "Quincaillerie", value: "Fermoir laiton brossé gravé du sceau, coutures sellier apparentes ton sur ton" },
      { label: "Coloris", value: "Noir profond, pierre, écru" },
      { label: "Rareté", value: "Permanent, production limitée mensuelle" },
    ],
    plate: { mark: "orbit", top: "35%", left: "50%", scale: 0.6, rotate: 0 },
  },
  {
    slug: "porte-cartes",
    ref: "MAR-02",
    category: "maroquinerie",
    name: "Porte-cartes",
    coloris: "Noir profond, charbon, pierre",
    swatch: NOIR,
    rarity: "Permanent",
    specs: [
      { label: "Matière", value: "Cuir pleine fleur tannage végétal" },
      { label: "Construction", value: "4 emplacements carte, poche centrale plate, point sellier" },
      { label: "Quincaillerie", value: "Sceau gravé à chaud, coin inférieur droit" },
      { label: "Coloris", value: "Noir profond, charbon, pierre" },
      { label: "Rareté", value: "Permanent" },
    ],
    plate: { mark: "orbit", top: "78%", left: "78%", scale: 0.35, rotate: 0 },
  },
  {
    slug: "ceinture",
    ref: "MAR-03",
    category: "maroquinerie",
    name: "Ceinture",
    coloris: "Noir profond, charbon",
    swatch: NOIR,
    rarity: "Permanent",
    specs: [
      { label: "Matière", value: "Cuir pleine fleur, boucle laiton massif" },
      { label: "Construction", value: "Largeur 3,5cm, passant cousu main" },
      { label: "Quincaillerie", value: "Boucle gravée du symbole des orbites, finition brossée" },
      { label: "Coloris", value: "Noir profond, charbon" },
      { label: "Rareté", value: "Permanent" },
    ],
    plate: { mark: "orbit", top: "50%", left: "50%", scale: 0.7, rotate: 0 },
  },

  // Accessoires
  {
    slug: "foulard-de-soie",
    ref: "ACC-01",
    category: "accessoires",
    name: "Foulard de soie",
    coloris: "Noir/or, écru/or, pierre/charbon",
    swatch: OR,
    rarity: "Permanent, 3 motifs tournants par an",
    specs: [
      { label: "Matière", value: "Soie twill 100%, 90x90cm" },
      { label: "Construction", value: "Ourlet roulotté main" },
      { label: "Motif", value: "Symbole des orbites décliné en motif continu, imprimé all-over ton sur ton ou contrasté" },
      { label: "Coloris", value: "Noir/or, écru/or, pierre/charbon" },
      { label: "Rareté", value: "Permanent, 3 motifs tournants par an" },
    ],
    plate: { mark: "arabic", top: "50%", left: "50%", scale: 1.3, rotate: 0 },
  },
  {
    slug: "bracelet-jonc",
    ref: "ACC-02",
    category: "accessoires",
    name: "Bracelet jonc",
    coloris: "Or antique uniquement",
    swatch: OR,
    rarity: "Permanent",
    specs: [
      { label: "Matière", value: "Laiton massif plaqué or 18 carats, 3 microns" },
      { label: "Construction", value: "Jonc rigide ouvert, fermeture par pression" },
      { label: "Quincaillerie", value: "Symbole des orbites gravé en creux sur la face externe" },
      { label: "Coloris", value: "Or antique uniquement" },
      { label: "Rareté", value: "Permanent" },
    ],
    plate: { mark: "arabic", top: "48%", left: "56%", scale: 0.85, rotate: -12 },
  },

  // Les objets de consécration
  {
    slug: "montre-automatique",
    ref: "CONS-01",
    category: "objets-de-consecration",
    name: "Montre automatique",
    coloris: "Acier gunmetal / cadran noir",
    swatch: CHARBON,
    rarity: "Sur commande uniquement, non catalogué",
    specs: [
      { label: "Boîtier", value: "Acier brossé gunmetal, 40mm, verre saphir" },
      { label: "Cadran", value: "Noir profond, sceau des orbites gravé au centre, index appliqués or" },
      { label: "Mouvement", value: "Automatique, réserve de marche 42h" },
      { label: "Gravure", value: "Numéro de série + date du cap gravés au dos, sur demande" },
      { label: "Rareté", value: "Sur commande uniquement, non catalogué" },
    ],
    plate: { mark: "orbit", top: "50%", left: "50%", scale: 0.55, rotate: 0 },
  },
  {
    slug: "stylo-plume",
    ref: "CONS-02",
    category: "objets-de-consecration",
    name: "Stylo plume",
    coloris: "Laiton noir mat / capuchon or antique",
    swatch: OR,
    rarity: "Sur commande uniquement, non catalogué",
    specs: [
      { label: "Corps", value: "Laiton brossé noir mat, capuchon or antique" },
      { label: "Plume", value: "Acier inoxydable finition or, taille M" },
      { label: "Gravure", value: "Sceau gravé sur le capuchon, initiales sur demande sur le corps" },
      { label: "Rareté", value: "Sur commande uniquement, non catalogué" },
    ],
    plate: { mark: "orbit", top: "20%", left: "50%", scale: 0.4, rotate: 0 },
  },
  {
    slug: "pendentif-tech",
    ref: "CONS-03",
    category: "objets-de-consecration",
    name: "Pendentif tech",
    coloris: "Titane brossé / gravure or",
    swatch: OR,
    rarity: "Sur commande uniquement, non catalogué",
    specs: [
      { label: "Corps", value: "Titane brossé, forme barrette rectangulaire" },
      { label: "Gravure", value: "« Au / 79 » et symbole des orbites gravés en or, chaîne maille gourmette plaquée or" },
      { label: "Fonction", value: "Clé USB haute capacité intégrée — pour archiver le récit du cap franchi" },
      { label: "Rareté", value: "Sur commande uniquement, non catalogué" },
    ],
    plate: { mark: "lockup", top: "50%", left: "50%", scale: 0.9, rotate: 0 },
  },
  {
    slug: "parfum-de-seuil",
    ref: "CONS-04",
    category: "objets-de-consecration",
    name: "Parfum de seuil",
    coloris: "Verre dépoli noir / capsule laiton",
    swatch: NOIR,
    rarity: "Édition très limitée, une seule composition à la fois",
    specs: [
      { label: "Composition", value: "Fragrance originale exclusive, développée en maison — jamais un mélange de marques tierces" },
      { label: "Flacon", value: "Verre dépoli noir, capsule laiton gravée du sceau" },
      { label: "Contenance", value: "50ml, non rechargeable — pensé pour durer le temps d'un seuil, pas d'une routine" },
      { label: "Rareté", value: "Édition très limitée, une seule composition à la fois" },
    ],
    plate: { mark: "orbit", top: "18%", left: "50%", scale: 0.4, rotate: 0 },
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
