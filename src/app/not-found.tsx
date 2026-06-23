import Link from "next/link";
import { Home, FileQuestion } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fond-doux px-4 text-center">
      <Logo taille="text-3xl" />
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
        <FileQuestion size={30} className="text-primaire" />
      </div>
      <h1 className="mt-6 text-5xl font-bold text-titre">404</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        Cette page est introuvable ou a ete deplacee.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primaire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
      >
        <Home size={18} />
        {"Retour a l'accueil"}
      </Link>
    </main>
  );
}
