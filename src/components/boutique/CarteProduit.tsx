"use client";

import { Plus } from "lucide-react";
import { usePanier } from "@/lib/panier";
import { jusCouleurClaire } from "@/lib/jus-couleurs";

type Produit = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string | null;
  couleur: string;
};

export default function CarteProduit({ produit }: { produit: Produit }) {
  const { ajouter } = usePanier();
  const epuise = produit.stock <= 0;
  const claire = jusCouleurClaire.has(produit.nom);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-fond-doux shadow-sm">
      <div
        className="relative aspect-square w-full"
        style={{
          backgroundColor: produit.imageUrl ? undefined : produit.couleur,
          border: claire && !produit.imageUrl ? "1px solid #E2D9CC" : undefined,
        }}
      >
        {produit.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={produit.imageUrl} alt={produit.nom} className="h-full w-full object-cover" />
        )}
        {epuise && (
          <span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-stone-600">
            Epuise
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-semibold text-titre">{produit.nom}</h3>
        {produit.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">{produit.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-bold text-titre">
            {produit.prix.toLocaleString("fr-FR")} FCFA
          </span>
          <button
            disabled={epuise}
            onClick={() =>
              ajouter({
                id: produit.id,
                nom: produit.nom,
                prix: produit.prix,
                couleur: produit.couleur,
              })
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primaire text-white transition hover:bg-primaire-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ajouter au panier"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
