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
        <Link href="/mediciones" className="text-sm text-[#8b1528]">
          ← Volver
        </Link>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[#8b1528]">
          Editar medición
        </h2>
        <p className="text-sm text-[#5c4d44]">
          Corregí un registro cargado por error.
        </p>
      </div>
      <MedicionForm rodillos={rodillos} medicion={medicion} />
    </div>
  );
}
