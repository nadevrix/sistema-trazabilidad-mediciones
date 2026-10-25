"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resolveAlerta } from "@/lib/actions/alertas";

interface AlertaItem {
  id: string;
  fecha: string;
  rodilloCodigo: string;
  rodilloId: string;
  parametro: string;
  valor: string;
  rango: string;
  estado: string;
  mensaje: string;
  resuelta: boolean;
}

export function AlertasTable({
  alertas,
  canResolve,
}: {
  alertas: AlertaItem[];
  canResolve: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(alertas.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = alertas.slice(startIndex, startIndex + pageSize);

  const handleResolve = (id: string) => {
    startTransition(async () => {
      const res = await resolveAlerta(id);
      if (res.ok) {
        setSelectedAlerta(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-500 font-semibold">
                <th className="py-3 px-4 hidden sm:table-cell">Fecha</th>
                <th className="py-3 px-3 sm:px-4">Rodillo</th>
                <th className="py-3 px-2 sm:px-4">Parámetro</th>
                <th className="py-3 px-2 sm:px-4">Valor</th>
                <th className="py-3 px-4 hidden md:table-cell">Rango</th>
                <th className="py-3 px-2 sm:px-4">Estado</th>
                <th className="py-3 px-3 sm:px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600 hidden sm:table-cell">{a.fecha}</td>
                  <td className="py-3.5 px-3 sm:px-4 font-semibold text-slate-900">
                    <Link
                      href={`/rodillos/${a.rodilloId}`}
                      className="text-blue-700 hover:underline"
                    >
                      {a.rodilloCodigo}
                    </Link>
                    <div className="text-[10px] font-normal text-slate-400 sm:hidden">
                      {a.fecha}
                    </div>
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-700">{a.parametro}</td>
                  <td className="py-3.5 px-2 sm:px-4 font-medium text-slate-900">
                    <div>{a.valor}</div>
                    <div className="text-[10px] text-slate-400 md:hidden">
                      Rango: {a.rango}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 hidden md:table-cell">{a.rango}</td>
                  <td className="py-3.5 px-2 sm:px-4">
                    <span className="inline-flex rounded-full bg-red-50 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-red-700 border border-red-200/60">
                      {a.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAlerta(a)}
                      className="rounded p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Ver detalle de alerta"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

              {alertas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No hay alertas activas en este momento. El sistema opera dentro de los rangos normales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 bg-white text-xs text-slate-500">
          <div>
            Mostrando{" "}
            <span className="font-semibold text-slate-700">
              {alertas.length === 0 ? 0 : startIndex + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + pageSize, alertas.length)}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-700">
              {alertas.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded border text-xs font-semibold ${
                  currentPage === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detalle de Alerta */}
      {selectedAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                  Desviación Crítica
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Alerta: {selectedAlerta.rodilloCodigo} - {selectedAlerta.parametro}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlerta(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Fecha del evento:</span>
                <span className="font-semibold text-slate-800">{selectedAlerta.fecha}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Valor registrado:</span>
                <span className="font-bold text-red-700">{selectedAlerta.valor}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Rango permitido:</span>
                <span className="font-semibold text-slate-800">{selectedAlerta.rango}</span>
              </div>
              <div className="border-b border-slate-100 py-2">
                <span className="text-slate-500 block mb-1">Descripción:</span>
                <p className="font-medium text-slate-800">{selectedAlerta.mensaje}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedAlerta(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
              {canResolve && !selectedAlerta.resuelta && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleResolve(selectedAlerta.id)}
                  className="rounded-md bg-[#133863] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
                >
                  {isPending ? "Resolviendo..." : "Marcar como resuelta"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
