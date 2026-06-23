import { auth } from "@/auth";
import { getResumeFinance, getRepartition, formatFCFA } from "@/lib/finance";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  ShoppingCart,
  Percent,
  Users,
  Coins,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;
  const prenom = session?.user?.name?.split(" ")[0];

  const f = await getResumeFinance();
  const repartition = await getRepartition();

  // Vue investisseur : uniquement sa propre part.
  if (role === "ADMIN") {
    const moi = repartition.find((r) => r.userId === session?.user?.id);

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-titre">Bonjour {prenom}</h1>
          <p className="mt-1 text-sm text-stone-500">Voici votre participation.</p>
        </div>

        {!moi ? (
          <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-stone-500">
              Aucune participation associee a votre compte pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Carte
              label="Montant investi"
              valeur={formatFCFA(moi.montantInvesti)}
              icon={Coins}
              couleur="text-stone-600"
              fond="bg-stone-500/10"
            />
            <Carte
              label="Votre part"
              valeur={`${moi.partPourcent} %`}
              icon={Percent}
              couleur="text-primaire"
              fond="bg-primaire/10"
            />
            <Carte
              label="Votre benefice"
              valeur={formatFCFA(moi.part)}
              icon={TrendingUp}
              couleur="text-secondaire"
              fond="bg-secondaire/10"
            />
          </div>
        )}
      </div>
    );
  }

  // Vue super admin : finance globale et repartition complete.
  const cartes = [
    { label: "Revenus", valeur: formatFCFA(f.revenus), icon: Wallet, couleur: "text-secondaire", fond: "bg-secondaire/10" },
    { label: "Cout marchandises", valeur: formatFCFA(f.coutMarchandises), icon: ShoppingCart, couleur: "text-amber-600", fond: "bg-amber-500/10" },
    { label: "Depenses", valeur: formatFCFA(f.depenses), icon: TrendingDown, couleur: "text-red-600", fond: "bg-red-500/10" },
    { label: "Benefice net", valeur: formatFCFA(f.beneficeNet), icon: TrendingUp, couleur: "text-primaire", fond: "bg-primaire/10" },
    { label: "A reinvestir", valeur: formatFCFA(f.montantReinvesti), icon: PiggyBank, couleur: "text-indigo-600", fond: "bg-indigo-500/10" },
    { label: "Taux de reinvestissement", valeur: `${f.taux} %`, icon: Percent, couleur: "text-stone-600", fond: "bg-stone-500/10" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-titre">Bonjour {prenom}</h1>
        <p className="mt-1 text-sm text-stone-500">Voici un apercu de votre activite.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cartes.map((c) => (
          <Carte key={c.label} {...c} />
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Users size={18} className="text-stone-500" />
          <h2 className="font-semibold text-titre">Repartition entre investisseurs</h2>
        </div>

        {repartition.length === 0 ? (
          <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-stone-500">
              Aucun investisseur. Ajoutez-en pour repartir le benefice.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
            {repartition.map((r, idx) => (
              <div
                key={r.id}
                className={`flex items-center justify-between px-5 py-3 ${
                  idx > 0 ? "border-t border-stone-100" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-titre">{r.nom}</p>
                  <p className="text-xs text-stone-400">Part {r.partPourcent} %</p>
                </div>
                <span className="font-semibold text-primaire">{formatFCFA(r.part)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Carte({
  label,
  valeur,
  icon: Icon,
  couleur,
  fond,
}: {
  label: string;
  valeur: string;
  icon: React.ComponentType<{ size?: number }>;
  couleur: string;
  fond: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${fond} ${couleur}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-xl font-bold text-titre">{valeur}</p>
    </div>
  );
}
