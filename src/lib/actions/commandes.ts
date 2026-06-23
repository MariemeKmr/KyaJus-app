"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function passerCommande(data: {
  nom: string;
  telephone: string;
  adresse: string;
  articles: { produitId: string; quantite: number }[];
}) {
  if (!data.nom.trim() || !data.telephone.trim()) {
    throw new Error("Nom et telephone obligatoires");
  }

  const articles = data.articles.filter((a) => a.quantite > 0);
  if (articles.length === 0) throw new Error("Votre panier est vide");

  const ids = articles.map((a) => a.produitId);
  const produits = await prisma.produit.findMany({
    where: { id: { in: ids }, actif: true },
  });
  const map = new Map(produits.map((p) => [p.id, p]));

  // Le serveur relit les prix et le stock en base : aucune donnee de prix du
  // client n'est utilisee.
  for (const a of articles) {
    const p = map.get(a.produitId);
    if (!p) throw new Error("Un jus de votre panier n'est plus disponible");
    if (p.stock < a.quantite) throw new Error(`Stock insuffisant pour ${p.nom}`);
  }

  const lignes = articles.map((a) => {
    const p = map.get(a.produitId)!;
    return {
      produitId: p.id,
      quantite: a.quantite,
      prixUnitaire: p.prixVente,
      coutUnitaire: p.prixRevient,
    };
  });

  const total = lignes.reduce((s, l) => s + Number(l.prixUnitaire) * l.quantite, 0);

  const count = await prisma.commande.count();
  const numero = "CMD-" + String(count + 1).padStart(5, "0");

  const commande = await prisma.$transaction(async (tx) => {
    const c = await tx.commande.create({
      data: {
        numero,
        clientNom: data.nom.trim(),
        clientTelephone: data.telephone.trim(),
        clientAdresse: data.adresse.trim() || null,
        statut: "EN_ATTENTE",
        paye: false,
        total,
        lignes: { create: lignes },
      },
    });

    for (const a of articles) {
      await tx.produit.update({
        where: { id: a.produitId },
        data: { stock: { decrement: a.quantite } },
      });
    }

    return c;
  });

  revalidatePath("/admin/commandes");
  revalidatePath("/");

  return { id: commande.id, numero: commande.numero };
}
