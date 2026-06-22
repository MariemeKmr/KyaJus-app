"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setErreur("");
    setChargement(true);
    const res = await signIn("credentials", { email, motDePasse, redirect: false });
    setChargement(false);
    if (res?.error) {
      setErreur("Email ou mot de passe incorrect.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg shadow-jus-100/60">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-jus-600">KyaJus</h1>
          <p className="mt-1 text-sm text-stone-500">Espace de gestion</p>
        </div>

        {erreur && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-jus-400 focus:ring-2 focus:ring-jus-100"
              placeholder="superadmin@kyajus.sn"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && soumettre()}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-jus-400 focus:ring-2 focus:ring-jus-100"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={soumettre}
            disabled={chargement}
            className="w-full rounded-lg bg-jus-500 py-2.5 text-sm font-semibold text-white transition hover:bg-jus-600 disabled:opacity-60"
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    </main>
  );
}