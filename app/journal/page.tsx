import type { Metadata } from "next";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes de maison — l'esprit derrière chaque gamme, documenté au fil des sorties.",
};

const ENTRIES = [
  {
    number: "00",
    title: "L'esprit de la gamme",
    body: [
      "La maison s'inspire de deux logiques que nous adaptons entièrement à notre propre langage — jamais copiées, jamais citées comme telles sur le produit.",
      "De la maroquinerie sculpturale : des objets-formes, un savoir-faire cuir visible dans la construction elle-même, un monogramme discret plutôt qu'un logo imposant.",
      "De la maison d'accessoires : l'entrée dans la maison par un petit objet accessible (foulard, bracelet), une gravure ou un poinçon constant sur toutes les catégories, et la rareté organisée plutôt que la disponibilité permanente.",
      "À notre sauce : chaque objet porte le sceau des orbites, jamais imposant, et se classe dans l'un des trois niveaux de la maison — le quotidien qui prépare, la pièce rare qui marque le cap, l'objet de consécration qui célèbre l'accomplissement.",
    ],
  },
];

export default function JournalPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-32 pb-24">
      <Reveal>
        <div className="mb-16 text-center">
          <OrbitsSymbol size={64} parallax={false} className="mx-auto mb-6" />
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">Journal</p>
          <h1 className="font-wordmark text-3xl font-semibold text-ecru sm:text-4xl">
            Le récit documenté
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-pierre">
            Le parcours du fondateur et l&rsquo;esprit derrière chaque gamme, notés au fil
            des sorties — pas du contenu marketing générique. Structure prête pour un CMS ;
            premiers récits personnels à venir.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-16">
        {ENTRIES.map((entry, i) => (
          <Reveal key={entry.number} delay={i * 0.1}>
            <article className="border-t border-charbon pt-8">
              <p className="mb-4 font-serif text-sm text-or">Note {entry.number}</p>
              <h2 className="mb-6 font-serif text-2xl text-ecru">{entry.title}</h2>
              <div className="flex flex-col gap-4">
                {entry.body.map((paragraph, j) => (
                  <p key={j} className="text-sm leading-relaxed text-pierre">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
