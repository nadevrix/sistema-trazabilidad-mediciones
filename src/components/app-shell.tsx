"use client";

import { useState } from "react";
import Link from "next/link";
import type { Role } from "@prisma/client";
import { logoutAction } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { BrandIcon, BrandLogo } from "@/components/brand-logo";
import { NavLinks } from "@/components/nav-links";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    username: string;
    role: Role;
  };
  alertasCount?: number;
}

export function AppShell({ children, user, alertasCount = 0 }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // User initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "JP";

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#0b1d33] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrandLogo size="md" light={true} showSubtitle={false} />
          </Link>
          <button
            type="button"
            className="rounded p-1 text-slate-400 hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto">
          <NavLinks
            isAdmin={user.role === "ADMIN"}
            alertasCount={alertasCount}
            onLinkClick={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Sidebar Footer info */}
        <div className="border-t border-white/10 p-3 text-center">
          <p className="text-[10px] text-slate-400">
            Ingenios Azucareros © 2025
          </p>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar: Dark navy on mobile (matching reference phone mockup), white on desktop */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-[#1b3350] lg:border-slate-200 bg-[#0b1d33] lg:bg-white px-3 sm:px-4 md:px-8 shadow-xs">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md p-1.5 text-slate-200 hover:text-white hover:bg-white/10 lg:text-slate-600 lg:hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Centered Mobile Title (as shown in phone mockup) */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <BrandIcon className="w-5 h-5" light={true} />
            <span className="text-sm font-bold tracking-tight text-white">Trazabilidad</span>
          </div>

          {/* Right Header: Alerts Bell & User Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Notification Bell */}
            <Link
              href="/alertas"
              className="relative p-2 text-slate-200 hover:text-white lg:text-slate-500 lg:hover:text-slate-800 transition-colors"
              title="Ver alertas"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {alertasCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#0b1d33] lg:ring-white" />
              )}
            </Link>

            {/* User Profile Info & Avatar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none"
              >
                {/* Circular Avatar */}
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#1b4372] text-xs font-bold text-white shadow-xs ring-1 ring-white/20 lg:ring-transparent">
                  {initials}
                </div>
                {/* Name & Role */}
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-white lg:text-slate-800 leading-tight">
                    {user.name || "Usuario"}
                  </p>
                  <p className="text-[11px] text-slate-300 lg:text-slate-500">
                    {ROLE_LABELS[user.role] ?? "Administrador"}
                  </p>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{ROLE_LABELS[user.role]}</p>
                  </div>
                  <Link
                    href="/configuracion"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Configuración
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/usuarios"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Usuarios y roles
                    </Link>
                  )}
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
