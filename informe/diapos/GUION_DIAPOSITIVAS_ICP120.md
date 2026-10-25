# Guion de diapositivas — Formato ICP 120

Usá este texto en PowerPoint / Google Slides. Máximo 1 idea fuerte por diapositiva.

---

## Diapositiva 1 — Carátula
**Título:** Prototipo digital para el registro y trazabilidad de mediciones de rodillos de molienda con base en la ISO 9001:2015  
**Subtítulo:** Referencia: Ingenio Azucarero Guabirá S.A. (datos simulados)  
**Integrante:** Anghela Tatiana [APELLIDO] — Reg. [NÚMERO]  
**Docente / Semestre / Materia ICP 120**  
**Gestión 2026**

---

## Diapositiva 2 — Introducción
- La molienda requiere registros confiables de rodillos (mazas).  
- ISO 9001:2015 pide información documentada y seguimiento/medición.  
- Visita a Guabirá: existe plataforma, pero **no hubo acceso a datos** (confidencialidad).  
- Solución académica: **prototipo independiente + datos simulados**.

---

## Diapositiva 3 — Objetivos
**General:** Diseñar un prototipo digital independiente para organizar, consultar y dar seguimiento a mediciones de rodillos, con base en ISO 9001:2015 y datos simulados.

**Específicos:**
1. Identificar conceptos ISO aplicables.  
2. Diseñar estructura de datos genérica.  
3. Desarrollar prototipo web con CRUD, historial y alertas.  
4. Verificar con casos de prueba y datos ficticios.

---

## Diapositiva 4 — Revisión literaria / Marco teórico
- ¿Qué es ISO? Organización Internacional de Normalización.  
- ¿Qué es ISO 9001:2015? Requisitos de sistema de gestión de la calidad.  
- Cláusulas usadas en el proyecto: **7.1.5**, **7.5**, **9.1**, **10.2** (conceptual).  
- Guabirá (contexto público): ingenio sucroalcoholero; este trabajo **no audita** su certificación.  
- Trazabilidad de registros ≠ certificación metrológica.

---

## Diapositiva 5 — Metodología
- Investigación aplicada / tecnológica (Arias).  
- Diseño no experimental + pruebas funcionales.  
- Métodos: documental, analítico, descriptivo, diseño-prueba.  
- Materiales: PC, norma, libro de Arias, dataset simulado.  
- Equipos: Next.js + Neon Postgres + Vercel.  
- Procedimiento: revisar norma → modelar datos → desarrollar → probar → documentar.  
- **No se usaron reactivos** (proyecto de software).

---

## Diapositiva 6 — Resultados (base de datos + estadísticas)
- Prototipo desplegado (demo académica).  
- CRUD de rodillos y mediciones + alertas.  
- **48 registros simulados**.  
- Incompletos: **14,6 %**.  
- Desviaciones de prueba: **27,1 %**.  
- Gráficos sugeridos:
  - Torta: completo vs incompleto.  
  - Barras: desviaciones por molino (M1 vs M2).  
- Frase clave: **datos ficticios; no son de Guabirá**.

---

## Diapositiva 7 — Conclusión
- Se logró el prototipo independiente.  
- Se respetó la confidencialidad.  
- Hay correspondencia conceptual con ISO 9001:2015.  
- No es implementación oficial ni auditoría.

---

## Diapositiva 8 — Recomendaciones
- Completar datos institucionales en el informe.  
- Si hubiera autorización futura: validar con datos reales bajo acuerdo.  
- Mejoras: exportes PDF/Excel, auditoría de cambios, capacitación.  
- Mantener separación simulado vs real.

---

## Diapositiva 9 — Bibliografía
- Arias, F. G. (2012). *El proyecto de investigación* (6.ª ed.).  
- ISO 9001:2015.  
- https://www.guabira.com/ (contexto público).  

---

## Diapositiva 10 — Anexos
- Capturas del sistema (login, tablas, alertas).  
- CSV de datos simulados.  
- Link demo: https://control-rodillos-guabira.vercel.app  
- Fotos autorizadas / públicas (si aplica).
