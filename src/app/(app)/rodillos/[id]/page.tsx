import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { DeleteButton } from "@/components/delete-button";
import { deleteRodillo } from "@/lib/actions/rodillos";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";

export default async function RodilloDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const canManage = session?.user ? canManageRodillos(session.user.role) : false;

  const rodillo = await prisma.rodillo.findUnique({
    where: { id },
    include: {
      mediciones: {
        orderBy: { fecha: "desc" },
        include: { usuario: { select: { name: true, username: true } } },
      },
      alertas: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!rodillo) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/rodillos"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
          >
            ← Volver a rodillos
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {rodillo.codigo} · {rodillo.nombre || `Rodillo ${rodillo.codigo}`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {rodillo.ubicacion || rodillo.molino} · {rodillo.posicion}
            {rodillo.campania ? ` · Campaña ${rodillo.campania}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManage && (
            <>
              <Link
                href={`/rodillos/${rodillo.id}/editar`}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Editar
              </Link>
              <DeleteButton
                confirmMessage={`¿Eliminar el rodillo ${rodillo.codigo}?`}
                onDelete={deleteRodillo.bind(null, rodillo.id)}
                redirectTo="/rodillos"
              />
            </>
          )}
          <Link
            href="/mediciones/nueva"
            className="rounded-md bg-[#133863] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0c2442] shadow-xs transition-colors"
          >
            + Nueva medición
          </Link>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Info label="Ø Original" value={`${rodillo.diametroOriginal} mm`} />
        <Info label="Ø Actual" value={`${rodillo.diametroActual} mm`} highlight />
        <Info label="Ø Mínimo" value={`${rodillo.diametroMinimo} mm`} />
        <Info
          label="Margen de seguridad"
          value={`${(rodillo.diametroActual - rodillo.diametroMinimo).toFixed(1)} mm`}
        />
      </div>

      {rodillo.notas && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 mb-1">Notas técnicas</p>
          <p className="text-xs text-slate-600">{rodillo.notas}</p>
        </div>
      )}

      {/* Measurements history */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Historial de mediciones</h2>
          <span className="text-xs text-slate-500">{rodillo.mediciones.length} registros</span>
        </div>

        {rodillo.mediciones.length === 0 ? (
          <p className="py-4 text-xs text-slate-500">Sin mediciones registradas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-3 pr-4">Fecha</th>
                  <th className="pb-3 px-4">Parámetro</th>
                  <th className="pb-3 px-4">Valor</th>
                  <th className="pb-3 px-4">Registró</th>
                  <th className="pb-3 pl-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rodillo.mediciones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 pr-4 text-slate-600">
                      {m.fecha.toLocaleString("es-BO")}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {m.parametro}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {m.valor ?? m.diametro} {m.unidad || "mm"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{m.usuario.name}</td>
                    <td className="py-3 pl-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          m.estado === "Normal"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-red-50 text-red-700 border border-red-200/60"
                        }`}
                      >
                        {m.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Alerts */}
      {rodillo.alertas.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50/60 p-5 shadow-xs">
          <h2 className="mb-3 text-sm font-bold text-red-900">
            Alertas registradas ({rodillo.alertas.length})
          </h2>
          <ul className="space-y-2 text-xs">
            {rodillo.alertas.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 border border-red-200/80 shadow-2xs"
              >
                <div>
                  <span className="font-semibold text-red-800">
                    {a.parametro ? `${a.parametro}: ` : ""}
                  </span>
                  <span className="text-slate-800">{a.mensaje}</span>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {a.createdAt.toLocaleString("es-BO")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    a.resuelta
                      ? "bg-slate-100 text-slate-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.resuelta ? "Resuelta" : "Activa"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-bold ${
          highlight ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
