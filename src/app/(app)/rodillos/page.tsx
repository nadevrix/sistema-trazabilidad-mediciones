import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";
import { RodillosTable } from "@/components/rodillos-table";

export default async function RodillosPage() {
  const session = await auth();
  const canManage = session?.user ? canManageRodillos(session.user.role) : false;

  const rodillos = await prisma.rodillo.findMany({
    orderBy: { codigo: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Rodillos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de rodillos de molienda
          </p>
        </div>

        {canManage && (
          <Link
            href="/rodillos/nuevo"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#133863] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] transition-colors"
          >
            <span>+</span>
            <span>Nuevo rodillo</span>
          </Link>
        )}
      </div>

      {/* Main Table */}
      <RodillosTable rodillos={rodillos} canManage={canManage} />
    </div>
  );
}
