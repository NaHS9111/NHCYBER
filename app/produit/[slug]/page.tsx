import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return { title: params.slug.replace(/-/g, " ") };
}

export default function ProduitPage({ params }: { params: { slug: string } }) {
  return (
    <PagePlaceholder
      eyebrow="Fiche produit"
      title={params.slug.replace(/-/g, " ")}
      description="Cette fiche produit est en préparation. Structure prête pour l'ajout du paiement et des variantes."
    />
  );
}
