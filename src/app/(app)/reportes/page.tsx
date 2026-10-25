import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default async function ReportesPage() {
  const [rodillos, totalMediciones, totalAlertas] = await Promise.all([
    prisma.rodillo.findMany({
      orderBy: { codigo: "asc" },
      include: {
        _count: { select: { mediciones: true, alertas: true } },
      },
    }),
    prisma.medicion.count(),
    prisma.alerta.count(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Reportes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidado operativo y estado de mazas de molienda
          </p>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#133863] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Imprimir reporte</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Parque total de rodillos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{rodillos.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Mediciones acumuladas</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{totalMediciones}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Alertas registradas</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{totalAlertas}</p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">
            Resumen por rodillo de molienda
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Ø Actual</th>
                <th className="py-3 px-4">Ø Mínimo</th>
                <th className="py-3 px-4">Mediciones</th>
                <th className="py-3 px-4">Alertas</th>
                <th className="py-3 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rodillos.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href={`/rodillos/${r.id}`} className="text-blue-700 hover:underline">
                      {r.codigo}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{r.nombre || "—"}</td>
                  <td className="py-3 px-4 text-slate-600">{r.ubicacion || r.molino}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{r.diametroActual} mm</td>
                  <td className="py-3 px-4 text-slate-500">{r.diametroMinimo} mm</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{r._count.mediciones}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{r._count.alertas}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        r.estado === "EN_OPERACION" || r.estado === "EN_SERVICIO"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : r.estado === "EN_REVISION" || r.estado === "TALLER"
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                          : "bg-red-50 text-red-700 border border-red-200/60"
                      }`}
                    >
                      {r.estado === "EN_OPERACION" || r.estado === "EN_SERVICIO"
                        ? "En operación"
                        : r.estado === "EN_REVISION" || r.estado === "TALLER"
                        ? "En revisión"
                        : "Fuera de rango"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
