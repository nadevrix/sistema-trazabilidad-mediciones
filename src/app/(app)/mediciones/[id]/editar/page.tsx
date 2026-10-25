import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { MedicionForm } from "@/components/medicion-form";
import { prisma } from "@/lib/prisma";
import { canManageMediciones } from "@/lib/roles";

export default async function EditarMedicionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || !canManageMediciones(session.user.role)) {
    redirect("/mediciones");
  }

  const { id } = await params;
  const medicion = await prisma.medicion.findUnique({ where: { id } });
  if (!medicion) notFound();

  const rodillos = await prisma.rodillo.findMany({
    orderBy: { codigo: "asc" },
    select: {
      id: true,
      codigo: true,
      molino: true,
      posicion: true,
      diametroActual: true,
      diametroMinimo: true,
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <Link href="/historial" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1">
          ← Volver al historial
        </Link>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Editar medición
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Corrige un registro de medición cargado en el sistema
        </p>
      </div>
      <MedicionForm rodillos={rodillos} medicion={medicion} />
    </div>
  );
}
