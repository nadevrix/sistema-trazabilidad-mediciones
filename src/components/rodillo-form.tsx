"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRodillo, updateRodillo } from "@/lib/actions/rodillos";

interface RodilloFormData {
  id?: string;
  codigo?: string;
  nombre?: string | null;
  ubicacion?: string | null;
  molino?: string;
  posicion?: string;
  diametroOriginal?: number;
  diametroMinimo?: number;
  diametroActual?: number;
  estado?: string;
  campania?: string | null;
  notas?: string | null;
}

export function RodilloForm({ rodillo }: { rodillo?: RodilloFormData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const editing = !!rodillo?.id;

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const result = editing ? await updateRodillo(fd) : await createRodillo(fd);
          if (!result.ok) {
            setError(result.error);
          } else {
            router.push("/rodillos");
            router.refresh();
          }
        });
      }}
    >
      {editing && <input type="hidden" name="id" value={rodillo.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Código *
          </label>
          <input
            name="codigo"
            required
            defaultValue={rodillo?.codigo ?? ""}
            placeholder="ej: R-01"
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Nombre descriptivo
          </label>
          <input
            name="nombre"
            defaultValue={rodillo?.nombre ?? ""}
            placeholder="ej: Rodillo 1"
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Ubicación *
          </label>
          <input
            name="ubicacion"
            required
            defaultValue={rodillo?.ubicacion ?? rodillo?.molino ?? "Tren 1"}
            placeholder="ej: Tren 1"
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Estado *
          </label>
          <select
            name="estado"
            defaultValue={rodillo?.estado ?? "EN_OPERACION"}
            className="input"
          >
            <option value="EN_OPERACION">En operación</option>
            <option value="EN_REVISION">En revisión</option>
            <option value="FUERA_RANGO">Fuera de rango</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Diámetro Original (mm)
          </label>
          <input
            name="diametroOriginal"
            type="number"
            step="0.1"
            defaultValue={rodillo?.diametroOriginal ?? 620}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Diámetro Mínimo (mm)
          </label>
          <input
            name="diametroMinimo"
            type="number"
            step="0.1"
            defaultValue={rodillo?.diametroMinimo ?? 560}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Diámetro Actual (mm)
          </label>
          <input
            name="diametroActual"
            type="number"
            step="0.1"
            defaultValue={rodillo?.diametroActual ?? 612}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Posición de maza
          </label>
          <input
            name="posicion"
            defaultValue={rodillo?.posicion ?? "Maza Superior"}
            placeholder="Superior, Cañera, Bagacera"
            className="input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Observaciones o notas
          </label>
          <textarea
            name="notas"
            rows={2}
            defaultValue={rodillo?.notas ?? ""}
            placeholder="Opcional..."
            className="input"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Link
          href="/rodillos"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#133863] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
        >
          {pending ? "Guardando..." : editing ? "Guardar cambios" : "Guardar rodillo"}
        </button>
      </div>
    </form>
  );
}
