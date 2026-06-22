"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Receipt,
  PieChart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const liensBase = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/depenses", label: "Dépenses", icon: Receipt },
  { href: "/admin/finance", label: "Finance", icon: PieChart },
];

export default function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();
  const liens =
    role === "SUPER_ADMIN"
      ? [
          ...liensBase,
          { href: "/admin/investisseurs", label: "Investisseurs", icon: Users },
          { href: "/admin/parametres", label: "Paramètres", icon: Settings },
        ]
      : liensBase;

  const actif = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-stone-200 bg-white px-4 py-6 md:flex">
        <div className="mb-8 px-2">
          <Logo taille="text-2xl" />
        </div>
        <nav className="flex-1 space-y-1">
          {liens.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                actif(href)
                    ? "bg-fond-doux text-primaire"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {/* Barre du bas mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-stone-200 bg-white md:hidden">
        {liensBase.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              actif(href) ? "text-primaire" : "text-stone-500"
            }`}
          >
            <Icon size={20} />
            {label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </>
  );
}