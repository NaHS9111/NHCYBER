import type { Metadata } from "next";
import Link from "next/link";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import Reveal from "@/components/Reveal";
import { DE_PLOMB_A_OR_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = { title: "De plomb à or" };

export default function DePlombAOrPage() {
  return (
    <section className="px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <OrbitsSymbol size={64} parallax={false} className="mx-auto mb-6" />
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">Collection</p>
            <h1 className="font-wordmark text-3xl font-semibold text-ecru sm:text-4xl">
              De plomb à or
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-pierre">
              Le quotidien technique. Même paire veste légère / short d&rsquo;un
              coloris à l&rsquo;autre — mais jamais le même signe, ni le même
              emplacement.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DE_PLOMB_A_OR_PRODUCTS.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                href={`/produit/${product.slug}`}
                className="group flex h-full flex-col border border-charbon transition-colors duration-500 hover:border-or/60"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-charbon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={`${product.name} — ${product.placement}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-alchemy group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full border border-charbon"
                      style={{ backgroundColor: product.swatch }}
                      aria-hidden="true"
                    />
                    <span className="text-xs uppercase tracking-[0.15em] text-gris">
                      {product.colorway}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg text-ecru">{product.name}</h2>
                  <p className="mt-auto text-xs leading-relaxed text-gris">
                    {product.markVariant} — {product.placement}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-16 max-w-md text-center text-sm leading-relaxed text-pierre">
            Édition limitée, pas de réassort systématique. Rejoignez la{" "}
            <Link href="/contact" className="text-or hover:underline">
              liste d&rsquo;attente
            </Link>{" "}
            pour être averti&middot;e à l&rsquo;ouverture.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
