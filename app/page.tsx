"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import GoldParticles from "@/components/GoldParticles";
import Reveal from "@/components/Reveal";

const COLLECTIONS = [
  {
    href: "/collections/realiser-limpossible",
    title: "Réaliser l'impossible",
    description:
      "La pièce rare, statement, réservée au jour du cap décisif.",
    tint: "text-pierre",
  },
  {
    href: "/collections/de-plomb-a-or",
    title: "De plomb à or",
    description: "Le quotidien technique — sportswear pour la transformation de tous les jours.",
    tint: "text-ecru",
  },
  {
    href: "/collections/objets-de-consecration",
    title: "Les objets de consécration",
    description:
      "Montre, stylo, objet — gravés du symbole, offerts après un accomplissement.",
    tint: "text-pierre",
  },
];

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onFinish={() => setLoaded(true)} />

      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <GoldParticles />

        <div className="relative z-10 flex flex-col items-center">
          <OrbitsSymbol size={140} className="mb-10" />

          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gris">
            les nouveaux alchimistes — الخيميائيون الجدد
          </p>

          <h1 className="font-serif text-4xl font-light tracking-wordmark text-ecru sm:text-6xl">
            the new al-khīmist
          </h1>

          <p className="mt-6 font-serif text-xl italic text-or sm:text-2xl">
            de plomb à or
          </p>

          <p className="mx-auto mt-8 max-w-xl text-balance text-sm leading-relaxed text-pierre sm:text-base">
            Une maison de seuil. On ne la porte pas au quotidien — on l&rsquo;invoque,
            au moment précis où il faut basculer.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/manifeste"
              className="border border-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-or transition-colors duration-300 hover:bg-or hover:text-noir"
            >
              Lire le manifeste
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 text-xs uppercase tracking-[0.25em] text-pierre transition-colors duration-300 hover:text-or"
            >
              Rejoindre la liste d&rsquo;attente
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-or/60"
          aria-hidden="true"
        />
      </section>

      <section className="relative border-t border-charbon px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="mb-16 text-center font-serif text-2xl font-light tracking-brand text-ecru sm:text-3xl">
              Trois gammes fondatrices
            </h2>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLLECTIONS.map((collection, i) => (
              <Reveal key={collection.href} delay={i * 0.12}>
                <Link
                  href={collection.href}
                  className="group flex h-full flex-col gap-4 border border-charbon p-8 transition-colors duration-500 hover:border-or/60"
                >
                  <OrbitsSymbol size={44} animated={false} parallax={false} hoverOrbit />

                  <h3 className={`font-serif text-lg ${collection.tint}`}>
                    {collection.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gris">
                    {collection.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
