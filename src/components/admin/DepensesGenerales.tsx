"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X, Receipt } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import { creerDepense, supprimerDepense } from "@/lib/actions/depenses";

type Depense = {
  id: string;
  categorie: string;
  montant: number;
  description: string;
  date: string;
};

const categories = ["Loyer", "Transport", "Marketing", "Salaire", "Emballage", "Equipement", "Autre"];
const aujourdhui = () => new Date().toISOString().slice(0, 10);

export default function DepensesGenerales({ depenses }: { depenses: Depense[] }) {
  const [pending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [categorie, setCategorie] = useState(categories[0]);
  const [montant, setMontant] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(aujourdhui());

  const total = depenses.reduce((s, d) => s + d.montant, 0);

  const champ =
    "w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20";

  const ouvrir = () => {
    setCategorie(categories[0]);
    setMontant(0);
    setDescription("");
    setDate(aujourdhui());
    setErreur("");
    setModal(true);
  };

  const enregistrer = () => {
    if (montant <= 0) {
      setErreur("Indiquez un montant superieur a zero.");
      return;
    }
    startTransition(async () => {
      await creerDepense({ categorie, montant, description, date });
      setModal(false);
    });
  };

  const supprimer = (d: Depense) => {
    if (!confirm("Supprimer cette depense ?")) return;
    startTransition(async () => {
      await supprimerDepense(d.id);
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-stone-500">
          Total <b className="text-titre">{formatFCFA(total)}</b>
        </p>
        <button
          onClick={ouvrir}
          className="inline-flex items-center gap-2 rounded-lg bg-primaire px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          <Plus size={18} />
          Nouvelle depense
        </button>
      </div>

      {depenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <Receipt size={32} className="mx-auto mb-3 text-stone-300" />
          <p className="text-sm text-stone-500">Aucune depense generale enregistree.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {depenses.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-stone-100 bg-fond-doux p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-stone-600">
                    {d.categorie}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(d.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {d.description && (
                  <p className="mt-1 truncate text-xs text-stone-500">{d.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-titre">{formatFCFA(d.montant)}</span>
                <button
                  onClick={() => supprimer(d)}
                  className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-red-500"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-titre">Nouvelle depense</h2>
              <button
                onClick={() => setModal(false)}
                className="text-stone-400 hover:text-stone-600"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {erreur && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Categorie</label>
                  <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    className={champ}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Montant</label>
                  <input
                    type="number"
                    min={0}
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    className={champ}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-titre">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={champ}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-titre">
                  Description (optionnel)
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={champ}
                  placeholder="Details de la depense"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModal(false)}
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
