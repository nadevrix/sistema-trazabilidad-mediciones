"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canResolveAlertas } from "@/lib/roles";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function resolveAlerta(alertaId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || !canResolveAlertas(session.user.role)) {
      return { ok: false, error: "No autorizado" };
    }

    await prisma.alerta.update({
      where: { id: alertaId },
      data: {
        resuelta: true,
        resueltaPorId: session.user.id,
        resueltaEn: new Date(),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/alertas");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al resolver alerta" };
  }
}
