"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMedicion } from "@/lib/actions/mediciones";

interface RodilloItem {
  id: string;
  codigo: string;
  nombre: string | null;
  ubicacion: string | null;
}

interface RangoItem {
  parametro: string;
  minimo: number;
  maximo: number;
  unidad: string;
}

export function RegistroMedicionView({
  rodillos,
  rangos,
}: {
  rodillos: RodilloItem[];
  rangos: RangoItem[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, start] = useTransition();

  const [selectedParametro, setSelectedParametro] = useState("Diámetro");
  const [valor, setValor] = useState<string>("");
  const [fechaHora, setFechaHora] = useState(() => {
    // Current ISO string formatted for datetime-local input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Calculate live validation against the active parameter's range
  const currentRango = rangos.find((r) => r.parametro === selectedParametro);
  const numVal = parseFloat(valor);
  const hasValue = !isNaN(numVal) && valor !== "";
  const isOutOfRange =
    currentRango && hasValue
      ? numVal < currentRango.minimo || numVal > currentRango.maximo
      : false;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSuccess(false);

    start(async () => {
      const result = await createMedicion(fd);
      if (!result.ok) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/historial");
          router.refresh();
        }, 800);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Registrar medición
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ingresa los datos de la medición del rodillo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Card (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rodillo selector */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Rodillo *
              </label>
              <select
                name="rodilloId"
                required
                defaultValue=""
                className="input"
              >
                <option value="" disabled>
                  Selecciona un rodillo
                </option>
                {rodillos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.codigo} - {r.nombre || `Rodillo ${r.codigo}`} ({r.ubicacion || "Tren 1"})
                  </option>
                ))}
              </select>
            </div>

            {/* Parámetro selector */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Parámetro *
              </label>
              <select
                name="parametro"
                required
                value={selectedParametro}
                onChange={(e) => setSelectedParametro(e.target.value)}
                className="input"
              >
                <option value="Diámetro">Diámetro</option>
                <option value="Desgaste">Desgaste</option>
                <option value="Conicidad">Conicidad</option>
              </select>
            </div>

            {/* Valor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Valor *
                </label>
                {currentRango && (
                  <span className="text-[11px] text-slate-400">
                    Rango admisible: {currentRango.minimo} - {currentRango.maximo} {currentRango.unidad}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  name="valor"
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ingresa el valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className={`input pr-12 ${
                    hasValue && isOutOfRange
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : hasValue
                      ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                      : ""
                  }`}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 pointer-events-none">
                  {currentRango?.unidad || "mm"}
                </span>
              </div>

              {/* Real-time validation warning */}
              {hasValue && isOutOfRange && (
                <p className="mt-1 text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Valor fuera del rango técnico especificado. Se generará una alerta de desviación.
                </p>
              )}
            </div>

            {/* Fecha y hora */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Fecha y hora *
              </label>
              <div className="relative">
                <input
                  name="fecha"
                  type="datetime-local"
                  required
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                rows={3}
                placeholder="Opcional"
                className="input"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
                ✓ Medición registrada exitosamente. Redirigiendo al historial...
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/dashboard"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={pending || success}
                className="rounded-md bg-[#133863] px-6 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
              >
                {pending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Rangos técnicos (referencia) (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Rangos técnicos (referencia)
          </h2>
          <p className="text-[11px] text-slate-500 mb-4">
            Límites tolerables de control dimensional
          </p>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Parámetro</th>
                  <th className="py-2.5 px-3">Mínimo</th>
                  <th className="py-2.5 px-3">Máximo</th>
                  <th className="py-2.5 px-3 text-right">Unidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rangos.map((rg) => {
                  const isCurrent = rg.parametro === selectedParametro;
                  return (
                    <tr
                      key={rg.parametro}
                      className={
                        isCurrent
                          ? "bg-blue-50/70 font-semibold text-blue-900"
                          : "hover:bg-slate-50/60 text-slate-700"
                      }
                    >
                      <td className="py-2.5 px-3 flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        )}
                        <span>{rg.parametro}</span>
                      </td>
                      <td className="py-2.5 px-3">{rg.minimo}</td>
                      <td className="py-2.5 px-3">{rg.maximo}</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-medium">
                        {rg.unidad}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-3.5 border border-slate-200/60 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">Criterio de validación:</p>
            <p>
              • Toda lectura que exceda o caiga por debajo de estos umbrales se
              clasificará de inmediato como <span className="text-amber-700 font-medium">Fuera de rango</span> y generará una alerta activa en el panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
