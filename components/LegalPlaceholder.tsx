export default function LegalPlaceholder({
  title,
  intro,
}: {
  title: string;
  intro: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-32 pb-24">
      <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gris">Informations légales</p>
      <h1 className="font-serif text-3xl font-light tracking-brand text-ecru">{title}</h1>
      <p className="mt-6 text-sm leading-relaxed text-pierre">{intro}</p>
      <p className="mt-6 text-sm leading-relaxed text-gris">
        Ce contenu est un espace réservé en attente de la rédaction juridique
        définitive.
      </p>
    </section>
  );
}
