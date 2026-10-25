"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface HistorialMedicion {
  id: string;
  fecha: string;
  rawDate: string;
  rodilloCodigo: string;
  rodilloNombre: string | null;
  rodilloId: string;
  parametro: string;
  valor: number;
  unidad: string;
  estado: string;
  usuarioNombre: string;
}

interface RodilloOption {
  id: string;
  codigo: string;
  nombre: string | null;
}

export function HistorialView({
  mediciones,
  rodillos,
}: {
  mediciones: HistorialMedicion[];
  rodillos: RodilloOption[];
}) {
  const [selectedRodillo, setSelectedRodillo] = useState<string>("todos");
  const [selectedParametro, setSelectedParametro] = useState<string>("todos");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState({
    rodillo: "todos",
    parametro: "todos",
    desde: "",
    hasta: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const availableParametros = useMemo(() => {
    const list = Array.from(new Set(mediciones.map((m) => m.parametro)));
    return list.length > 0 ? list : ["Diámetro", "Desgaste", "Conicidad"];
  }, [mediciones]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilters({
      rodillo: selectedRodillo,
      parametro: selectedParametro,
      desde: fechaDesde,
      hasta: fechaHasta,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedRodillo("todos");
    setSelectedParametro("todos");
    setFechaDesde("");
    setFechaHasta("");
    setActiveFilters({
      rodillo: "todos",
      parametro: "todos",
      desde: "",
      hasta: "",
    });
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return mediciones.filter((m) => {
      if (
        activeFilters.rodillo !== "todos" &&
        m.rodilloCodigo !== activeFilters.rodillo
      ) {
        return false;
      }
      if (
        activeFilters.parametro !== "todos" &&
        m.parametro !== activeFilters.parametro
      ) {
        return false;
      }
      if (activeFilters.desde) {
        const itemDate = m.rawDate.slice(0, 10);
        if (itemDate < activeFilters.desde) return false;
      }
      if (activeFilters.hasta) {
        const itemDate = m.rawDate.slice(0, 10);
        if (itemDate > activeFilters.hasta) return false;
      }
      return true;
    });
  }, [mediciones, activeFilters]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    activeFilters.rodillo !== "todos" ||
    activeFilters.parametro !== "todos" ||
    activeFilters.desde !== "" ||
    activeFilters.hasta !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Historial de mediciones
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consulta el historial de mediciones por rodillo, parámetro y fecha
        </p>
      </div>

      {/* Filter Bar (Card) */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
          {/* Rodillo filter */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Rodillo
            </label>
            <select
              value={selectedRodillo}
              onChange={(e) => setSelectedRodillo(e.target.value)}
              className="input text-xs py-2"
            >
              <option value="todos">Todos</option>
              {rodillos.map((r) => (
                <option key={r.id} value={r.codigo}>
                  {r.codigo} {r.nombre ? `(${r.nombre})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Parámetro filter */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Parámetro
            </label>
            <select
              value={selectedParametro}
              onChange={(e) => setSelectedParametro(e.target.value)}
              className="input text-xs py-2"
            >
              <option value="todos">Todos</option>
              {availableParametros.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha Desde */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="input text-xs py-2"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="input text-xs py-2"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-md bg-[#133863] py-2 px-3 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar</span>
            </button>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveFilters && !fechaDesde && !fechaHasta && selectedRodillo === "todos" && selectedParametro === "todos"}
              className="w-full flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-500 font-semibold">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Rodillo</th>
                <th className="py-3 px-4">Parámetro</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4">Registrado por</th>
                <th className="py-3 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((m) => {
                const isNormal = m.estado === "Normal";
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600">
                      {m.fecha}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <Link
                        href={`/rodillos/${m.rodilloId}`}
                        className="text-blue-700 hover:underline"
                      >
                        {m.rodilloCodigo}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {m.parametro}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {m.valor}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {m.unidad}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {m.usuarioNombre}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          isNormal
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-red-50 text-red-700 border border-red-200/60"
                        }`}
                      >
                        {isNormal ? "Normal" : "Fuera de rango"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron mediciones para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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
