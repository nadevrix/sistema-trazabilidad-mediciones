import { PrismaClient, Role, EstadoRodillo, TipoAlerta } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = (process.env.SEED_ADMIN_USERNAME ?? "admin").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const name = process.env.SEED_ADMIN_NAME ?? "Juan Pérez";

  const passwordHash = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { username },
    update: {
      name,
      passwordHash,
      role: Role.ADMIN,
      active: true,
    },
    create: {
      username,
      name,
      passwordHash,
      role: Role.ADMIN,
      email: "admin@trazabilidad.local",
    },
  });

  const tecnicoHash = await hash("Tecnico123!", 12);
  const tecnico = await prisma.user.upsert({
    where: { username: "tecnico" },
    update: {
      name: "Carlos Mendoza (Técnico)",
      passwordHash: tecnicoHash,
      role: Role.OPERADOR,
      active: true,
    },
    create: {
      username: "tecnico",
      name: "Carlos Mendoza (Técnico)",
      passwordHash: tecnicoHash,
      role: Role.OPERADOR,
      email: "cmendoza@trazabilidad.local",
    },
  });

  console.log(`Usuarios: ${admin.username} (Admin), ${tecnico.username} (Técnico)`);

  // Rangos técnicos
  const rangos = [
    { parametro: "Diámetro", minimo: 560, maximo: 620, unidad: "mm" },
    { parametro: "Desgaste", minimo: 0.0, maximo: 5.0, unidad: "mm" },
    { parametro: "Conicidad", minimo: 0.0, maximo: 2.0, unidad: "mm" },
  ];

  for (const r of rangos) {
    await prisma.rangoTecnico.upsert({
      where: { parametro: r.parametro },
      update: { minimo: r.minimo, maximo: r.maximo, unidad: r.unidad },
      create: r,
    });
  }

  // 12 Rodillos: 9 En operación (En rango), 2 En revisión, 1 Fuera de rango
  const rodillosData = [
    { codigo: "R-01", nombre: "Rodillo 1", ubicacion: "Tren 1", molino: "Tren 1", posicion: "Maza Superior", diametroActual: 612, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-02", nombre: "Rodillo 2", ubicacion: "Tren 1", molino: "Tren 1", posicion: "Maza Cañera", diametroActual: 598, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_REVISION },
    { codigo: "R-03", nombre: "Rodillo 3", ubicacion: "Tren 2", molino: "Tren 2", posicion: "Maza Bagacera", diametroActual: 605, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-04", nombre: "Rodillo 4", ubicacion: "Tren 2", molino: "Tren 2", posicion: "Maza Superior", diametroActual: 610, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-05", nombre: "Rodillo 5", ubicacion: "Tren 3", molino: "Tren 3", posicion: "Maza Cañera", diametroActual: 550, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.FUERA_RANGO },
    { codigo: "R-06", nombre: "Rodillo 6", ubicacion: "Tren 3", molino: "Tren 3", posicion: "Maza Bagacera", diametroActual: 615, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-07", nombre: "Rodillo 7", ubicacion: "Tren 4", molino: "Tren 4", posicion: "Maza Superior", diametroActual: 618, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-08", nombre: "Rodillo 8", ubicacion: "Tren 4", molino: "Tren 4", posicion: "Maza Cañera", diametroActual: 600, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-09", nombre: "Rodillo 9", ubicacion: "Tren 5", molino: "Tren 5", posicion: "Maza Bagacera", diametroActual: 608, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-10", nombre: "Rodillo 10", ubicacion: "Tren 5", molino: "Tren 5", posicion: "Maza Superior", diametroActual: 570, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_REVISION },
    { codigo: "R-11", nombre: "Rodillo 11", ubicacion: "Tren 6", molino: "Tren 6", posicion: "Maza Cañera", diametroActual: 614, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
    { codigo: "R-12", nombre: "Rodillo 12", ubicacion: "Tren 6", molino: "Tren 6", posicion: "Maza Bagacera", diametroActual: 616, diametroOriginal: 620, diametroMinimo: 560, estado: EstadoRodillo.EN_OPERACION },
  ];

  await prisma.medicion.deleteMany({});
  await prisma.alerta.deleteMany({});
  await prisma.rodillo.deleteMany({
    where: {
      codigo: { notIn: rodillosData.map((r) => r.codigo) },
    },
  });

  const rodilloMap = new Map<string, string>();
  for (const r of rodillosData) {
    const created = await prisma.rodillo.upsert({
      where: { codigo: r.codigo },
      update: {
        nombre: r.nombre,
        ubicacion: r.ubicacion,
        molino: r.molino,
        posicion: r.posicion,
        diametroActual: r.diametroActual,
        diametroOriginal: r.diametroOriginal,
        diametroMinimo: r.diametroMinimo,
        estado: r.estado,
      },
      create: r,
    });
    rodilloMap.set(r.codigo, created.id);
  }

  console.log(`12 Rodillos cargados correctamente.`);

  const baseDate = new Date("2025-04-10T09:32:00Z");

  const medicionesFijas = [
    {
      rodilloCodigo: "R-01",
      parametro: "Diámetro",
      valor: 612,
      diametro: 612,
      unidad: "mm",
      estado: "Normal",
      fecha: new Date("2025-04-10T09:15:00Z"),
      observaciones: "Medición rutinaria en turno de la mañana",
      usuarioId: admin.id,
    },
    {
      rodilloCodigo: "R-03",
      parametro: "Desgaste",
      valor: 3.2,
      diametro: 605,
      unidad: "mm",
      estado: "Normal",
      fecha: new Date("2025-04-10T08:42:00Z"),
      observaciones: "Desgaste superficial dentro de la tolerancia",
      usuarioId: tecnico.id,
    },
    {
      rodilloCodigo: "R-05",
      parametro: "Diámetro",
      valor: 550,
      diametro: 550,
      unidad: "mm",
      estado: "Fuera de rango",
      fecha: new Date("2025-04-10T08:30:00Z"),
      observaciones: "Diámetro crítico inferior al mínimo admisible (560 mm)",
      usuarioId: admin.id,
    },
    {
      rodilloCodigo: "R-04",
      parametro: "Conicidad",
      valor: 1.8,
      diametro: 610,
      unidad: "mm",
      estado: "Normal",
      fecha: new Date("2025-04-10T08:10:00Z"),
      observaciones: "Conicidad verificada con calibre de precisión",
      usuarioId: tecnico.id,
    },
    {
      rodilloCodigo: "R-01",
      parametro: "Desgaste",
      valor: 2.9,
      diametro: 612,
      unidad: "mm",
      estado: "Normal",
      fecha: new Date("2025-04-10T07:56:00Z"),
      observaciones: "Control de inicio de jornada",
      usuarioId: admin.id,
    },
  ];

  for (const m of medicionesFijas) {
    const rodilloId = rodilloMap.get(m.rodilloCodigo)!;
    await prisma.medicion.create({
      data: {
        rodilloId,
        usuarioId: m.usuarioId,
        parametro: m.parametro,
        valor: m.valor,
        unidad: m.unidad,
        estado: m.estado,
        diametro: m.diametro,
        fecha: m.fecha,
        observaciones: m.observaciones,
      },
    });
  }

  // Mediciones adicionales para el historial (48 mediciones totales)
  const parametros = ["Diámetro", "Desgaste", "Conicidad"];
  const codigos = Array.from(rodilloMap.keys());

  for (let i = 6; i <= 48; i++) {
    const cod = codigos[i % codigos.length];
    const param = parametros[i % parametros.length];
    const minutesAgo = 15 * i + 10;
    const mDate = new Date(baseDate.getTime() - minutesAgo * 60 * 1000);

    let val = 600 + (i % 15);
    let st = "Normal";
    if (param === "Desgaste") {
      val = Number((1.5 + (i % 30) * 0.1).toFixed(1));
    } else if (param === "Conicidad") {
      val = Number((0.5 + (i % 15) * 0.1).toFixed(1));
    }

    await prisma.medicion.create({
      data: {
        rodilloId: rodilloMap.get(cod)!,
        usuarioId: i % 2 === 0 ? admin.id : tecnico.id,
        parametro: param,
        valor: val,
        unidad: "mm",
        estado: st,
        diametro: param === "Diámetro" ? val : 605,
        fecha: mDate,
        observaciones: `Registro operativo #${i}`,
      },
    });
  }

  console.log(`48 mediciones registradas.`);

  // 3 Alertas activas con justificación técnica matemática exacta
  const alertasData = [
    {
      rodilloCodigo: "R-05",
      parametro: "Diámetro",
      valor: 550,
      unidad: "mm",
      rango: "560 - 620",
      estado: "Fuera de rango",
      tipo: TipoAlerta.DIAMETRO_MINIMO,
      mensaje: "Medición de diámetro fuera de rango admisible (550 mm inferior al límite mínimo de 560 mm)",
      createdAt: new Date("2025-04-10T08:30:00Z"),
      resuelta: false,
    },
    {
      rodilloCodigo: "R-02",
      parametro: "Desgaste",
      valor: 5.6,
      unidad: "mm",
      rango: "0.0 - 5.0",
      estado: "Fuera de rango",
      tipo: TipoAlerta.DESGASTE_ACELERADO,
      mensaje: "Desgaste excedió el límite máximo tolerado (5.6 mm fuera de 0.0 - 5.0 mm)",
      createdAt: new Date("2025-04-09T16:20:00Z"),
      resuelta: false,
    },
    {
      rodilloCodigo: "R-03",
      parametro: "Conicidad",
      valor: 2.4,
      unidad: "mm",
      rango: "0.0 - 2.0",
      estado: "Fuera de rango",
      tipo: TipoAlerta.FUERA_DE_RANGO,
      mensaje: "Conicidad irregular superior a la tolerancia (2.4 mm fuera de 0.0 - 2.0 mm)",
      createdAt: new Date("2025-04-08T11:15:00Z"),
      resuelta: false,
    },
  ];

  for (const a of alertasData) {
    await prisma.alerta.create({
      data: {
        rodilloId: rodilloMap.get(a.rodilloCodigo)!,
        parametro: a.parametro,
        valor: a.valor,
        unidad: a.unidad,
        rango: a.rango,
        estado: a.estado,
        tipo: a.tipo,
        mensaje: a.mensaje,
        resuelta: a.resuelta,
        createdAt: a.createdAt,
      },
    });
  }

  console.log(`3 alertas activas cargadas con coherencia técnica.`);
  console.log(`Seed finalizado exitosamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
