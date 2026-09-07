import type { Metadata } from "next";
import Link from "next/link";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import ProductPlate from "@/components/ProductPlate";
import Reveal from "@/components/Reveal";
import { CATEGORIES, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <section className="px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <OrbitsSymbol size={64} parallax={false} className="mx-auto mb-6" />
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">Collections</p>
            <h1 className="font-wordmark text-3xl font-semibold text-ecru sm:text-4xl">
              Les cinq familles de la maison
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-pierre">
              Chaque objet porte le sceau des orbites, jamais imposant, et se classe dans
              l&rsquo;un des trois niveaux de la maison — le quotidien qui prépare, la pièce
              rare qui marque le cap, l&rsquo;objet de consécration qui célèbre
              l&rsquo;accomplissement.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2">
          {CATEGORIES.map((category, i) => {
            const cover = getProductsByCategory(category.slug)[0];
            return (
              <Reveal key={category.slug} delay={i * 0.08}>
                <Link
                  href={`/collections/${category.slug}`}
                  className="group flex h-full flex-col border border-charbon transition-colors duration-500 hover:border-or/60 sm:flex-row"
                >
                  {cover && (
                    <div className="aspect-[4/5] w-full overflow-hidden bg-charbon sm:w-2/5">
                      <ProductPlate
                        product={cover}
                        animated={false}
                        className="transition-transform duration-700 ease-alchemy group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-gris">
                      {category.eyebrow}
                    </p>
                    <h2 className="font-serif text-xl text-ecru">{category.label}</h2>
                    <p className="text-sm leading-relaxed text-pierre">{category.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
