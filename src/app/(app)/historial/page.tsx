import { prisma } from "@/lib/prisma";
import { HistorialView } from "@/components/historial-view";

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default async function HistorialPage() {
  const [medicionesRaw, rodillos] = await Promise.all([
    prisma.medicion.findMany({
      orderBy: { fecha: "desc" },
      include: {
        rodillo: {
          select: { id: true, codigo: true, nombre: true },
        },
        usuario: {
          select: { name: true, username: true },
        },
      },
    }),
    prisma.rodillo.findMany({
      orderBy: { codigo: "asc" },
      select: { id: true, codigo: true, nombre: true },
    }),
  ]);

  const mediciones = medicionesRaw.map((m) => ({
    id: m.id,
    fecha: formatDate(m.fecha),
    rawDate: m.fecha.toISOString(),
    rodilloCodigo: m.rodillo.codigo,
    rodilloNombre: m.rodillo.nombre,
    rodilloId: m.rodillo.id,
    parametro: m.parametro,
    valor: m.valor ?? m.diametro,
    unidad: m.unidad || "mm",
    estado: m.estado,
    usuarioNombre: m.usuario?.name || m.usuario?.username || "Técnico",
  }));

  return <HistorialView mediciones={mediciones} rodillos={rodillos} />;
}
