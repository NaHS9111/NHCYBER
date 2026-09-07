export type Product = {
  slug: string;
  name: string;
  colorway: string;
  swatch: string;
  markVariant: string;
  placement: string;
  description: string;
  image: string;
};

/**
 * "De plomb à or" — gamme quotidien technique. Chaque coloris décline la
 * même paire veste légère / short technique, mais ni le signe brodé ni
 * son emplacement ne se répètent d'une pièce à l'autre.
 */
export const DE_PLOMB_A_OR_PRODUCTS: Product[] = [
  {
    slug: "veste-technique-sable",
    name: "Veste technique — Sable",
    colorway: "Sable",
    swatch: "#C9BDA4",
    markVariant: "Symbole complet des orbites",
    placement: "Brodé centré, poitrine",
    description:
      "Veste zippée à capuche en matière technique légère, coloris sable chaud. Le symbole des trois orbites est brodé fil or antique, centré sur la poitrine.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_cd66d79c-7ef5-44f6-a9fe-6df6fdd941fa.png",
  },
  {
    slug: "veste-technique-charbon",
    name: "Veste technique — Charbon",
    colorway: "Charbon",
    swatch: "#2B2B2B",
    markVariant: "Symbole complet des orbites",
    placement: "Brodé épaule gauche",
    description:
      "Même coupe zippée à capuche, coloris charbon profond. Le symbole se déplace à l'épaule gauche — un repère plus discret pour un coloris plus sombre.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_a2658c2e-9ded-42ee-af58-be87bd2fce37.png",
  },
  {
    slug: "veste-legere-sauge",
    name: "Veste légère — Sauge",
    colorway: "Sauge pastel",
    swatch: "#B9C4AC",
    markVariant: "Monogramme « Au »",
    placement: "Brodé poitrine gauche",
    description:
      "Coloris pastel sauge. Le signe change de nature ici : plus de symbole d'orbites, mais le monogramme « Au » brodé, comme une étiquette d'élément.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_940cae7f-3516-47a5-a93e-2f134d943586.png",
  },
  {
    slug: "short-technique-bleu-poudre",
    name: "Short technique — Bleu poudré",
    colorway: "Bleu poudré pastel",
    swatch: "#B7C6D6",
    markVariant: "Symbole complet des orbites",
    placement: "Brodé ourlet, jambe droite",
    description:
      "Short technique coloris bleu poudré. Le symbole des orbites, agrandi, se porte cette fois à l'ourlet de la jambe droite plutôt que sur le haut.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_3c34a89d-4689-4a05-8262-93ab57733356.png",
  },
  {
    slug: "veste-legere-rose-poudre",
    name: "Veste légère — Rose poudré",
    colorway: "Rose poudré pastel",
    swatch: "#DCC0C3",
    markVariant: "Noyau seul",
    placement: "Brodé poignet",
    description:
      "Coloris pastel rose poudré. Version la plus épurée du signe : seul le point doré du noyau, sans les orbites, brodé au poignet.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_85e20dac-f946-4f1c-ad0b-aac0e56cc3b8.png",
  },
  {
    slug: "ensemble-technique-ecru",
    name: "Ensemble technique — Écru",
    colorway: "Écru",
    swatch: "#F2EDE3",
    markVariant: "Symbole complet des orbites",
    placement: "Brodé nuque / haut du dos",
    description:
      "Ensemble veste et short coloris écru. Le symbole migre au dos, sous la nuque — signature discrète qui ne se révèle qu'au mouvement.",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3HilQQULSm6zADcVs21TPiaVhE0/hf_20260907_182132_674ab984-b0fc-42ee-b849-7f629776a3ba.png",
  },
];

export function getProduct(slug: string): Product | undefined {
  return DE_PLOMB_A_OR_PRODUCTS.find((p) => p.slug === slug);
}
