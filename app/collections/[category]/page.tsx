import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import Reveal from "@/components/Reveal";
import { CATEGORIES, getCategory, getProductsByCategory } from "@/lib/products";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategory(params.category);
  return { title: category?.label ?? params.category.replace(/-/g, " ") };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <section className="px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <OrbitsSymbol size={64} parallax={false} className="mx-auto mb-6" />
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">
              {category.eyebrow}
            </p>
            <h1 className="font-wordmark text-3xl font-semibold text-ecru sm:text-4xl">
              {category.label}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-pierre">{category.tagline}</p>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                href={`/produit/${product.slug}`}
                className="group flex h-full flex-col border border-charbon transition-colors duration-500 hover:border-or/60"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-charbon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-alchemy group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full border border-charbon"
                        style={{ backgroundColor: product.swatch }}
                        aria-hidden="true"
                      />
                      <span className="text-xs uppercase tracking-[0.15em] text-gris">
                        {product.coloris}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gris/70">
                      {product.ref}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg text-ecru">{product.name}</h2>
                  <p className="mt-auto text-xs leading-relaxed text-gris">{product.rarity}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-6 text-center">
            <p className="text-sm leading-relaxed text-pierre">
              Rareté organisée, pas de disponibilité permanente. Rejoignez la{" "}
              <Link href="/contact" className="text-or hover:underline">
                liste d&rsquo;attente
              </Link>{" "}
              pour être averti&middot;e à l&rsquo;ouverture.
            </p>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-[0.25em] text-pierre hover:text-or"
            >
              ← Toutes les gammes
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
