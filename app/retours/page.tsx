import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Politique de retour" };

export default function RetoursPage() {
  return (
    <LegalPlaceholder
      title="Politique de retour"
      intro="Délais, conditions d'éligibilité et procédure de retour des pièces rares et objets de consécration."
    />
  );
}
