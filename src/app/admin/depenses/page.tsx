import { prisma } from "@/lib/prisma";
import DepensesClient from "@/components/admin/DepensesClient";

export default async function DepensesPage() {
  const [produits, lots, depenses] = await Promise.all([
    prisma.produit.findMany({ orderBy: { nom: "asc" }, select: { id: true, nom: true } }),
    prisma.lotProduction.findMany({
      orderBy: { date: "desc" },
      include: { produit: { select: { nom: true } }, lignes: true },
    }),
    prisma.depense.findMany({ orderBy: { date: "desc" } }),
  ]);

  const lotsPlats = lots.map((l) => ({
    id: l.id,
    produitNom: l.produit.nom,
    reference: l.reference ?? "",
    date: l.date.toISOString(),
    bouteillesProduites: l.bouteillesProduites,
    total: l.lignes.reduce((s, x) => s + Number(x.montant), 0),
    lignes: l.lignes.map((x) => ({ libelle: x.libelle, montant: Number(x.montant) })),
  }));

  const depensesPlates = depenses.map((d) => ({
    id: d.id,
    categorie: d.categorie,
    montant: Number(d.montant),
    description: d.description ?? "",
    date: d.date.toISOString(),
  }));

  return <DepensesClient produits={produits} lots={lotsPlats} depenses={depensesPlates} />;
}
