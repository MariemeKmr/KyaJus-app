import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ParametresClient from "@/components/admin/ParametresClient";

export default async function ParametresPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  const param = await prisma.parametreFinance.findUnique({ where: { id: 1 } });

  return <ParametresClient tauxInitial={Number(param?.tauxReinvestissement ?? 0)} />;
}
