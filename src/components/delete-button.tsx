"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Result = { ok: true } | { ok: false; error: string };

export function DeleteButton({
  label = "Eliminar",
  confirmMessage,
  onDelete,
  redirectTo,
  className,
}: {
  label?: string;
  confirmMessage: string;
  onDelete: () => Promise<Result>;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        className={
          className ??
          "rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
        }
        onClick={() => {
          if (!window.confirm(confirmMessage)) return;
          setError(null);
          start(async () => {
            const result = await onDelete();
            if (!result.ok) {
              setError(result.error);
              return;
            }
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
          });
        }}
      >
        {pending ? "..." : label}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
