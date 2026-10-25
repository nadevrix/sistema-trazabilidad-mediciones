"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { deleteRodillo } from "@/lib/actions/rodillos";

interface RodilloItem {
  id: string;
  codigo: string;
  nombre: string | null;
  ubicacion: string | null;
  molino: string;
  posicion: string;
  diametroActual: number;
  diametroMinimo: number;
  estado: string;
}

export function RodillosTable({
  rodillos,
  canManage,
}: {
  rodillos: RodilloItem[];
  canManage: boolean;
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rodillos;
    return rodillos.filter(
      (r) =>
        r.codigo.toLowerCase().includes(q) ||
        (r.nombre && r.nombre.toLowerCase().includes(q)) ||
        (r.ubicacion && r.ubicacion.toLowerCase().includes(q))
    );
  }, [rodillos, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (estado: string) => {
    if (estado === "EN_OPERACION" || estado === "EN_SERVICIO") {
      return (
        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
          En operación
        </span>
      );
    }
    if (estado === "EN_REVISION" || estado === "TALLER") {
      return (
        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/60">
          En revisión
        </span>
      );
    }
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-200/60">
        Fuera de rango
      </span>
    );
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el rodillo ${codigo}?`)) {
      await deleteRodillo(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por código o nombre..."
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-500 font-semibold">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {r.codigo}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {r.nombre || `Rodillo ${r.codigo.replace("R-", "")}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {r.ubicacion || r.molino}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(r.estado)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {/* View icon */}
                      <Link
                        href={`/rodillos/${r.id}`}
                        className="rounded p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      {canManage && (
                        <>
                          {/* Edit icon */}
                          <Link
                            href={`/rodillos/${r.id}/editar`}
                            className="rounded p-1 text-slate-400 hover:text-amber-600 transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>

                          {/* Delete icon */}
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.codigo)}
                            className="rounded p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No se encontraron rodillos con ese criterio de búsqueda.
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
              {filtered.length === 0 ? 0 : startIndex + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + pageSize, filtered.length)}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
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
    </div>
  );
}
