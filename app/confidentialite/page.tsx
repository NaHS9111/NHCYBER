import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <LegalPlaceholder
      title="Politique de confidentialité"
      intro="Données collectées (dont la liste d'attente), finalités, durée de conservation et droits RGPD."
    />
  );
}
