import type { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  SUPERVISOR: "Supervisor",
  OPERADOR: "Operador",
};

export const ALL_ROLES: Role[] = ["ADMIN", "SUPERVISOR", "OPERADOR"];

/** Quién puede entrar al panel de usuarios */
export function canManageUsers(role: Role) {
  return role === "ADMIN";
}

/** Quién puede registrar mediciones */
export function canCreateMedicion(role: Role) {
  return role === "ADMIN" || role === "SUPERVISOR" || role === "OPERADOR";
}

/** Quién puede crear/editar rodillos */
export function canManageRodillos(role: Role) {
  return role === "ADMIN" || role === "SUPERVISOR";
}

/** Quién puede resolver alertas */
export function canResolveAlertas(role: Role) {
  return role === "ADMIN" || role === "SUPERVISOR";
}

/** Quién puede editar/eliminar mediciones */
export function canManageMediciones(role: Role) {
  return role === "ADMIN" || role === "SUPERVISOR";
}
