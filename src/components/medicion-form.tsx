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
      className="grid gap-3 rounded-lg border border-[#d9cdc0] bg-white p-4 shadow-sm sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const result = editing ? await updateMedicion(fd) : await createMedicion(fd);
          if (!result.ok) setError(result.error);
          else router.push("/mediciones");
        });
      }}
    >
      {editing && <input type="hidden" name="id" value={medicion.id} />}

      <label className="sm:col-span-2 block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Rodillo</span>
        <select
          name="rodilloId"
          required
          className="input"
          defaultValue={medicion?.rodilloId ?? ""}
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {rodillos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.codigo} · {r.molino} · {r.posicion} (actual {r.diametroActual} mm / mín{" "}
              {r.diametroMinimo} mm)
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Diámetro (mm) *</span>
        <input
          name="diametro"
          type="number"
          step="0.1"
          required
          defaultValue={medicion?.diametro ?? ""}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Prof. ranura (mm)</span>
        <input
          name="profundidadRanura"
          type="number"
          step="0.1"
          defaultValue={medicion?.profundidadRanura ?? ""}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Ángulo ranura (°)</span>
        <input
          name="anguloRanura"
          type="number"
          step="0.1"
          defaultValue={medicion?.anguloRanura ?? ""}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Horas operación</span>
        <input
          name="horasOperacion"
          type="number"
          step="0.1"
          defaultValue={medicion?.horasOperacion ?? ""}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Toneladas</span>
        <input
          name="toneladas"
          type="number"
          step="0.1"
          defaultValue={medicion?.toneladas ?? ""}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Temp. bronce (°C)</span>
        <input
          name="temperaturaBronce"
          type="number"
          step="0.1"
          defaultValue={medicion?.temperaturaBronce ?? ""}
          className="input"
        />
      </label>
      <label className="sm:col-span-2 block text-sm">
        <span className="mb-1 block font-medium text-[#5c4d44]">Observaciones</span>
        <textarea
          name="observaciones"
          rows={3}
          defaultValue={medicion?.observaciones ?? ""}
          className="input"
        />
      </label>

      {error && <p className="sm:col-span-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded bg-[#8b1528] px-4 py-2.5 font-medium text-white hover:bg-[#6f1020] disabled:opacity-60"
      >
        {pending ? "Guardando..." : editing ? "Guardar cambios" : "Guardar medición"}
      </button>
    </form>
  );
}
