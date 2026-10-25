"use server";

import { revalidatePath } from "next/cache";
import { EstadoRodillo } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";

const rodilloSchema = z.object({
  codigo: z.string().min(1),
  nombre: z.string().optional(),
  ubicacion: z.string().optional(),
  molino: z.string().optional(),
  posicion: z.string().optional(),
  diametroOriginal: z.coerce.number().positive().default(620),
  diametroMinimo: z.coerce.number().positive().default(560),
  diametroActual: z.coerce.number().positive().default(612),
  estado: z.nativeEnum(EstadoRodillo).default(EstadoRodillo.EN_OPERACION),
  campania: z.string().optional(),
  notas: z.string().optional(),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireManager() {
  const session = await auth();
  if (!session?.user || !canManageRodillos(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session;
}

export async function createRodillo(formData: FormData): Promise<ActionResult> {
  try {
    await requireManager();

    const ubicacion = String(formData.get("ubicacion") || formData.get("molino") || "Tren 1");
    const rawEstado = String(formData.get("estado") || "EN_OPERACION");
    
    // Map human readable or enum string
    let estadoEnum: EstadoRodillo = EstadoRodillo.EN_OPERACION;
    if (rawEstado === "EN_REVISION" || rawEstado === "TALLER") estadoEnum = EstadoRodillo.EN_REVISION;
    else if (rawEstado === "FUERA_RANGO" || rawEstado === "FUERA_USO") estadoEnum = EstadoRodillo.FUERA_RANGO;

    const parsed = rodilloSchema.safeParse({
      codigo: formData.get("codigo"),
      nombre: formData.get("nombre") || `Rodillo ${formData.get("codigo")}`,
      ubicacion,
      molino: formData.get("molino") || ubicacion,
      posicion: formData.get("posicion") || "Maza Superior",
      diametroOriginal: formData.get("diametroOriginal") || 620,
      diametroMinimo: formData.get("diametroMinimo") || 560,
      diametroActual: formData.get("diametroActual") || 612,
      estado: estadoEnum,
      campania: formData.get("campania") || undefined,
      notas: formData.get("notas") || undefined,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const codigo = parsed.data.codigo.trim().toUpperCase();
    const exists = await prisma.rodillo.findUnique({ where: { codigo } });
    if (exists) {
      return { ok: false, error: "Ya existe un rodillo con ese código" };
    }

    await prisma.rodillo.create({
      data: {
        codigo,
        nombre: parsed.data.nombre || `Rodillo ${codigo}`,
        ubicacion: parsed.data.ubicacion || "Tren 1",
        molino: parsed.data.molino || "Tren 1",
        posicion: parsed.data.posicion || "Maza Superior",
        diametroOriginal: parsed.data.diametroOriginal,
        diametroMinimo: parsed.data.diametroMinimo,
        diametroActual: parsed.data.diametroActual,
        estado: parsed.data.estado,
        campania: parsed.data.campania || null,
        notas: parsed.data.notas || null,
      },
    });

    revalidatePath("/rodillos");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear rodillo" };
  }
}

export async function updateRodillo(formData: FormData): Promise<ActionResult> {
  try {
    await requireManager();

    const id = String(formData.get("id") ?? "");
    if (!id) return { ok: false, error: "ID inválido" };

    const ubicacion = String(formData.get("ubicacion") || formData.get("molino") || "Tren 1");
    const rawEstado = String(formData.get("estado") || "EN_OPERACION");

    let estadoEnum: EstadoRodillo = EstadoRodillo.EN_OPERACION;
    if (rawEstado === "EN_REVISION" || rawEstado === "TALLER") estadoEnum = EstadoRodillo.EN_REVISION;
    else if (rawEstado === "FUERA_RANGO" || rawEstado === "FUERA_USO") estadoEnum = EstadoRodillo.FUERA_RANGO;

    const parsed = rodilloSchema.safeParse({
      codigo: formData.get("codigo"),
      nombre: formData.get("nombre") || `Rodillo ${formData.get("codigo")}`,
      ubicacion,
      molino: formData.get("molino") || ubicacion,
      posicion: formData.get("posicion") || "Maza Superior",
      diametroOriginal: formData.get("diametroOriginal") || 620,
      diametroMinimo: formData.get("diametroMinimo") || 560,
      diametroActual: formData.get("diametroActual") || 612,
      estado: estadoEnum,
      campania: formData.get("campania") || undefined,
      notas: formData.get("notas") || undefined,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const codigo = parsed.data.codigo.trim().toUpperCase();
    const duplicate = await prisma.rodillo.findFirst({
      where: { codigo, NOT: { id } },
    });
    if (duplicate) {
      return { ok: false, error: "Ya existe otro rodillo con ese código" };
    }

    await prisma.rodillo.update({
      where: { id },
      data: {
        codigo,
        nombre: parsed.data.nombre || `Rodillo ${codigo}`,
        ubicacion: parsed.data.ubicacion || "Tren 1",
        molino: parsed.data.molino || "Tren 1",
        posicion: parsed.data.posicion || "Maza Superior",
        diametroOriginal: parsed.data.diametroOriginal,
        diametroMinimo: parsed.data.diametroMinimo,
        diametroActual: parsed.data.diametroActual,
        estado: parsed.data.estado,
        campania: parsed.data.campania || null,
        notas: parsed.data.notas || null,
      },
    });

    revalidatePath("/rodillos");
    revalidatePath(`/rodillos/${id}`);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar rodillo" };
  }
}

export async function deleteRodillo(id: string): Promise<ActionResult> {
  try {
    await requireManager();

    await prisma.rodillo.delete({ where: { id } });

    revalidatePath("/rodillos");
    revalidatePath("/mediciones");
    revalidatePath("/alertas");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar rodillo" };
  }
}
