import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canResolveAlertas } from "@/lib/roles";
import { AlertasTable } from "@/components/alertas-table";

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default async function AlertasPage() {
  const session = await auth();
  const canResolve = session?.user ? canResolveAlertas(session.user.role) : false;

  const alertasRaw = await prisma.alerta.findMany({
    where: { resuelta: false },
    orderBy: { createdAt: "desc" },
    include: {
      rodillo: { select: { id: true, codigo: true } },
    },
  });

  const alertas = alertasRaw.map((a) => {
    let param = a.parametro;
    let valStr = a.valor != null ? `${a.valor} ${a.unidad || "mm"}` : "—";
    let rngStr = a.rango || "560 - 620";

    if (!param) {
      if (a.tipo === "DIAMETRO_MINIMO") param = "Diámetro";
      else if (a.tipo === "DESGASTE_ACELERADO") param = "Desgaste";
      else if (a.tipo === "TEMPERATURA") param = "Temperatura";
      else param = "Diámetro";
    }

    return {
      id: a.id,
      fecha: formatDate(a.createdAt),
      rodilloCodigo: a.rodillo.codigo,
      rodilloId: a.rodillo.id,
      parametro: param,
      valor: valStr,
      rango: rngStr,
      estado: a.estado || "Fuera de rango",
      mensaje: a.mensaje,
      resuelta: a.resuelta,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Alertas
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Revisión de mediciones fuera de rango
        </p>
      </div>

      {/* Main Table */}
      <AlertasTable alertas={alertas} canResolve={canResolve} />
    </div>
  );
}
