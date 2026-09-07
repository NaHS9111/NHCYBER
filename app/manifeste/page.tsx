import type { Metadata } from "next";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Manifeste",
  description:
    "La conviction fondatrice de the new al-khīmist : la transformation de soi ne se reçoit pas, elle se forge.",
};

export default function ManifestePage() {
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
      <Reveal>
        <OrbitsSymbol size={72} className="mb-10" />
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mb-8 text-xs uppercase tracking-[0.4em] text-gris">Manifeste</p>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="font-serif text-xl italic leading-relaxed text-or sm:text-2xl">
          Il existe une conviction plus ancienne que n&rsquo;importe quel vêtement que la
          maison créera jamais&nbsp;: que la transformation de soi ne se reçoit pas, elle se
          forge.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mt-8 text-base leading-relaxed text-pierre">
          Nous ne sommes pas une maison qui vend des produits à des gens qui veulent
          changer — nous sommes une maison née de cette conviction, et tout ce que nous
          créons n&rsquo;est qu&rsquo;une manière différente de la dire.
        </p>
      </Reveal>
    </section>
  );
}
