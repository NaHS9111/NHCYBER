import type { Metadata } from "next";
import Link from "next/link";
import PagePlaceholder from "@/components/PagePlaceholder";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import WaitlistForm from "@/components/WaitlistForm";
import { getProduct } from "@/lib/products";

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

  return (
    <section className="px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div className="aspect-[4/5] w-full overflow-hidden bg-charbon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={`${product.name} — ${product.placement}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">
            De plomb à or
          </p>
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
              {product.colorway}
            </span>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-pierre">
            {product.description}
          </p>

          <div className="mt-8 flex items-start gap-4 border-t border-charbon pt-6">
            <OrbitsSymbol size={40} animated={false} parallax={false} />
            <dl className="text-sm">
              <div className="flex gap-2">
                <dt className="text-gris">Signe&nbsp;:</dt>
                <dd className="text-ecru">{product.markVariant}</dd>
              </div>
              <div className="mt-1 flex gap-2">
                <dt className="text-gris">Emplacement&nbsp;:</dt>
                <dd className="text-ecru">{product.placement}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gris">
            Édition limitée — pas de vente permanente
          </p>
          <div className="mt-4">
            <WaitlistForm />
          </div>

          <Link
            href="/collections/de-plomb-a-or"
            className="mt-8 text-xs uppercase tracking-[0.25em] text-pierre hover:text-or"
          >
            ← Retour à la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
