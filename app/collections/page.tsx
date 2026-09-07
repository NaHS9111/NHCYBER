import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <PagePlaceholder
      eyebrow="Collections"
      title="Les trois gammes fondatrices"
      description="La pièce « Réaliser l'impossible », le quotidien technique « De plomb à or », et les objets de consécration. Le catalogue complet arrive bientôt."
    />
  );
}
