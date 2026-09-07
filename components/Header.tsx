"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/manifeste", label: "Manifeste" },
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Liste d'attente" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Logo symbolSize={44} />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-[0.15em] transition-colors duration-300 hover:text-or ${
                  active ? "text-or" : "text-pierre"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <span className="h-px w-6 bg-ecru" />
          <span className="h-px w-6 bg-ecru" />
        </button>
      </div>

      {open && (
        <nav className="mx-6 flex flex-col gap-5 border-t border-charbon bg-noir px-4 py-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.15em] text-pierre hover:text-or"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
