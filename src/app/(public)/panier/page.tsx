"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { usePanier } from "@/lib/panier";
import { passerCommande } from "@/lib/actions/commandes";

export default function PanierPage() {
  const router = useRouter();
  const { articles, changerQuantite, retirer, vider, total } = usePanier();
  const [pending, startTransition] = useTransition();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [erreur, setErreur] = useState("");

  const champ =
    "w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20";

  const commander = () => {
    if (!nom.trim() || !telephone.trim()) {
      setErreur("Votre nom et votre telephone sont obligatoires.");
      return;
    }
    setErreur("");
    startTransition(async () => {
      try {
        const res = await passerCommande({
          nom,
          telephone,
          adresse,
          articles: articles.map((a) => ({ produitId: a.id, quantite: a.quantite })),
        });
        vider();
        router.push(`/commande/${res.id}`);
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "Une erreur est survenue.");
      }
    });
  };

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShoppingBag size={40} className="mx-auto mb-4 text-stone-300" />
        <p className="text-stone-500">Votre panier est vide.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-primaire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          Voir les jus
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-titre">Votre panier</h1>

      <div className="space-y-3">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-xl border border-stone-100 bg-fond-doux p-3"
          >
            <span
              className="h-12 w-12 shrink-0 rounded-lg"
              style={{ backgroundColor: a.couleur }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-titre">{a.nom}</h3>
              <p className="text-xs text-stone-500">{a.prix.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => changerQuantite(a.id, a.quantite - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition hover:bg-white"
                aria-label="Diminuer"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium text-titre">{a.quantite}</span>
              <button
                onClick={() => changerQuantite(a.id, a.quantite + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition hover:bg-white"
                aria-label="Augmenter"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => retirer(a.id)}
              className="rounded-lg p-2 text-stone-400 transition hover:text-red-500"
              aria-label="Retirer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-bold text-titre">
        <span>Total</span>
        <span>{total.toLocaleString("fr-FR")} FCFA</span>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-titre">Vos informations</h2>

        {erreur && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-titre">Nom</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} className={champ} placeholder="Votre nom" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-titre">Telephone</label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={champ}
              placeholder="77 000 00 00"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-titre">
              Adresse de livraison (optionnel)
            </label>
            <input
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className={champ}
              placeholder="Quartier, reperes..."
            />
          </div>
        </div>

        <button
          onClick={commander}
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-primaire py-3 text-sm font-semibold text-white transition hover:bg-primaire-hover disabled:opacity-60"
        >
          {pending ? "Envoi..." : "Commander"}
        </button>
      </div>
    </div>
  );
}
