import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalPlaceholder
      title="Mentions légales"
      intro="Éditeur du site, hébergement, directeur de la publication, propriété intellectuelle."
    />
  );
}
