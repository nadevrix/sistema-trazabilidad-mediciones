"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";

const rangoItemSchema = z.object({
  id: z.string().optional(),
  parametro: z.string().min(1),
  minimo: z.coerce.number(),
  maximo: z.coerce.number(),
  unidad: z.string().default("mm"),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateRangosTecnicos(
  items: Array<{ parametro: string; minimo: number; maximo: number; unidad: string }>
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || !canManageRodillos(session.user.role)) {
      return { ok: false, error: "No autorizado para modificar configuración técnica" };
    }

    for (const item of items) {
      const parsed = rangoItemSchema.safeParse(item);
      if (!parsed.success) {
        return { ok: false, error: "Datos de rango inválidos" };
      }

      await prisma.rangoTecnico.upsert({
        where: { parametro: parsed.data.parametro },
        update: {
          minimo: parsed.data.minimo,
          maximo: parsed.data.maximo,
          unidad: parsed.data.unidad,
        },
        create: {
          parametro: parsed.data.parametro,
          minimo: parsed.data.minimo,
          maximo: parsed.data.maximo,
          unidad: parsed.data.unidad,
        },
      });
    }

    revalidatePath("/configuracion");
    revalidatePath("/mediciones/nueva");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar rangos técnicos",
    };
  }
}
