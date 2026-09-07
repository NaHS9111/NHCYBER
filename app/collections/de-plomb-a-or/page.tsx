import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "De plomb à or" };

export default function DePlombAOrPage() {
  return (
    <PagePlaceholder
      eyebrow="Collection"
      title="De plomb à or"
      description="Le quotidien technique — sportswear pour la transformation de tous les jours. Fiches produit à venir."
    />
  );
}
