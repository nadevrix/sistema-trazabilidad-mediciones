import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageRodillos } from "@/lib/roles";
import { ConfiguracionRangosView } from "@/components/configuracion-rangos-view";

export default async function ConfiguracionPage() {
  const session = await auth();
  const canEdit = session?.user ? canManageRodillos(session.user.role) : false;

  const rangos = await prisma.rangoTecnico.findMany({
    orderBy: { parametro: "asc" },
    select: {
      parametro: true,
      minimo: true,
      maximo: true,
      unidad: true,
    },
  });

  const initialRangos =
    rangos.length > 0
      ? rangos
      : [
          { parametro: "Diámetro", minimo: 560, maximo: 620, unidad: "mm" },
          { parametro: "Desgaste", minimo: 0.0, maximo: 5.0, unidad: "mm" },
          { parametro: "Conicidad", minimo: 0.0, maximo: 2.0, unidad: "mm" },
        ];

  return <ConfiguracionRangosView initialRangos={initialRangos} canEdit={canEdit} />;
}
