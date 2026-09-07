export type SpecRow = { label: string; value: string };

export type Category = {
  slug: string;
  label: string;
  eyebrow: string;
  tagline: string;
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
  image: string;
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_fe9aa245-ae25-41d5-95fe-eab8cb52bd5a.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_049adf4d-c487-4b40-b026-7125dcd265ec.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_990e6ea4-350a-4417-bf0e-2ac7477adf86.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_4a8eda55-cd9b-4c38-b913-b468bf45a241.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_1c595b5c-2dc4-48e1-be8d-004414305104.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_e35bbe4a-8230-4c2d-acda-d02c7ecdf6c3.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_edbdad77-4578-40db-ba6e-eca2a14c216f.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_7c259eff-9d17-4a50-bfb6-60b9fe46e232.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_8d4dafeb-3444-4ee0-8397-eccff8f302fe.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_d5fd2dbf-1253-422b-8efb-5e48c0e841d0.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_3de68a29-1dac-4df1-85c3-ccded1ed84e1.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185111_5551a035-0998-4904-b3da-022c2373e43a.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185158_f5dc3a70-ddee-403e-903c-5c7c893a93e6.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185158_03a28d71-af5c-4b38-95c1-1be8ac7a5ad7.png",
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
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_185158_f8c22866-a43f-410e-b49c-eb807b17eccf.png",
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
