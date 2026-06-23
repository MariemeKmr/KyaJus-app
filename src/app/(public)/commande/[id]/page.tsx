import { notFound } from "next/navigation";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";

const libelleStatut: Record<string, string> = {
  EN_ATTENTE: "En attente de validation",
  VALIDEE: "Validee",
  EN_PREPARATION: "En preparation",
  LIVREE: "Livree",
  ANNULEE: "Annulee",
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { lignes: { include: { produit: true } } },
  });

  if (!commande) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
        <CircleCheck size={44} className="mx-auto mb-3 text-secondaire" />
        <h1 className="text-2xl font-bold text-titre">Commande envoyee</h1>
        <p className="mt-2 text-sm text-stone-500">
          Merci. Votre commande {commande.numero} a bien ete enregistree. Nous vous contacterons au
          numero indique pour confirmer.
        </p>

        <div className="mt-6 space-y-2 text-left">
          {commande.lignes.map((l) => (
            <div key={l.id} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {l.produit?.nom ?? "Article"} x {l.quantite}
              </span>
              <span className="font-medium text-titre">
                {formatFCFA(Number(l.prixUnitaire) * l.quantite)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 font-bold text-titre">
          <span>Total</span>
          <span>{formatFCFA(Number(commande.total))}</span>
        </div>

        <p className="mt-4 inline-block rounded-md bg-fond-doux px-3 py-1 text-xs font-medium text-stone-600">
          {libelleStatut[commande.statut]}
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-lg bg-primaire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaire-hover"
          >
            Retour a la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
