# Sistema de Trazabilidad de Mediciones · Ingenios Azucareros

Plataforma web integral para el control, registro y análisis de mediciones en rodillos (mazas) de molienda en ingenios azucareros. Permite la trazabilidad dimensional completa, monitoreo en tiempo real del estado de rodillos (en operación, en revisión, fuera de rango), alertas automáticas de desviación y configuración técnica de tolerancias.

**Stack tecnológico**: **Next.js 16** (Turbopack, Vercel) + **Neon PostgreSQL** + **Prisma ORM** + **NextAuth.js v5** + **Tailwind CSS v4**.

---

## Módulos y Pantallas del Sistema

1. **Pantalla de inicio de sesión (`/login`)**:
   - Diseño corporativo dividido con arte industrial de rodillos de molienda.
   - Slogan: *Controla · Registra · Analiza*.
   - Control de visibilidad de contraseña y opción "Recordar usuario".

2. **Panel principal / Dashboard (`/dashboard`)**:
   - 4 Tarjetas de métricas: Total de rodillos (12), Mediciones hoy (48), Alertas activas (3) y Última actualización.
   - **Mediciones recientes**: Tabla de últimas lecturas con indicación visual de estado (Normal / Fuera de rango).
   - **Estado de rodillos**: Gráfico circular (Donut chart interactivo en SVG) que muestra la distribución en planta: En rango (9), En revisión (2), Fuera de rango (1).

3. **Lista de rodillos (`/rodillos`)**:
   - Inventario de rodillos de molienda (Código, Nombre, Ubicación/Tren, Estado).
   - Búsqueda instantánea en vivo por código o nombre.
   - Acciones: Ver detalle, editar y eliminar con paginación integrada.

4. **Registro de mediciones (`/mediciones/nueva`)**:
   - Formulario de captura dimensional con selección de rodillo, parámetro (Diámetro, Desgaste, Conicidad), valor numérico, fecha/hora y observaciones.
   - Panel de **Rangos técnicos de referencia** lateral.
   - Validación en tiempo real que alerta si el valor ingresado excede los límites tolerables.

5. **Historial de mediciones (`/historial`)**:
   - Filtros combinados por rodillo, parámetro técnico y rango de fechas (Desde / Hasta).
   - Visualización tabular con paginación.

6. **Alertas (`/alertas`)**:
   - Monitoreo de mediciones fuera de rango (diámetro mínimo, desgaste acelerado, conicidad excesiva).
   - Modal de inspección de desviación y acción para marcar como resuelta.

7. **Configuración de rangos técnicos (`/configuracion`)**:
   - Edición y guardado directo de valores límite mínimos, máximos y unidades de cada parámetro de control.

8. **Reportes (`/reportes`)**:
   - Consolidado ejecutivo y exportable del estado de la maquinaria de molienda.

---

## Roles y Permisos

| Rol | Alcance y capacidades |
|-----|----------------------|
| **ADMIN** | Acceso completo: gestión de usuarios, configuración técnica de rangos, altas y bajas. |
| **SUPERVISOR** | Gestión de rodillos, registro de mediciones y resolución de alertas operativas. |
| **OPERADOR** | Registro diario de mediciones en planta y consulta de historial. |

> **Nota de seguridad**: No existe auto-registro público. El Administrador genera y gestiona las credenciales del personal en `/admin/usuarios`.

---

## Credenciales de prueba (Seed)

- **Usuario**: `admin`
- **Contraseña**: `Admin123!`
- **Nombre**: Juan Pérez (Administrador)

---

## Puesta en marcha local

1. Clonar el repositorio y configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Instalar dependencias y sincronizar la base de datos Neon:
   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Despliegue en Vercel

1. Conectar el repositorio en [Vercel](https://vercel.com).
2. Configurar las variables de entorno en el panel de Vercel:
   - `DATABASE_URL`: Cadena de conexión Neon Postgres (con pooler activo).
   - `AUTH_SECRET`: Secreto criptográfico (`openssl rand -base64 32`).
   - `AUTH_URL`: Dominio oficial de Vercel (`https://tu-proyecto.vercel.app`).
3. El build ejecutará `prisma generate && next build`.
