import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateUserForm, EditUserRow } from "@/components/user-admin-forms";
import { canManageUsers, ROLE_LABELS } from "@/lib/roles";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { username: "asc" }],
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Usuarios y roles
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestión de accesos, roles y credenciales del personal de planta
        </p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-700">
        <p className="font-bold text-slate-900 mb-1">Permisos por rol:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>{ROLE_LABELS.ADMIN}</strong>: acceso total, configuración de rangos, gestión de usuarios.
          </li>
          <li>
            <strong>{ROLE_LABELS.SUPERVISOR}</strong>: alta y edición de rodillos, registro de mediciones y resolución de alertas.
          </li>
          <li>
            <strong>{ROLE_LABELS.OPERADOR}</strong>: registro diario de mediciones y consulta de historial operativo.
          </li>
        </ul>
      </div>

      <CreateUserForm />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          Usuarios activos ({users.length})
        </h2>
        <div className="divide-y divide-slate-100">
          {users.map((user) => (
            <EditUserRow key={user.id} user={user} />
          ))}
        </div>
      </section>
    </div>
  );
}
