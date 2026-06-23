import { PanierProvider } from "@/lib/panier";
import EnteteBoutique from "@/components/boutique/EnteteBoutique";
import PiedBoutique from "@/components/boutique/PiedBoutique";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanierProvider>
      <div className="flex min-h-screen flex-col bg-fond">
        <EnteteBoutique />
        <main className="flex-1">{children}</main>
        <PiedBoutique />
      </div>
    </PanierProvider>
  );
}
