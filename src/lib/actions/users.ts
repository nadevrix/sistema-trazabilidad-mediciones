"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/roles";

const createUserSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  username: z
    .string()
    .min(3, "Usuario mínimo 3 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Solo letras, números, punto, guión o guión bajo"),
  password: z.string().min(6, "Contraseña mínimo 6 caracteres"),
  role: z.nativeEnum(Role),
  email: z.string().email().optional().or(z.literal("")),
});

const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  role: z.nativeEnum(Role),
  active: z.boolean(),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6).optional().or(z.literal("")),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = createUserSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
      role: formData.get("role"),
      email: formData.get("email") || "",
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const username = parsed.data.username.trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return { ok: false, error: "Ese usuario ya existe" };
    }

    const passwordHash = await hash(parsed.data.password, 12);

    await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        username,
        passwordHash,
        role: parsed.data.role,
        email: parsed.data.email || null,
      },
    });

    revalidatePath("/admin/usuarios");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear usuario" };
  }
}

export async function updateUser(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAdmin();

    const parsed = updateUserSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      role: formData.get("role"),
      active: formData.get("active") === "true",
      email: formData.get("email") || "",
      password: formData.get("password") || "",
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    if (parsed.data.id === session.user.id && !parsed.data.active) {
      return { ok: false, error: "No podés desactivar tu propio usuario" };
    }

    if (parsed.data.id === session.user.id && parsed.data.role !== "ADMIN") {
      return { ok: false, error: "No podés quitarte el rol de administrador" };
    }

    const data: {
      name: string;
      role: Role;
      active: boolean;
      email: string | null;
      passwordHash?: string;
    } = {
      name: parsed.data.name.trim(),
      role: parsed.data.role,
      active: parsed.data.active,
      email: parsed.data.email || null,
    };

    if (parsed.data.password) {
      data.passwordHash = await hash(parsed.data.password, 12);
    }

    await prisma.user.update({
      where: { id: parsed.data.id },
      data,
    });

    revalidatePath("/admin/usuarios");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar usuario" };
  }
}
