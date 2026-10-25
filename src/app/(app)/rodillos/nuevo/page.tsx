import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RodilloForm } from "@/components/rodillo-form";
import { canManageRodillos } from "@/lib/roles";

export default async function NuevoRodilloPage() {
  const session = await auth();
  if (!session?.user || !canManageRodillos(session.user.role)) {
    redirect("/rodillos");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Nuevo rodillo
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Alta de rodillo de molienda para trazabilidad
        </p>
      </div>
      <RodilloForm />
    </div>
  );
}
