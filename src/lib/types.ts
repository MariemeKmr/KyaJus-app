export type ProduitFormData = {
  id?: string;
  nom: string;
  description: string;
  prixVente: number;
  prixRevient: number;
  stock: number;
  actif: boolean;
};

export type LigneLotInput = {
  libelle: string;
  montant: number;
};

export type LotInput = {
  produitId: string;
  reference: string;
  date: string;
  bouteillesProduites: number;
  lignes: LigneLotInput[];
};

export type DepenseInput = {
  categorie: string;
  montant: number;
  description: string;
  date: string;
};
