import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Les objets de consécration" };

export default function ObjetsDeConsecrationPage() {
  return (
    <PagePlaceholder
      eyebrow="Collection"
      title="Les objets de consécration"
      description="Montre, stylo, objet — gravés du symbole, offerts après un accomplissement. Fiches produit à venir."
    />
  );
}
