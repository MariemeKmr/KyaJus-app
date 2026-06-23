"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Users, KeyRound } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import {
  creerInvestisseur,
  modifierInvestisseur,
  supprimerInvestisseur,
} from "@/lib/actions/investisseurs";

type Investisseur = {
  id: string;
  nom: string;
  montantInvesti: number;
  partPourcent: number;
  aAcces: boolean;
};

export default function InvestisseursClient({
  investisseurs,
}: {
  investisseurs: Investisseur[];
}) {
  const [pending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState(0);
  const [part, setPart] = useState(0);
  const [creerAcces, setCreerAcces] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const totalParts = investisseurs.reduce((s, i) => s + i.partPourcent, 0);

  const champ =
    "w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20";

  const ouvrirAjout = () => {
    setEditId(null);
    setNom("");
    setMontant(0);
    setPart(0);
    setCreerAcces(false);
    setEmail("");
    setMotDePasse("");
    setErreur("");
    setModal(true);
  };

  const ouvrirEdition = (i: Investisseur) => {
    setEditId(i.id);
    setNom(i.nom);
    setMontant(i.montantInvesti);
    setPart(i.partPourcent);
    setCreerAcces(false);
    setEmail("");
    setMotDePasse("");
    setErreur("");
    setModal(true);
  };

  const enregistrer = () => {
    if (!nom.trim()) {
      setErreur("Le nom est obligatoire.");
      return;
    }
    if (part < 0 || part > 100) {
      setErreur("La part doit etre comprise entre 0 et 100.");
      return;
    }
    startTransition(async () => {
      try {
        if (editId) {
          await modifierInvestisseur(editId, {
            nom,
            montantInvesti: montant,
            partPourcent: part,
          });
        } else {
          await creerInvestisseur({
            nom,
            montantInvesti: montant,
            partPourcent: part,
            creerAcces,
            email,
            motDePasse,
          });
        }
        setModal(false);
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "Une erreur est survenue.");
      }
    });
  };

  const supprimer = (i: Investisseur) => {
    const msg = i.aAcces
      ? `Supprimer ${i.nom} ? Son compte d acces sera aussi supprime.`
      : `Supprimer ${i.nom} ?`;
    if (!confirm(msg)) return;
    startTransition(async () => {
      await supprimerInvestisseur(i.id);
    });
  };

  const totalOk = Math.round(totalParts) === 100;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-titre">Investisseurs</h1>
          <p className="mt-1 text-sm text-stone-500">{investisseurs.length} investisseurs</p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primaire px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      <div
        className={`mb-5 rounded-lg px-4 py-3 text-sm ${
          totalOk ? "bg-secondaire/10 text-secondaire" : "bg-amber-100 text-amber-700"
        }`}
      >
        Total des parts : {totalParts} %
        {!totalOk && " (le total devrait faire 100 %)"}
      </div>

      {investisseurs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <Users size={32} className="mx-auto mb-3 text-stone-300" />
          <p className="text-sm text-stone-500">Aucun investisseur enregistre.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {investisseurs.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between rounded-xl border border-stone-100 bg-fond-doux p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-titre">{i.nom}</h3>
                  {i.aAcces && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs text-stone-500">
                      <KeyRound size={12} />
                      Acces
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  Investi {formatFCFA(i.montantInvesti)} . Part {i.partPourcent} %
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => ouvrirEdition(i)}
                  className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-primaire"
                  aria-label="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => supprimer(i)}
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-titre">
                {editId ? "Modifier l investisseur" : "Ajouter un investisseur"}
              </h2>
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
              <div>
                <label className="mb-1 block text-sm font-medium text-titre">Nom</label>
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={champ}
                  placeholder="Nom de l investisseur"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Montant investi</label>
                  <input
                    type="number"
                    min={0}
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    className={champ}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-titre">Part (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={part}
                    onChange={(e) => setPart(Number(e.target.value))}
                    className={champ}
                  />
                </div>
              </div>

              {!editId && (
                <div className="rounded-lg border border-stone-200 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-titre">
                    <input
                      type="checkbox"
                      checked={creerAcces}
                      onChange={(e) => setCreerAcces(e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 text-primaire focus:ring-primaire"
                    />
                    Creer un acces de connexion
                  </label>
                  <p className="mt-1 text-xs text-stone-400">
                    L investisseur pourra se connecter et voir uniquement son propre benefice.
                  </p>

                  {creerAcces && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-titre">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={champ}
                          placeholder="investisseur@email.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-titre">Mot de passe</label>
                        <input
                          type="text"
                          value={motDePasse}
                          onChange={(e) => setMotDePasse(e.target.value)}
                          className={champ}
                          placeholder="Mot de passe initial"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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
