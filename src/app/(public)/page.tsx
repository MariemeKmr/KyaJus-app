import { prisma } from "@/lib/prisma";
import { couleursJus } from "@/lib/jus-couleurs";
import CarteProduit from "@/components/boutique/CarteProduit";

export default async function BoutiquePage() {
  const produits = await prisma.produit.findMany({
    where: { actif: true },
    orderBy: { nom: "asc" },
  });

  const liste = produits.map((p) => ({
    id: p.id,
    nom: p.nom,
    description: p.description ?? "",
    prix: Number(p.prixVente),
    stock: p.stock,
    imageUrl: p.imageUrl,
    couleur: couleursJus[p.nom] ?? "#E5E5E5",
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-titre">Nos jus frais</h1>
        <p className="mt-2 text-sm text-stone-500">
          Choisissez vos jus naturels et commandez en quelques clics.
        </p>
      </div>

      {liste.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-500">
          Aucun jus disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {liste.map((p) => (
            <CarteProduit key={p.id} produit={p} />
          ))}
        </div>
      )}
    </div>
  );
}
