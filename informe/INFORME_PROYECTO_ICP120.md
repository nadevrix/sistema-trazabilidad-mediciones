---
title: "PROTOTIPO DIGITAL PARA EL REGISTRO Y TRAZABILIDAD DE MEDICIONES DE RODILLOS DE MOLIENDA CON BASE EN LA ISO 9001:2015"
subtitle: "Referencia industrial: Ingenio Azucarero Guabirá S.A. — Datos simulados (prototipo académico independiente)"
author: "Anghela Tatiana [APELLIDO] — Registro: [NÚMERO]"
---

# PORTADA

**Institución:** [Completar: Universidad / Carrera / Materia ICP 120]  
**Docente:** [Completar]  
**Semestre / gestión:** [Completar]  
**Integrante(s):** Anghela Tatiana [APELLIDO] — Registro: [NÚMERO]  
**Lugar y fecha:** Santa Cruz de la Sierra, Bolivia — 2026

**Título:**

# PROTOTIPO DIGITAL PARA EL REGISTRO Y TRAZABILIDAD DE MEDICIONES DE RODILLOS DE MOLIENDA CON BASE EN LA ISO 9001:2015

**Subtítulo:** Referencia industrial: Ingenio Azucarero Guabirá S.A.  
*(Prototipo académico independiente con datos simulados; no utiliza información confidencial de la empresa)*

---

# ÍNDICE

1. Introducción  
2. Objetivo general  
3. Objetivos específicos  
4. Novedad científica  
5. Revisión literaria (marco teórico)  
6. Metodología  
7. Resultados (base de datos y estadísticas)  
8. Conclusión  
9. Recomendaciones  
10. Bibliografía  
11. Anexos  

---

# 1. INTRODUCCIÓN

En la industria azucarera, el área de molienda es un proceso crítico porque de la condición de los rodillos (mazas) depende la extracción de jugo y la continuidad operativa. La gestión de la calidad, según la norma **ISO 9001:2015**, exige información documentada que permita hacer seguimiento, verificar resultados y respaldar decisiones.

Durante una visita técnica de referencia al **Ingenio Azucarero Guabirá S.A.** se conoció, de manera general, que la empresa dispone de una plataforma digital donde se almacenan registros relacionados con rodillos de molienda. Sin embargo, **por confidencialidad no fue posible acceder a mediciones, pantallas ni detalles internos**. Por esa razón, este trabajo **no afirma deficiencias** del sistema de Guabirá ni propone modificarlo.

El presente proyecto desarrolla un **prototipo digital independiente** (aplicación web con base de datos) que demuestra cómo organizar, consultar y dar seguimiento a registros de medición, tomando como referencia requisitos pertinentes de la ISO 9001:2015. Todos los datos empleados son **simulados** y están claramente identificados como ficticios.

La elaboración del informe se orienta al formato de la asignatura **ICP 120** y a los lineamientos metodológicos de **Fidias G. Arias** (*El proyecto de investigación*, 6.ª ed.), en cuanto a problema, objetivos, justificación, marco teórico y marco metodológico.

**Pregunta de investigación:**  
¿Cómo diseñar un prototipo digital independiente de apoyo a la gestión de la calidad que facilite la organización, consulta y seguimiento de registros de medición de rodillos de molienda, tomando como referencia requisitos de la ISO 9001:2015, sin acceder a información confidencial del Ingenio Azucarero Guabirá S.A.?

---

# 2. OBJETIVO GENERAL

**Diseñar** un prototipo digital independiente para la organización, consulta, trazabilidad y seguimiento de registros de medición de rodillos de molienda, tomando como referencia requisitos pertinentes de la norma ISO 9001:2015 y utilizando datos simulados, sin intervenir ni conectarse a los sistemas informáticos del Ingenio Azucarero Guabirá S.A.

---

# 3. OBJETIVOS ESPECÍFICOS

1. **Identificar**, mediante revisión documental y la información general de la visita técnica, los conceptos de gestión de la calidad, información documentada, seguimiento y medición vinculados a la ISO 9001:2015.  
2. **Diseñar** una estructura de datos y campos genéricos de registro (equipo, fecha, diámetro, temperatura, responsable, observaciones y criterios de prueba simulados) sin reproducir información confidencial.  
3. **Desarrollar** un prototipo web independiente que permita crear, consultar, editar y eliminar registros, consultar historial, detectar campos incompletos y generar alertas frente a rangos de prueba simulados.  
4. **Verificar** el funcionamiento del prototipo con casos de prueba y datos ficticios, documentando resultados, estadísticas demostrativas y limitaciones del estudio.

*(Se usan verbos en infinitivo, según orientación metodológica para objetivos de investigación/aplicación tecnológica.)*

---

# 4. NOVEDAD CIENTÍFICA / TECNOLÓGICA

La novedad del trabajo no consiste en “descubrir” una falla de Guabirá —lo cual sería incorrecto sin evidencia—, sino en:

- Integrar de forma didáctica **ISO 9001:2015** (cláusulas de información documentada y seguimiento/medición) con un **prototipo funcional** de trazabilidad de registros.  
- Demostrar un flujo completo de **CRUD** (crear, leer, actualizar, eliminar), historial por equipo y **alertas por desviación simulada**.  
- Trabajar con **datos ficticios** respetando la confidencialidad industrial, lo que es metodológicamente válido cuando el acceso a datos reales está restringido.  
- Documentar una **matriz de correspondencia** entre funciones del prototipo y requisitos normativos, útil como material académico de apoyo a la calidad.

---

# 5. REVISIÓN LITERARIA (MARCO TEÓRICO)

## 5.1. Gestión de la calidad

Comprende actividades coordinadas para dirigir y controlar una organización respecto de la calidad. Para este proyecto se entiende como marco que organiza información, define criterios de revisión y apoya la mejora de procesos.

## 5.2. Norma ISO 9001:2015

Establece requisitos para sistemas de gestión de la calidad. Se toman como referencia conceptual (no como auditoría ni certificación):

| Cláusula | Tema | Relación con el prototipo |
|----------|------|---------------------------|
| **7.1.5** | Recursos de seguimiento y medición | Identificación del equipo/rodillo y parámetros medidos |
| **7.5** | Información documentada | Registro estructurado, conservación y consulta |
| **9.1** | Seguimiento, medición, análisis y evaluación | Historial, reportes y estadísticas de prueba |
| **10.2** | No conformidad y acción correctiva (si aplica) | Alertas/desviaciones simuladas y su seguimiento |

La norma **no obliga** por sí misma a crear software; el prototipo solo **ilustra** cómo una herramienta digital puede apoyar el cumplimiento conceptual de esos requisitos.

## 5.3. Metrología y trazabilidad de registros

La metrología es la ciencia de la medición. En este trabajo, “trazabilidad de registro” se entiende como la posibilidad de ubicar **quién midió, qué equipo, cuándo y con qué valor**, sin afirmar certificación metrológica de mediciones reales de planta.

## 5.4. Información documentada

Información que debe identificarse, controlarse y conservarse. En el prototipo se representa con formularios, base de datos, historial y detección de campos incompletos.

## 5.5. Rodillos de molienda (contexto técnico)

En ingenios azucareros, los rodillos o mazas comprimen la caña/bagazo. En la práctica industrial suelen registrarse, entre otros: código del rodillo, molino/posición, diámetro, profundidad de ranura, horas o toneladas, temperatura de bronces y observaciones de mantenimiento. **Los valores usados aquí son simulados.**

## 5.6. Plataformas digitales y bases de datos

Una aplicación presenta funciones al usuario; la base de datos organiza la información. El prototipo usa PostgreSQL (Neon) y una interfaz web (Next.js / Vercel) en un entorno académico independiente.

## 5.7. Antecedentes / orientación metodológica

Arias (2012) distingue planteamiento y formulación del problema, exige objetivos claros (meta a alcanzar) y propone un esquema flexible de proyecto (problema, objetivos, justificación, marco teórico y metodológico). Este informe adapta ese enfoque al **formato ICP 120**.

---

# 6. METODOLOGÍA

## 6.1. Enfoque y tipo de investigación

- **Tipo:** investigación **aplicada / tecnológica** (diseño de prototipo).  
- **Nivel:** **descriptivo** en el levantamiento conceptual; **evaluativo funcional** en las pruebas del software.  
- **Diseño:** **no experimental** respecto al proceso industrial (no se manipulan equipos de Guabirá).  
- **Fuentes:** documental (ISO 9001:2015, Arias, bibliografía técnica) + observación de campo **limitada** (visita técnica sin acceso a datos confidenciales).

## 6.2. Métodos

| Método | Uso en el proyecto |
|--------|--------------------|
| Documental | Revisión de norma, libro de Arias y fuentes técnicas |
| Analítico | Relación cláusula ISO ↔ función del prototipo |
| Descriptivo | Ordenar hallazgos generales de la visita y del diseño |
| Diseño y prueba | Construir la aplicación y ejecutar casos de prueba con datos ficticios |

## 6.3. Materiales

- Computadora personal  
- Norma ISO 9001:2015 (consulta de requisitos)  
- Libro: Arias, F. G. (2012). *El proyecto de investigación* (6.ª ed.)  
- Datos simulados (CSV de prueba)  
- Procesador de texto / herramientas de reporte  

## 6.4. Equipos / herramientas tecnológicas

- Editor de código y navegador web  
- Next.js (aplicación web)  
- PostgreSQL en Neon (base de datos)  
- Despliegue en Vercel  
- Auth.js (usuarios y roles: Admin, Supervisor, Operador)  

*(En el formato ICP aparecen “reactivos”; en este proyecto tecnológico no aplican reactivos químicos. Se reporta N/A y se sustituye por herramientas digitales.)*

## 6.5. Técnicas e instrumentos

- Revisión documental  
- Observación general de visita técnica (ficha / notas)  
- Casos de prueba funcionales del prototipo  
- Matriz ISO ↔ funciones  
- Dataset simulado y resumen estadístico  

## 6.6. Procedimiento

1. Revisar bibliografía y seleccionar cláusulas ISO pertinentes.  
2. Registrar limitaciones de confidencialidad.  
3. Definir campos genéricos y modelo de datos.  
4. Diseñar pantallas: login, rodillos, mediciones, alertas, usuarios.  
5. Desarrollar el prototipo y cargar datos simulados.  
6. Probar CRUD, historial, validaciones y alertas.  
7. Elaborar resultados, conclusiones y recomendaciones.  

## 6.7. Población y muestra

No aplica una encuesta poblacional. La “unidad de análisis” son **registros de medición simulados** (n = 48) creados para demostrar el prototipo.

---

# 7. RESULTADOS (BASE DE DATOS Y ESTADÍSTICAS)

## 7.1. Prototipo desarrollado

Se obtuvo un prototipo web independiente con las siguientes funciones demostradas:

- Inicio de sesión con roles  
- CRUD de **rodillos** (crear, ver, editar, eliminar)  
- CRUD de **mediciones** (crear, ver, editar, eliminar)  
- Consulta de **historial** por rodillo  
- **Alertas** por diámetro bajo mínimo simulado, desgaste acelerado o temperatura elevada  
- Panel de **usuarios** (administrador)  

**URL de demostración académica:** https://control-rodillos-guabira.vercel.app  
*(Entorno de prueba; no es plataforma oficial de Guabirá.)*

## 7.2. Estructura de datos (resumen)

Entidades principales: `User`, `Rodillo`, `Medicion`, `Alerta`, `Mantenimiento`.  
Campos demostrativos de medición: código, molino, posición, fecha, diámetro, profundidad de ranura, temperatura de bronce, horas, responsable, observaciones.

## 7.3. Resultados con datos simulados

Se generaron **48 registros ficticios** de medición para 6 rodillos de ejemplo (Molino 1 y Molino 2).

| Indicador (simulado) | Valor |
|----------------------|-------|
| Total de registros | 48 |
| Registros incompletos | 7 (14,6 %) |
| Desviaciones vs. rangos de prueba | 13 (27,1 %) |
| Desviaciones Molino 1 | 6 |
| Desviaciones Molino 2 | 7 |
| Diámetro promedio | 887,3 mm |
| Temperatura promedio | 66,3 °C |

**Interpretación académica:** el prototipo permite detectar registros incompletos y desviaciones respecto de **criterios de prueba inventados**. Estos porcentajes **no representan** la operación real de Guabirá.

## 7.4. Correspondencia ISO ↔ funciones

| Referencia ISO | Función demostrada |
|----------------|--------------------|
| 7.1.5 | Identificación de rodillo/equipo y parámetros |
| 7.5 | Registro estructurado + consulta + campos incompletos |
| 9.1 | Historial + estadísticas de prueba |
| 10.2 (conceptual) | Alertas de desviación simulada y estado resuelto/abierto |

## 7.5. Limitación principal de resultados

Al no disponer de datos reales, los resultados son **demostrativos**. Cualquier uso futuro en industria requeriría autorización, validación técnica y definición de requisitos con personal autorizado.

---

# 8. CONCLUSIÓN

1. Se diseñó y desarrolló un **prototipo digital independiente** capaz de organizar, consultar y dar seguimiento a registros de medición de rodillos de molienda.  
2. El trabajo respetó la **confidencialidad** industrial al emplear **datos simulados** y al no acceder ni modificar sistemas de Guabirá.  
3. Las funciones del prototipo se relacionan conceptualmente con requisitos de **ISO 9001:2015** (7.1.5, 7.5, 9.1 y, de forma ilustrativa, 10.2).  
4. Las pruebas con 48 registros ficticios mostraron que es posible evidenciar incompletos y desviaciones de prueba, lo que respalda la utilidad académica del enfoque.  
5. El proyecto no constituye auditoría, certificación ni implementación oficial en la empresa.

---

# 9. RECOMENDACIONES

1. Completar en la portada los datos institucionales (carrera, docente, registro).  
2. Si en el futuro Guabirá autorizara un estudio real, firmar acuerdos de confidencialidad y usar solo datos habilitados.  
3. Ampliar el prototipo con reportes exportables (PDF/Excel) y gráficos automáticos.  
4. Incorporar bitácora de auditoría (quién cambió qué y cuándo) para reforzar el control de información documentada.  
5. Capacitar usuarios de prueba con un manual breve de operación del prototipo.  
6. Mantener siempre la distinción entre **datos simulados** y **datos reales de planta**.

---

# 10. BIBLIOGRAFÍA

Arias, F. G. (2012). *El proyecto de investigación: Introducción a la metodología científica* (6.ª ed.). Editorial Episteme.

International Organization for Standardization. (2015). *ISO 9001:2015. Sistemas de gestión de la calidad — Requisitos*. ISO.

Guabirá. (s. f.). *Sitio institucional*. https://www.guabira.com/  
*(Consulta general de contexto empresarial; no se utilizaron datos internos confidenciales.)*

American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7.ª ed.). APA.  
*(Orientación general de citas/referencias, según se exija en la asignatura.)*

---

# 11. ANEXOS

**Anexo A.** Capturas del prototipo (login, rodillos, mediciones, alertas, usuarios).  
**Anexo B.** Archivo `mediciones_simuladas.csv` (dataset ficticio).  
**Anexo C.** Resumen estadístico de prueba.  
**Anexo D.** Matriz ISO 9001:2015 ↔ funciones del prototipo.  
**Anexo E.** Credenciales de demostración académica (solo entorno de prueba): usuario `admin` / contraseña temporal de seed del proyecto.  
**Anexo F.** Evidencia de despliegue: https://control-rodillos-guabira.vercel.app  

> Nota: las fotografías de planta, si se incluyen, deben ser autorizadas o de uso público; no deben revelar información confidencial.
