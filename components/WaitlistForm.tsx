"use client";

import { useState, type FormEvent } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: brancher sur une route API (ex. /api/waitlist) une fois le
    // fournisseur d'e-mail décidé.
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <p className="font-serif text-lg italic text-or">
        Merci. Vous serez prévenu&middot;e au moment venu.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col items-center gap-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="votre e-mail"
        aria-label="Adresse e-mail"
        className="w-full border border-charbon bg-transparent px-4 py-3 text-center text-sm text-ecru placeholder:text-gris focus:border-or focus:outline-none"
      />
      {status === "error" && (
        <p className="text-xs text-pierre">Adresse e-mail invalide.</p>
      )}
      <button
        type="submit"
        className="w-full border border-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-or transition-colors duration-300 hover:bg-or hover:text-noir"
      >
        Rejoindre la liste d&rsquo;attente
      </button>
    </form>
  );
}
