import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import AdminNav from "@/components/admin/AdminNav";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen">
      <AdminNav role={role} />

      {/* En-tete mobile */}
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
        <Logo taille="text-2xl" />
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/connexion" });
          }}
        >
          <button className="text-stone-500" aria-label="Déconnexion">
            <LogOut size={20} />
          </button>
        </form>
      </header>

      <main className="px-4 py-6 pb-24 md:ml-64 md:px-8 md:pb-8">{children}</main>
    </div>
  );
}