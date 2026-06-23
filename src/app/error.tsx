"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";
import Logo from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fond-doux px-4 text-center">
      <Logo taille="text-3xl" />
      <h1 className="mt-8 text-2xl font-bold text-titre">Une erreur est survenue</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        Quelque chose a mal tourne. Vous pouvez reessayer ou revenir a la page principale.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primaire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          <RefreshCw size={18} />
          Reessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
        >
          <Home size={18} />
          {"Retour a l'accueil"}
        </Link>
      </div>
    </main>
  );
}
