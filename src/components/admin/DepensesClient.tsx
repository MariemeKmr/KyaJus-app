"use client";

import { useState } from "react";
import { FlaskConical, Receipt } from "lucide-react";
import LotsProduction from "./LotsProduction";
import DepensesGenerales from "./DepensesGenerales";

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

type Depense = {
  id: string;
  categorie: string;
  montant: number;
  description: string;
  date: string;
};

export default function DepensesClient({
  produits,
  lots,
  depenses,
}: {
  produits: Produit[];
  lots: Lot[];
  depenses: Depense[];
}) {
  const [onglet, setOnglet] = useState<"lots" | "generales">("lots");

  const bouton = (actif: boolean) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
      actif ? "bg-primaire text-white" : "text-stone-600 hover:bg-stone-50"
    }`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-titre">Depenses</h1>
        <p className="mt-1 text-sm text-stone-500">
          Lots de production et depenses generales
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-lg border border-stone-200 bg-white p-1">
        <button onClick={() => setOnglet("lots")} className={bouton(onglet === "lots")}>
          <FlaskConical size={16} />
          Lots de production
        </button>
        <button onClick={() => setOnglet("generales")} className={bouton(onglet === "generales")}>
          <Receipt size={16} />
          Depenses generales
        </button>
      </div>

      {onglet === "lots" ? (
        <LotsProduction produits={produits} lots={lots} />
      ) : (
        <DepensesGenerales depenses={depenses} />
      )}
    </div>
  );
}
