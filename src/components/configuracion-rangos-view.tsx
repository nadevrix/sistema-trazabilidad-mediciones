"use client";

import { useState, useTransition } from "react";
import { updateRangosTecnicos } from "@/lib/actions/configuracion";

interface RangoRow {
  parametro: string;
  minimo: number;
  maximo: number;
  unidad: string;
}

export function ConfiguracionRangosView({
  initialRangos,
  canEdit,
}: {
  initialRangos: RangoRow[];
  canEdit: boolean;
}) {
  const [rangos, setRangos] = useState<RangoRow[]>(initialRangos);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handleValueChange = (
    index: number,
    field: "minimo" | "maximo" | "unidad",
    value: string
  ) => {
    setRangos((prev) => {
      const next = [...prev];
      if (field === "unidad") {
        next[index] = { ...next[index], unidad: value };
      } else {
        const num = parseFloat(value);
        next[index] = { ...next[index], [field]: isNaN(num) ? 0 : num };
      }
      return next;
    });
  };

  const handleSave = () => {
    setMessage(null);
    start(async () => {
      const res = await updateRangosTecnicos(rangos);
      if (res.ok) {
        setMessage({ text: "Rangos técnicos actualizados correctamente.", ok: true });
        setEditingIndex(null);
      } else {
        setMessage({ text: res.error, ok: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Configuración de rangos técnicos
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Define los valores de referencia para cada parámetro
        </p>
      </div>

      {message && (
        <div
          className={`rounded-md p-3 text-xs border ${
            message.ok
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-500 font-semibold">
                <th className="py-3 px-4">Parámetro</th>
                <th className="py-3 px-4">Mínimo</th>
                <th className="py-3 px-4">Máximo</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rangos.map((r, index) => {
                const isEditing = editingIndex === index || editingIndex === -1;
                return (
                  <tr key={r.parametro} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {r.parametro}
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing && canEdit ? (
                        <input
                          type="number"
                          step="0.1"
                          value={r.minimo}
                          onChange={(e) => handleValueChange(index, "minimo", e.target.value)}
                          className="w-24 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      ) : (
                        <span className="text-slate-800 font-medium">{r.minimo}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing && canEdit ? (
                        <input
                          type="number"
                          step="0.1"
                          value={r.maximo}
                          onChange={(e) => handleValueChange(index, "maximo", e.target.value)}
                          className="w-24 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      ) : (
                        <span className="text-slate-800 font-medium">{r.maximo}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing && canEdit ? (
                        <input
                          type="text"
                          value={r.unidad}
                          onChange={(e) => handleValueChange(index, "unidad", e.target.value)}
                          className="w-16 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      ) : (
                        <span className="text-slate-500 font-medium">{r.unidad}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          className={`rounded p-1 transition-colors ${
                            isEditing
                              ? "text-blue-600 bg-blue-50"
                              : "text-slate-400 hover:text-blue-600"
                          }`}
                          title={isEditing ? "Finalizar edición de fila" : "Editar fila"}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer with Guardar cambios button */}
        {canEdit && (
          <div className="flex items-center justify-end border-t border-slate-200 px-4 py-3 bg-white">
            <button
              type="button"
              disabled={pending}
              onClick={handleSave}
              className="rounded-md bg-[#133863] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
            >
              {pending ? "Guardando cambios..." : "Guardar cambios"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
