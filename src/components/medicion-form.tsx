"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMedicion, updateMedicion } from "@/lib/actions/mediciones";

type RodilloOption = {
  id: string;
  codigo: string;
  molino: string;
  posicion: string;
  diametroActual: number;
  diametroMinimo: number;
};

type MedicionInput = {
  id: string;
  rodilloId: string;
  diametro: number;
  profundidadRanura: number | null;
  anguloRanura: number | null;
  horasOperacion: number | null;
  toneladas: number | null;
  temperaturaBronce: number | null;
  observaciones: string | null;
};

export function MedicionForm({
  rodillos,
  medicion,
}: {
  rodillos: RodilloOption[];
  medicion?: MedicionInput;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const editing = !!medicion;

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:grid-cols-2 text-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const result = editing ? await updateMedicion(fd) : await createMedicion(fd);
          if (!result.ok) {
            setError(result.error);
          } else {
            router.push("/historial");
            router.refresh();
          }
        });
      }}
    >
      {editing && <input type="hidden" name="id" value={medicion.id} />}

      <label className="sm:col-span-2 block">
        <span className="mb-1 block font-semibold text-slate-700">Rodillo *</span>
        <select
          name="rodilloId"
          required
          className="input"
          defaultValue={medicion?.rodilloId ?? ""}
        >
          <option value="" disabled>
            Seleccionar rodillo...
          </option>
          {rodillos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.codigo} · {r.molino} · {r.posicion} (actual {r.diametroActual} mm / mín {r.diametroMinimo} mm)
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Diámetro (mm) *</span>
        <input
          name="diametro"
          type="number"
          step="0.1"
          required
          defaultValue={medicion?.diametro ?? ""}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Prof. ranura (mm)</span>
        <input
          name="profundidadRanura"
          type="number"
          step="0.1"
          defaultValue={medicion?.profundidadRanura ?? ""}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Ángulo ranura (°)</span>
        <input
          name="anguloRanura"
          type="number"
          step="0.1"
          defaultValue={medicion?.anguloRanura ?? ""}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Horas operación</span>
        <input
          name="horasOperacion"
          type="number"
          step="0.1"
          defaultValue={medicion?.horasOperacion ?? ""}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Toneladas</span>
        <input
          name="toneladas"
          type="number"
          step="0.1"
          defaultValue={medicion?.toneladas ?? ""}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-semibold text-slate-700">Temp. bronce (°C)</span>
        <input
          name="temperaturaBronce"
          type="number"
          step="0.1"
          defaultValue={medicion?.temperaturaBronce ?? ""}
          className="input"
        />
      </label>

      <label className="sm:col-span-2 block">
        <span className="mb-1 block font-semibold text-slate-700">Observaciones</span>
        <textarea
          name="observaciones"
          rows={3}
          defaultValue={medicion?.observaciones ?? ""}
          className="input"
          placeholder="Opcional..."
        />
      </label>

      {error && (
        <div className="sm:col-span-2 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#133863] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
        >
          {pending ? "Guardando..." : editing ? "Guardar cambios" : "Guardar medición"}
        </button>
      </div>
    </form>
  );
}
