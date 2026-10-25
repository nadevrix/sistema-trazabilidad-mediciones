import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DonutChart } from "@/components/donut-chart";

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default async function DashboardPage() {
  const [
    totalRodillos,
    enRangoCount,
    enRevisionCount,
    fueraDeRangoCount,
    totalMediciones,
    alertasActivas,
    latestMedicion,
    medicionesRecientes,
  ] = await Promise.all([
    prisma.rodillo.count(),
    prisma.rodillo.count({
      where: { estado: { in: ["EN_OPERACION", "EN_SERVICIO"] } },
    }),
    prisma.rodillo.count({
      where: { estado: { in: ["EN_REVISION", "TALLER"] } },
    }),
    prisma.rodillo.count({
      where: { estado: { in: ["FUERA_RANGO", "FUERA_USO"] } },
    }),
    prisma.medicion.count(),
    prisma.alerta.count({ where: { resuelta: false } }),
    prisma.medicion.findFirst({
      orderBy: { fecha: "desc" },
    }),
    prisma.medicion.findMany({
      take: 5,
      orderBy: { fecha: "desc" },
      include: {
        rodillo: { select: { codigo: true, nombre: true } },
      },
    }),
  ]);

  const ultimaActualizacionStr = latestMedicion
    ? formatDate(latestMedicion.fecha)
    : "10/04/2025 09:32";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Panel principal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Resumen general del sistema
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total de rodillos */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Total de rodillos</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalRodillos}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {/* Roller / cylinder icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <ellipse cx="12" cy="7" rx="8" ry="3" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
            </svg>
          </div>
        </div>

        {/* Card 2: Mediciones hoy */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Mediciones hoy</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalMediciones}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {/* Bar chart icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Alertas activas */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Alertas activas</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{alertasActivas}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            {/* Alert triangle icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Card 4: Última actualización */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Última actualización</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {ultimaActualizacionStr}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {/* Calendar icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Measurements & Roller Status Donut Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Mediciones recientes (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Mediciones recientes
            </h2>
            <Link
              href="/historial"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Ver todo el historial →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-3 pr-4">Fecha</th>
                  <th className="pb-3 px-4">Rodillo</th>
                  <th className="pb-3 px-4">Parámetro</th>
                  <th className="pb-3 px-4">Valor</th>
                  <th className="pb-3 pl-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicionesRecientes.map((m) => {
                  const isNormal = m.estado === "Normal";
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-4 text-slate-600">
                        {formatDate(m.fecha)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {m.rodillo.codigo}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {m.parametro}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {m.valor ?? m.diametro} {m.unidad || "mm"}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            isNormal
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          {isNormal ? (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Normal</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span>Fuera de rango</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Estado de rodillos (Donut Chart) (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Estado de rodillos
            </h2>
            <p className="text-[11px] text-slate-500 mb-6">
              Distribución de condición operativa en planta
            </p>
          </div>

          <div className="my-auto py-2">
            <DonutChart
              enRangoCount={enRangoCount}
              enRevisionCount={enRevisionCount}
              fueraDeRangoCount={fueraDeRangoCount}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Mazas monitoreadas</span>
            <Link
              href="/rodillos"
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Gestionar rodillos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
