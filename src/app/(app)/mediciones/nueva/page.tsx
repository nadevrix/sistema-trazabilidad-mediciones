import { prisma } from "@/lib/prisma";
import { RegistroMedicionView } from "@/components/registro-medicion-view";

export default async function NuevaMedicionPage() {
  const [rodillos, rangos] = await Promise.all([
    prisma.rodillo.findMany({
      orderBy: { codigo: "asc" },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        ubicacion: true,
      },
    }),
    prisma.rangoTecnico.findMany({
      orderBy: { parametro: "asc" },
      select: {
        parametro: true,
        minimo: true,
        maximo: true,
        unidad: true,
      },
    }),
  ]);

  // Fallback defaults if table is empty
  const defaultRangos = rangos.length > 0 ? rangos : [
    { parametro: "Diámetro", minimo: 560, maximo: 620, unidad: "mm" },
    { parametro: "Desgaste", minimo: 0.0, maximo: 5.0, unidad: "mm" },
    { parametro: "Conicidad", minimo: 0.0, maximo: 2.0, unidad: "mm" },
  ];

  return <RegistroMedicionView rodillos={rodillos} rangos={defaultRangos} />;
}
