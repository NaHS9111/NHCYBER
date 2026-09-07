import type { Metadata } from "next";
import OrbitsSymbol from "@/components/OrbitsSymbol";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = { title: "Liste d'attente" };

export default function ContactPage() {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-6 pt-32 text-center">
      <OrbitsSymbol size={72} parallax={false} />
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">Liste d&rsquo;attente</p>
        <h1 className="font-serif text-3xl font-light tracking-brand text-ecru sm:text-4xl">
          La maison est rare
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-pierre">
          Il n&rsquo;y a pas de vente permanente. Laissez votre e-mail — vous serez
          prévenu&middot;e à l&rsquo;ouverture des prochaines gammes.
        </p>
      </div>
      <WaitlistForm />
    </section>
  );
}
