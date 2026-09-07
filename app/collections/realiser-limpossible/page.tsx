import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Réaliser l'impossible" };

export default function RealiserLimpossiblePage() {
  return (
    <PagePlaceholder
      eyebrow="Collection"
      title="Réaliser l'impossible"
      description="La pièce rare, statement — réservée au jour du cap décisif. Fiches produit à venir."
    />
  );
}
