"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X, FlaskConical } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import { creerLot, supprimerLot } from "@/lib/actions/lots";
import type { LigneLotInput } from "@/lib/types";

type Produit = { id: string; nom: string };

type Lot = {
  id: string;
  produitNom: string;
  reference: string;
  date: string;
  bouteillesProduites: number;
  total: number;
  lignes: { libelle: string; montant: number }[];
};

const aujourdhui = () => new Date().toISOString().slice(0, 10);

export default function LotsProduction({
  produits,
  lots,
}: {
  produits: Produit[];
  lots: Lot[];
}) {
  const [pending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [produitId, setProduitId] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(aujourdhui());
  const [bouteilles, setBouteilles] = useState(0);
  const [lignes, setLignes] = useState<LigneLotInput[]>([{ libelle: "", montant: 0 }]);

  const total = lignes.reduce((s, l) => s + (Number(l.montant) || 0), 0);
  const coutUnitaire = bouteilles > 0 ? total / bouteilles : 0;

  const champ =
    "w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20";

  const ouvrir = () => {
    setProduitId("");
    setReference("");
    setDate(aujourdhui());
    setBouteilles(0);
    setLignes([{ libelle: "", montant: 0 }]);
    setErreur("");
    setModal(true);
  };

  const majLigne = (i: number, champNom: keyof LigneLotInput, valeur: string) => {
    setLignes((prev) =>
      prev.map((l, idx) =>
        idx === i ? { ...l, [champNom]: champNom === "montant" ? Number(valeur) : valeur } : l
      )
    );
  };

  const ajouterLigne = () => setLignes((prev) => [...prev, { libelle: "", montant: 0 }]);
  const retirerLigne = (i: number) =>
    setLignes((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const enregistrer = () => {
    if (!produitId) {
      setErreur("Choisissez un jus.");
      return;
    }
    if (bouteilles <= 0) {
      setErreur("Indiquez un nombre de bouteilles superieur a zero.");
      return;
    }
    const valides = lignes.filter((l) => l.libelle.trim() && l.montant > 0);
    if (valides.length === 0) {
      setErreur("Ajoutez au moins une depense.");
      return;
    }
    startTransition(async () => {
      await creerLot({
        produitId,
        reference,
        date,
        bouteillesProduites: bouteilles,
        lignes: valides,
      });
      setModal(false);
    });
  };

  const supprimer = (lot: Lot) => {
    if (!confirm(`Supprimer le lot de ${lot.produitNom} ?`)) return;
    startTransition(async () => {
      await supprimerLot(lot.id);
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={ouvrir}
          className="inline-flex items-center gap-2 rounded-lg bg-primaire px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          <Plus size={18} />
          Nouveau lot
        </button>
      </div>

      {lots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <FlaskConical size={32} className="mx-auto mb-3 text-stone-300" />
          <p className="text-sm text-stone-500">
            Aucun lot de production. Creez-en un pour calculer le prix de revient automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lots.map((lot) => {
            const cu = lot.bouteillesProduites > 0 ? lot.total / lot.bouteillesProduites : 0;
            return (
              <div
                key={lot.id}
                className="rounded-2xl border border-stone-100 bg-fond-doux p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-titre">
                      {lot.produitNom}
                      {lot.reference && (
                        <span className="ml-2 text-xs font-normal text-stone-400">
                          {lot.reference}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {new Date(lot.date).toLocaleDateString("fr-FR")} . {lot.bouteillesProduites}{" "}
                      bouteilles
                    </p>
                  </div>
                  <button
                    onClick={() => supprimer(lot)}
                    className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-red-500"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-stone-200/60 pt-3 text-sm">
                  <span className="text-stone-500">
                    Total depenses <b className="text-titre">{formatFCFA(lot.total)}</b>
                  </span>
                  <span className="text-stone-500">
                    Prix de revient <b className="text-primaire">{formatFCFA(cu)} / bouteille</b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-titre">Nouveau lot de production</h2>
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Jus</label>
                  <select
                    value={produitId}
                    onChange={(e) => setProduitId(e.target.value)}
                    className={champ}
                  >
                    <option value="">Choisir un jus</option>
                    {produits.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">
                    Reference (optionnel)
                  </label>
                  <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className={champ}
                    placeholder="Lot 10 litres"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">
                    Bouteilles produites
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bouteilles}
                    onChange={(e) => setBouteilles(Number(e.target.value))}
                    className={champ}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-titre">Depenses du lot</label>
                  <button
                    onClick={ajouterLigne}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primaire hover:text-primaire-hover"
                  >
                    <Plus size={14} />
                    Ajouter une ligne
                  </button>
                </div>
                <div className="space-y-2">
                  {lignes.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={l.libelle}
                        onChange={(e) => majLigne(i, "libelle", e.target.value)}
                        className={champ + " flex-1"}
                        placeholder="Hibiscus, sucre, bouteilles..."
                      />
                      <input
                        type="number"
                        min={0}
                        value={l.montant}
                        onChange={(e) => majLigne(i, "montant", e.target.value)}
                        className={champ + " w-28"}
                        placeholder="Montant"
                      />
                      <button
                        onClick={() => retirerLigne(i)}
                        className="shrink-0 rounded-lg px-2 text-stone-400 hover:text-red-500"
                        aria-label="Retirer la ligne"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-fond-doux p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total des depenses</span>
                  <span className="font-semibold text-titre">{formatFCFA(total)}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-stone-500">Prix de revient estime</span>
                  <span className="font-semibold text-primaire">
                    {formatFCFA(coutUnitaire)} / bouteille
                  </span>
                </div>
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
                {pending ? "Enregistrement..." : "Enregistrer le lot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
