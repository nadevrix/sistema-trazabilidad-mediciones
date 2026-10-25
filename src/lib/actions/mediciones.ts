"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canCreateMedicion, canManageMediciones } from "@/lib/roles";

const medicionSchema = z.object({
  rodilloId: z.string().min(1, "Selecciona un rodillo"),
  parametro: z.string().min(1, "Selecciona un parámetro"),
  valor: z.coerce.number().min(0, "Ingresa un valor válido"),
  fecha: z.coerce.date().default(() => new Date()),
  observaciones: z.string().optional(),
  profundidadRanura: z.coerce.number().optional().nullable(),
  anguloRanura: z.coerce.number().optional().nullable(),
  horasOperacion: z.coerce.number().optional().nullable(),
  toneladas: z.coerce.number().optional().nullable(),
  temperaturaBronce: z.coerce.number().optional().nullable(),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createMedicion(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || !canCreateMedicion(session.user.role)) {
      return { ok: false, error: "No autorizado" };
    }

    const rawFecha = formData.get("fecha");
    const parsed = medicionSchema.safeParse({
      rodilloId: formData.get("rodilloId"),
      parametro: formData.get("parametro") || "Diámetro",
      valor: formData.get("valor") ?? formData.get("diametro"),
      fecha: rawFecha ? new Date(String(rawFecha)) : new Date(),
      observaciones: formData.get("observaciones") || undefined,
      profundidadRanura: formData.get("profundidadRanura") ? Number(formData.get("profundidadRanura")) : null,
      anguloRanura: formData.get("anguloRanura") ? Number(formData.get("anguloRanura")) : null,
      horasOperacion: formData.get("horasOperacion") ? Number(formData.get("horasOperacion")) : null,
      toneladas: formData.get("toneladas") ? Number(formData.get("toneladas")) : null,
      temperaturaBronce: formData.get("temperaturaBronce") ? Number(formData.get("temperaturaBronce")) : null,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const rodillo = await prisma.rodillo.findUnique({
      where: { id: parsed.data.rodilloId },
    });

    if (!rodillo) {
      return { ok: false, error: "Rodillo no encontrado" };
    }

    // Buscar rango técnico correspondiente
    const rango = await prisma.rangoTecnico.findUnique({
      where: { parametro: parsed.data.parametro },
    });

    let fueraDeRango = false;
    let rangoTexto = "560 - 620";
    let unidad = "mm";

    if (rango) {
      rangoTexto = `${rango.minimo} - ${rango.maximo}`;
      unidad = rango.unidad;
      if (parsed.data.valor < rango.minimo || parsed.data.valor > rango.maximo) {
        fueraDeRango = true;
      }
    } else if (parsed.data.parametro === "Diámetro") {
      if (parsed.data.valor < 560 || parsed.data.valor > 620) {
        fueraDeRango = true;
      }
    }

    const estadoMedicion = fueraDeRango ? "Fuera de rango" : "Normal";

    await prisma.$transaction(async (tx) => {
      // 1. Guardar medición
      await tx.medicion.create({
        data: {
          rodilloId: parsed.data.rodilloId,
          usuarioId: session.user.id,
          parametro: parsed.data.parametro,
          valor: parsed.data.valor,
          unidad,
          estado: estadoMedicion,
          diametro: parsed.data.parametro === "Diámetro" ? parsed.data.valor : rodillo.diametroActual,
          profundidadRanura: parsed.data.profundidadRanura,
          anguloRanura: parsed.data.anguloRanura,
          horasOperacion: parsed.data.horasOperacion,
          toneladas: parsed.data.toneladas,
          temperaturaBronce: parsed.data.temperaturaBronce,
          observaciones: parsed.data.observaciones,
          fecha: parsed.data.fecha,
        },
      });

      // 2. Si el parámetro fue diámetro, actualizar diámetro del rodillo
      if (parsed.data.parametro === "Diámetro") {
        await tx.rodillo.update({
          where: { id: rodillo.id },
          data: {
            diametroActual: parsed.data.valor,
            estado: fueraDeRango ? "FUERA_RANGO" : undefined,
          },
        });
      }

      // 3. Crear alerta si está fuera de rango
      if (fueraDeRango) {
        await tx.alerta.create({
          data: {
            rodilloId: rodillo.id,
            parametro: parsed.data.parametro,
            valor: parsed.data.valor,
            unidad,
            rango: rangoTexto,
            estado: "Fuera de rango",
            tipo: "FUERA_DE_RANGO",
            mensaje: `Medición de ${parsed.data.parametro} fuera de rango admisible (${parsed.data.valor} ${unidad} fuera de ${rangoTexto} ${unidad})`,
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/mediciones");
    revalidatePath("/historial");
    revalidatePath("/alertas");
    revalidatePath(`/rodillos/${rodillo.id}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar medición" };
  }
}

export async function updateMedicion(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || !canManageMediciones(session.user.role)) {
      return { ok: false, error: "No autorizado" };
    }

    const id = String(formData.get("id") ?? "");
    if (!id) return { ok: false, error: "ID inválido" };

    const rawFecha = formData.get("fecha");
    const parsed = medicionSchema.safeParse({
      rodilloId: formData.get("rodilloId"),
      parametro: formData.get("parametro") || "Diámetro",
      valor: formData.get("valor") ?? formData.get("diametro"),
      fecha: rawFecha ? new Date(String(rawFecha)) : new Date(),
      observaciones: formData.get("observaciones") || undefined,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const existing = await prisma.medicion.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Medición no encontrada" };

    const rango = await prisma.rangoTecnico.findUnique({
      where: { parametro: parsed.data.parametro },
    });
    let fueraDeRango = false;
    let unidad = "mm";
    if (rango) {
      unidad = rango.unidad;
      if (parsed.data.valor < rango.minimo || parsed.data.valor > rango.maximo) {
        fueraDeRango = true;
      }
    }

    await prisma.medicion.update({
      where: { id },
      data: {
        rodilloId: parsed.data.rodilloId,
        parametro: parsed.data.parametro,
        valor: parsed.data.valor,
        unidad,
        estado: fueraDeRango ? "Fuera de rango" : "Normal",
        diametro: parsed.data.parametro === "Diámetro" ? parsed.data.valor : existing.diametro,
        observaciones: parsed.data.observaciones,
        fecha: parsed.data.fecha,
      },
    });

    revalidatePath("/mediciones");
    revalidatePath("/historial");
    revalidatePath("/dashboard");
    revalidatePath(`/rodillos/${parsed.data.rodilloId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar medición" };
  }
}

export async function deleteMedicion(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || !canManageMediciones(session.user.role)) {
      return { ok: false, error: "No autorizado" };
    }

    const existing = await prisma.medicion.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Medición no encontrada" };

    await prisma.medicion.delete({ where: { id } });

    revalidatePath("/mediciones");
    revalidatePath("/historial");
    revalidatePath("/dashboard");
    revalidatePath(`/rodillos/${existing.rodilloId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar medición" };
  }
}
