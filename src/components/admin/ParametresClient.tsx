"use client";

import { useState, useTransition } from "react";
import { Percent, Check } from "lucide-react";
import { definirTaux } from "@/lib/actions/parametres";

export default function ParametresClient({ tauxInitial }: { tauxInitial: number }) {
  const [pending, startTransition] = useTransition();
  const [taux, setTaux] = useState(tauxInitial);
  const [enregistre, setEnregistre] = useState(false);

  const enregistrer = () => {
    setEnregistre(false);
    startTransition(async () => {
      await definirTaux(taux);
      setEnregistre(true);
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-titre">Parametres</h1>
        <p className="mt-1 text-sm text-stone-500">Reglages financiers de KyaJus</p>
      </div>

      <div className="max-w-md rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primaire/10 text-primaire">
            <Percent size={18} />
          </span>
          <h2 className="font-semibold text-titre">Taux de reinvestissement</h2>
        </div>
        <p className="mb-4 text-sm text-stone-500">
          Part du benefice net mise de cote pour reinvestir avant la repartition entre
          investisseurs.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={100}
            value={taux}
            onChange={(e) => {
              setTaux(Number(e.target.value));
              setEnregistre(false);
            }}
            className="w-28 rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primaire focus:ring-2 focus:ring-primaire/20"
          />
          <span className="text-sm text-stone-500">%</span>
        </div>

        <button
          onClick={enregistrer}
          disabled={pending}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primaire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>

        {enregistre && (
          <p className="mt-3 inline-flex items-center gap-1 text-sm text-secondaire">
            <Check size={16} />
            Taux enregistre.
          </p>
        )}
      </div>
    </div>
  );
}
