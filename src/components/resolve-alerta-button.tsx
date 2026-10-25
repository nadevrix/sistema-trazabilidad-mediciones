"use client";

import { useTransition } from "react";
import { resolveAlerta } from "@/lib/actions/alertas";

export function ResolveAlertaButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => { await resolveAlerta(id); })}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
    >
      {pending ? "..." : "Marcar resuelta"}
    </button>
  );
}
