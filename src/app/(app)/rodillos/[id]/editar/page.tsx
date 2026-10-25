import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { RodilloForm } from "@/components/rodillo-form";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";

export default async function EditarRodilloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || !canManageRodillos(session.user.role)) {
    redirect("/rodillos");
  }

  const { id } = await params;
  const rodillo = await prisma.rodillo.findUnique({ where: { id } });
  if (!rodillo) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/rodillos/${rodillo.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
        >
          ← Volver al rodillo
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Editar {rodillo.codigo}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Actualización de datos técnicos y estado operativo
        </p>
      </div>
      <RodilloForm rodillo={rodillo} />
    </div>
  );
}
