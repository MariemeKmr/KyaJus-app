import Logo from "@/components/Logo";

export default function PiedBoutique() {
  return (
    <footer className="border-t border-stone-100 bg-fond-doux">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <div className="flex justify-center">
          <Logo avecIcone taille="text-xl" tailleIcone={28} />
        </div>
        <p className="mt-3 text-xs text-stone-400">Jus frais et naturels a Dakar.</p>
        <p className="mt-1 text-xs text-stone-400">KyaJus, {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
