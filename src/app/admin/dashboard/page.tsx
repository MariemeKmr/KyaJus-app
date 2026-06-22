import { auth } from "@/auth";
import { getResumeFinance, formatFCFA } from "@/lib/finance";
import { Wallet, TrendingDown, TrendingUp, PiggyBank, ShoppingCart, Percent } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const f = await getResumeFinance();

  const cartes = [
    { label: "Revenus", valeur: formatFCFA(f.revenus), icon: Wallet, couleur: "text-secondaire", fond: "bg-secondaire/10" },
    { label: "Coût marchandises", valeur: formatFCFA(f.coutMarchandises), icon: ShoppingCart, couleur: "text-amber-600", fond: "bg-amber-500/10" },
    { label: "Dépenses", valeur: formatFCFA(f.depenses), icon: TrendingDown, couleur: "text-red-600", fond: "bg-red-500/10" },
    { label: "Bénéfice net", valeur: formatFCFA(f.beneficeNet), icon: TrendingUp, couleur: "text-primaire", fond: "bg-primaire/10" },
    { label: "À réinvestir", valeur: formatFCFA(f.montantReinvesti), icon: PiggyBank, couleur: "text-indigo-600", fond: "bg-indigo-500/10" },
    { label: "Taux de réinvestissement", valeur: `${f.taux} %`, icon: Percent, couleur: "text-stone-600", fond: "bg-stone-500/10" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-titre">          Bonjour {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-stone-500">Voici un apercu de votre activite.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cartes.map(({ label, valeur, icon: Icon, couleur, fond }) => (
          <div key={label} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">{label}</span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${fond} ${couleur}`}>
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-xl font-bold text-stone-800">{valeur}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-stone-500">
          Les commandes récentes apparaîtront ici une fois la boutique et les ventes en place.
        </p>
      </div>
    </div>
  );
}