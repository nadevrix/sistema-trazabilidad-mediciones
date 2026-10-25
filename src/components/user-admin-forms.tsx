"use client";

import { useState, useTransition } from "react";
import type { Role, User } from "@prisma/client";
import { createUser, updateUser } from "@/lib/actions/users";
import { ROLE_LABELS, ALL_ROLES } from "@/lib/roles";

type SafeUser = Omit<User, "passwordHash">;

export function CreateUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        setOk(false);
        start(async () => {
          const result = await createUser(fd);
          if (!result.ok) {
            setError(result.error);
          } else {
            setOk(true);
            e.currentTarget.reset();
          }
        });
      }}
    >
      <div className="sm:col-span-2">
        <h2 className="text-sm font-bold text-slate-900">
          Crear nuevo usuario
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Asigna credenciales y rol para el ingreso al sistema
        </p>
      </div>

      <input name="name" required placeholder="Nombre completo" className="input text-xs" />
      <input name="username" required placeholder="Usuario (login)" className="input text-xs" />
      <input
        name="password"
        type="password"
        required
        placeholder="Contraseña inicial"
        className="input text-xs"
      />
      <input name="email" type="email" placeholder="Email (opcional)" className="input text-xs" />
      <select name="role" defaultValue="OPERADOR" className="input text-xs">
        {ALL_ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#133863] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0c2442] disabled:opacity-60 transition-colors"
      >
        {pending ? "Guardando..." : "Crear usuario"}
      </button>

      {error && <p className="sm:col-span-2 text-xs text-red-600">{error}</p>}
      {ok && <p className="sm:col-span-2 text-xs text-emerald-600">✓ Usuario creado exitosamente.</p>}
    </form>
  );
}

export function EditUserRow({ user }: { user: SafeUser }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  return (
    <form
      className="grid gap-2 py-3 sm:grid-cols-6 sm:items-center text-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        setSaved(false);
        start(async () => {
          const result = await updateUser(fd);
          if (!result.ok) {
            setError(result.error);
          } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }
        });
      }}
    >
      <input type="hidden" name="id" value={user.id} />
      <div className="sm:col-span-2">
        <p className="font-semibold text-slate-900">@{user.username}</p>
        <input name="name" defaultValue={user.name} required className="input text-xs mt-1 py-1" />
      </div>
      <select name="role" defaultValue={user.role} className="input text-xs py-1">
        {ALL_ROLES.map((role: Role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      <select name="active" defaultValue={String(user.active)} className="input text-xs py-1">
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>
      <input
        name="password"
        type="password"
        placeholder="Nueva contraseña"
        className="input text-xs py-1"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : saved ? "✓ Guardado" : "Guardar"}
      </button>
      {error && <p className="sm:col-span-6 text-xs text-red-600">{error}</p>}
    </form>
  );
}
