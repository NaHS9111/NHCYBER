import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/retours", label: "Retours" },
];

export default function Footer() {
  return (
    <footer className="border-t border-charbon">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-xs text-gris sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="tracking-brand">
          © {new Date().getFullYear()} the new al-khīmist — les nouveaux alchimistes
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-or">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
