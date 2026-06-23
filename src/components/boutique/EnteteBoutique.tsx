"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Logo from "@/components/Logo";
import { usePanier } from "@/lib/panier";

export default function EnteteBoutique() {
  const { nombre } = usePanier();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo taille="text-2xl" />
        </Link>
        <Link
          href="/panier"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition hover:bg-fond-doux"
          aria-label="Panier"
        >
          <ShoppingBag size={20} />
          {nombre > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primaire px-1 text-[11px] font-semibold text-white">
              {nombre}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
