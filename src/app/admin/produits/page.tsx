import { prisma } from "@/lib/prisma";
import ProduitsClient from "@/components/admin/ProduitsClient";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany({ orderBy: { nom: "asc" } });

  const liste = produits.map((p) => ({
    id: p.id,
    nom: p.nom,
    description: p.description ?? "",
    prixVente: Number(p.prixVente),
    prixRevient: Number(p.prixRevient),
    stock: p.stock,
    actif: p.actif,
    imageUrl: p.imageUrl,
  }));

  return <ProduitsClient produits={liste} />;
}
