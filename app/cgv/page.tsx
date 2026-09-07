import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "CGV" };

export default function CGVPage() {
  return (
    <LegalPlaceholder
      title="Conditions générales de vente"
      intro="Modalités de commande, prix, paiement, livraison et rétractation."
    />
  );
}
