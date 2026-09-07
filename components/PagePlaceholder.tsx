import Link from "next/link";
import OrbitsSymbol from "./OrbitsSymbol";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PagePlaceholder({
  eyebrow,
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-32 text-center">
      <OrbitsSymbol size={72} animated parallax={false} className="mb-8" />
      <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">{eyebrow}</p>
      <h1 className="font-serif text-3xl font-light tracking-brand text-ecru sm:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-pierre">
        {description}
      </p>
      <Link
        href="/"
        className="mt-10 border border-charbon px-8 py-3 text-xs uppercase tracking-[0.25em] text-pierre transition-colors duration-300 hover:border-or hover:text-or"
      >
        Retour à l&rsquo;accueil
      </Link>
    </section>
  );
}
