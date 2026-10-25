"use client";

import { useState, useActionState } from "react";
import { loginAction, type LoginResult } from "@/lib/actions/auth";

const initial: LoginResult | undefined = undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <form action={action} className="space-y-4">
      {/* Usuario */}
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Usuario
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          defaultValue="admin"
          className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0c2340] focus:outline-none focus:ring-1 focus:ring-[#0c2340]"
          placeholder="Ingresa tu usuario"
        />
      </div>

      {/* Contraseña */}
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            defaultValue="Admin123!"
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0c2340] focus:outline-none focus:ring-1 focus:ring-[#0c2340]"
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Recordar usuario checkbox */}
      <div className="flex items-center pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
          <input
            type="checkbox"
            name="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#0c2340] focus:ring-[#0c2340]"
          />
          <span>Recordar usuario</span>
        </label>
      </div>

      {state && !state.ok && (
        <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {state.error}
        </div>
      )}

      {/* Iniciar sesión submit button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[#0c2340] px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-[#133863] focus:outline-none focus:ring-2 focus:ring-[#0c2340]/40 disabled:opacity-60 transition-colors"
      >
        {pending ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      {/* Forgot password link */}
      <div className="text-center pt-2">
        <a
          href="#olvide-contrasena"
          onClick={(e) => {
            e.preventDefault();
            alert("Para restablecer tu contraseña, contacta al administrador del sistema.");
          }}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  );
}
