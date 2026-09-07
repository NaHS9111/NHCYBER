import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <PagePlaceholder
      eyebrow="Journal"
      title="Le récit fondateur"
      description="Le parcours documenté du fondateur — pas du contenu marketing. Structure prête pour l'intégration d'un CMS. Premiers récits à venir."
    />
  );
}
