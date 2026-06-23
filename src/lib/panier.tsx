"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ArticlePanier = {
  id: string;
  nom: string;
  prix: number;
  couleur: string;
  quantite: number;
};

type PanierContexte = {
  articles: ArticlePanier[];
  ajouter: (a: Omit<ArticlePanier, "quantite">) => void;
  retirer: (id: string) => void;
  changerQuantite: (id: string, q: number) => void;
  vider: () => void;
  total: number;
  nombre: number;
};

const Contexte = createContext<PanierContexte | null>(null);

const CLE = "kyajus-panier";

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(CLE);
      if (s) setArticles(JSON.parse(s));
    } catch {
      // panier illisible, on repart vide
    }
    setCharge(true);
  }, []);

  useEffect(() => {
    if (charge) localStorage.setItem(CLE, JSON.stringify(articles));
  }, [articles, charge]);

  const ajouter = (a: Omit<ArticlePanier, "quantite">) =>
    setArticles((prev) => {
      const existe = prev.find((x) => x.id === a.id);
      if (existe) {
        return prev.map((x) => (x.id === a.id ? { ...x, quantite: x.quantite + 1 } : x));
      }
      return [...prev, { ...a, quantite: 1 }];
    });

  const retirer = (id: string) => setArticles((prev) => prev.filter((x) => x.id !== id));

  const changerQuantite = (id: string, q: number) =>
    setArticles((prev) =>
      q <= 0 ? prev.filter((x) => x.id !== id) : prev.map((x) => (x.id === id ? { ...x, quantite: q } : x))
    );

  const vider = () => setArticles([]);

  const total = articles.reduce((s, a) => s + a.prix * a.quantite, 0);
  const nombre = articles.reduce((s, a) => s + a.quantite, 0);

  return (
    <Contexte.Provider
      value={{ articles, ajouter, retirer, changerQuantite, vider, total, nombre }}
    >
      {children}
    </Contexte.Provider>
  );
}

export function usePanier() {
  const c = useContext(Contexte);
  if (!c) throw new Error("usePanier doit etre utilise dans un PanierProvider");
  return c;
}
