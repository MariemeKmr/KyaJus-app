"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { couleursJus, jusCouleurClaire } from "@/lib/jus-couleurs";
import { formatFCFA } from "@/lib/format";
import { enregistrerProduit, supprimerProduit } from "@/lib/actions/produits";
import type { ProduitFormData } from "@/lib/types";

type Produit = {
  id: string;
  nom: string;
  description: string;
  prixVente: number;
  prixRevient: number;
  stock: number;
  actif: boolean;
  imageUrl: string | null;
};

const formVide: ProduitFormData = {
  nom: "",
  description: "",
  prixVente: 0,
  prixRevient: 0,
  stock: 0,
  actif: true,
};

export default function ProduitsClient({ produits }: { produits: Produit[] }) {
  const [pending, startTransition] = useTransition();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [form, setForm] = useState<ProduitFormData>(formVide);
  const [recherche, setRecherche] = useState("");
  const [erreur, setErreur] = useState("");

  const ouvrirAjout = () => {
    setForm(formVide);
    setErreur("");
    setModalOuvert(true);
  };

  const ouvrirEdition = (p: Produit) => {
    setForm({
      id: p.id,
      nom: p.nom,
      description: p.description,
      prixVente: p.prixVente,
      prixRevient: p.prixRevient,
      stock: p.stock,
      actif: p.actif,
    });
    setErreur("");
    setModalOuvert(true);
  };

  const enregistrer = () => {
    if (!form.nom.trim()) {
      setErreur("Le nom est obligatoire.");
      return;
    }
    if (form.prixVente < 0 || form.prixRevient < 0 || form.stock < 0) {
      setErreur("Les montants ne peuvent pas etre negatifs.");
      return;
    }
    startTransition(async () => {
      await enregistrerProduit(form);
      setModalOuvert(false);
    });
  };

  const supprimer = (p: Produit) => {
    const message = p.actif
      ? `Supprimer "${p.nom}" ? S'il est lie a des commandes, il sera plutot desactive.`
      : `Supprimer "${p.nom}" ?`;
    if (!confirm(message)) return;
    startTransition(async () => {
      await supprimerProduit(p.id);
    });
  };

  const filtres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const champClasse =
    "w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-titre">Produits</h1>
          <p className="mt-1 text-sm text-stone-500">{produits.length} jus enregistres</p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primaire px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          <Plus size={18} />
          Ajouter un jus
        </button>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un jus"
          className={champClasse + " pl-9"}
        />
      </div>

      {filtres.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <Package size={32} className="mx-auto mb-3 text-stone-300" />
          <p className="text-sm text-stone-500">
            {produits.length === 0
              ? "Aucun jus pour le moment. Ajoutez votre premier jus."
              : "Aucun jus ne correspond a votre recherche."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtres.map((p) => {
            const couleur = couleursJus[p.nom] ?? "#E5E5E5";
            const claire = jusCouleurClaire.has(p.nom);
            const marge = p.prixVente - p.prixRevient;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border bg-fond-doux p-4 shadow-sm transition ${
                  p.actif ? "border-stone-100" : "border-stone-200 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.nom}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      className="h-14 w-14 shrink-0 rounded-xl"
                      style={{
                        backgroundColor: couleur,
                        border: claire ? "1px solid #E2D9CC" : "none",
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-titre">{p.nom}</h3>
                    <p className="truncate text-xs text-stone-500">
                      {p.description || "Pas de description"}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-xs">
                      <span className="font-medium text-titre">{formatFCFA(p.prixVente)}</span>
                      <span className="text-stone-400">Stock {p.stock}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-stone-200/60 pt-3">
                  <span className="text-xs text-stone-500">
                    Marge {formatFCFA(marge)}
                    {!p.actif && " . Inactif"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => ouvrirEdition(p)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-primaire"
                      aria-label="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => supprimer(p)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-red-500"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <h2 className="mb-4 text-lg font-bold text-titre">
              {form.id ? "Modifier le jus" : "Ajouter un jus"}
            </h2>

            {erreur && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-titre">Nom</label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={champClasse}
                  placeholder="Bissap"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-titre">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={champClasse}
                  placeholder="Jus d'hibiscus frais"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Prix de vente</label>
                  <input
                    type="number"
                    min={0}
                    value={form.prixVente}
                    onChange={(e) => setForm({ ...form, prixVente: Number(e.target.value) })}
                    className={champClasse}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Prix de revient</label>
                  <input
                    type="number"
                    min={0}
                    value={form.prixRevient}
                    onChange={(e) => setForm({ ...form, prixRevient: Number(e.target.value) })}
                    className={champClasse}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className={champClasse}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-titre">
                    <input
                      type="checkbox"
                      checked={form.actif}
                      onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                      className="h-4 w-4 rounded border-stone-300 text-primaire focus:ring-primaire"
                    />
                    Visible en boutique
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOuvert(false)}
                className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                onClick={enregistrer}
                disabled={pending}
                className="flex-1 rounded-lg bg-primaire py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover disabled:opacity-60"
              >
                {pending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
