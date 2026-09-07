import type { Metadata } from "next";
import Link from "next/link";
import PagePlaceholder from "@/components/PagePlaceholder";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import WaitlistForm from "@/components/WaitlistForm";
import { getCategory, getProduct, PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getProduct(params.slug);
  return { title: product?.name ?? params.slug.replace(/-/g, " ") };
}

export default function ProduitPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  if (!product) {
    return (
      <PagePlaceholder
        eyebrow="Fiche produit"
        title={params.slug.replace(/-/g, " ")}
        description="Cette fiche produit est en préparation. Structure prête pour l'ajout du paiement et des variantes."
      />
    );
  }

  const category = getCategory(product.category);

  return (
    <section className="px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div className="aspect-[4/5] w-full overflow-hidden bg-charbon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.4em] text-gris">
              {category?.label ?? product.category}
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gris/70">
              {product.ref}
            </span>
          </div>
          <h1 className="font-wordmark text-3xl font-semibold text-ecru sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full border border-charbon"
              style={{ backgroundColor: product.swatch }}
              aria-hidden="true"
            />
            <span className="text-xs uppercase tracking-[0.15em] text-pierre">
              {product.coloris}
            </span>
          </div>

          <div className="mt-8 flex items-start gap-4 border-t border-charbon pt-6">
            <OrbitsSymbol size={40} animated={false} parallax={false} />
            <dl className="w-full text-sm">
              {product.specs.map((spec) => (
                <div key={spec.label} className="mt-1 flex gap-2 first:mt-0">
                  <dt className="shrink-0 text-gris">{spec.label}&nbsp;:</dt>
                  <dd className="text-ecru">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gris">
            {product.rarity}
          </p>
          <div className="mt-4">
            <WaitlistForm />
          </div>

          <Link
            href={`/collections/${product.category}`}
            className="mt-8 text-xs uppercase tracking-[0.25em] text-pierre hover:text-or"
          >
            ← Retour à la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
