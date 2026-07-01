# Plan de trabajo — Aprendiendo Juntos TEA

**Fecha:** 2026-06-30
**Basado en:** [AUDITORIA.md](AUDITORIA.md) (auditoría técnica) y [CONTENIDO.md](CONTENIDO.md) (revisión de contenido sobre autismo).
**Alcance de este documento:** planificación por fases. No contiene código ni cambios; es la hoja de ruta para decidir qué hacer, en qué orden y con qué recursos.

## Cómo se ordenaron las fases

El orden prioriza, en este orden de criterio: **(1) riesgo para el usuario/salud de la información**, **(2) impacto medible en usuarios reales (rendimiento, SEO)**, **(3) cumplimiento normativo (accesibilidad)**, **(4) calidad y mantenibilidad del contenido**, **(5) limpieza y arquitectura interna**, que es invisible para el usuario final pero reduce el costo de todo lo anterior a futuro. Las fases 1 a 4 son las únicas realmente urgentes; las fases 5 a 9 pueden secuenciarse con más flexibilidad según recursos disponibles.

| Fase | Nombre | Prioridad | Tiempo estimado |
|---|---|---|---|
| 1 | Seguridad del contenido sobre autismo | 🔴 Crítica | 3–5 h |
| 2 | Correcciones críticas de SEO y ortografía | 🔴 Crítica | 2–3 h |
| 3 | Optimización de imágenes y rendimiento | 🔴 Crítica | 4–6 h |
| 4 | Accesibilidad WCAG 2.2 AA | 🟠 Alta | 5–7 h |
| 5 | Enriquecimiento científico del contenido | 🟠 Alta | 6–10 h |
| 6 | Limpieza de código muerto y organización | 🟡 Media | 1–2 h |
| 7 | Consistencia de marca, UX y SEO avanzado | 🟡 Media | 4–6 h |
| 8 | Refactor de arquitectura (plantilla única) | 🟢 Media-baja / a futuro | 8–16 h |
| 9 | QA y validación final | 🟠 Alta (cierre) | 3–4 h |

**Estimación total (fases 1–7 + 9, sin refactor de arquitectura):** ≈ 28–43 horas de trabajo efectivo.
**Fase 8 se recomienda tratar como iniciativa aparte**, no bloqueante para publicar las correcciones de las fases 1–7 y 9.

---

## Fase 1 — Seguridad del contenido sobre autismo

**Objetivo:** eliminar los dos vacíos de contenido con mayor riesgo real detectados en `CONTENIDO.md`: la sección de manejo de crisis sin criterios de derivación, y la ausencia de los mitos más dañinos (vacunas, curas no probadas) en la sección "Mitos y realidades."

- **Archivos afectados:** `pages/padres.html`, `pages/tea.html`.
- **Prioridad:** 🔴 Crítica — es la única fase que involucra riesgo directo para la seguridad/bienestar de las familias que usan el sitio, no solo calidad técnica.
- **Tiempo estimado:** 3–5 horas (redacción de contenido nuevo + revisión, no requiere trabajo de desarrollo complejo).
- **Impacto:** alto y directo sobre la confiabilidad del sitio como recurso de salud/neurodesarrollo; reduce el riesgo de que una familia actúe sin apoyo profesional en una situación de crisis, y corrige la omisión de los mitos que más desinformación generan sobre TEA.
- **Riesgos:**
  - Riesgo de introducir contenido clínico impreciso si no se redacta con cuidado; se recomienda que el texto final sea revisado por una persona con formación clínica o al menos contrastado frase por frase contra la fuente citada antes de publicar.
  - Riesgo de tono: el mensaje sobre "cuándo buscar ayuda profesional" debe redactarse sin generar alarma innecesaria, manteniendo el estilo respetuoso ya presente en el resto del sitio.
- **Pruebas necesarias:**
  - Revisión de contenido por una segunda persona (idealmente con formación en salud/desarrollo infantil) antes de publicar.
  - Verificación de que cada afirmación nueva tiene una fuente de la lista autorizada (OMS, CDC, NIH, NIMH, PubMed, Cochrane, AAP, NICE) correctamente enlazada.
  - Lectura completa de las dos páginas para confirmar que el tono se mantiene coherente con el resto del sitio.

---

## Fase 2 — Correcciones críticas de SEO y ortografía

**Objetivo:** corregir el error de dominio en `robots.txt` y unificar la grafía correcta "Trastorno" (en vez de "Transtorno") en todo el sitio.

- **Archivos afectados:** `robots.txt`, `index.html`, `pages/actividades.html`, `pages/contacto.html`, `pages/padres.html`, `pages/recursos.html`, `README.md`, `.vscode/settings.json` (eliminar "Transtorno" del diccionario de `cSpell.words` para que el corrector deje de silenciarlo).
- **Prioridad:** 🔴 Crítica — afecta directamente cómo Google indexa el sitio y la credibilidad de un recurso sobre TEA que escribe mal su propio término central.
- **Tiempo estimado:** 2–3 horas (incluye revisar cada ocurrencia en contexto, no solo un reemplazo masivo automático, para no romper capitalización ni frases).
- **Impacto:** alto en SEO (el sitio empieza a competir correctamente por la palabra clave real que la gente busca) y en percepción de calidad/profesionalismo del contenido.
- **Riesgos:**
  - Un reemplazo automático mal ejecutado podría afectar otras palabras que contengan la cadena "transtorno" en contextos no relacionados (bajo riesgo dado el tamaño del sitio, pero debe revisarse manualmente cada archivo).
  - Cambiar `robots.txt` no tiene efecto inmediato en el índice de buscadores; puede tardar días/semanas en reflejarse tras el re-rastreo.
- **Pruebas necesarias:**
  - Búsqueda de texto en todo el repositorio para confirmar cero ocurrencias restantes de "Transtorno" tras el cambio.
  - Validación manual del `robots.txt` (comprobar que la URL del sitemap resuelve con código 200).
  - Revisión visual de cada página modificada para confirmar que no se rompió ninguna frase por el reemplazo.

---

## Fase 3 — Optimización de imágenes y rendimiento

**Objetivo:** reducir el peso total de imágenes (~16 MB) a un rango razonable, añadir carga diferida y dimensiones explícitas, y eliminar el recurso huérfano de 2.4 MB.

- **Archivos afectados:** todos los archivos en `images/activities/`, `images/banners/`, `images/resources/`, `images/logo/favicon.ico`, y las etiquetas `<img>` correspondientes en `index.html`, `pages/actividades.html`.
- **Prioridad:** 🔴 Crítica — es el hallazgo con mayor impacto cuantificado de toda la auditoría técnica (afecta directamente LCP/Core Web Vitals y la experiencia en conexiones móviles).
- **Tiempo estimado:** 4–6 horas (compresión/redimensionado de 9 imágenes, generación de variantes si se decide usar formatos modernos, ajuste de atributos `width`/`height` y `loading="lazy"` en cada `<img>`, regeneración del favicon).
- **Impacto:** muy alto en tiempo de carga percibido, especialmente en móvil/datos limitados, que es probablemente el escenario más común para el público objetivo del sitio.
- **Riesgos:**
  - Pérdida de calidad visual si la compresión es demasiado agresiva; requiere comparación visual antes/después.
  - Si se decide renombrar archivos (recomendado en `AUDITORIA.md` para quitar espacios/tildes), hay que actualizar **todas** las referencias en HTML a la vez o se generan enlaces rotos (404 en imágenes).
  - Eliminar `images/resources/Niño con materiales educativos.png` es seguro porque no está enlazada en ningún HTML, pero debe confirmarse una vez más justo antes de borrar por si en el futuro alguien la conectó sin que se detectara en esta revisión.
- **Pruebas necesarias:**
  - Comparación de peso de archivo antes/después por imagen.
  - Revisión visual de cada imagen optimizada en pantalla completa para descartar artefactos de compresión visibles.
  - Prueba de carga en conexión simulada 3G/4G lenta para confirmar la mejora percibida.
  - Verificación de que ninguna imagen quedó rota (petición 404) tras cualquier cambio de nombre de archivo.
  - Nueva medición de Lighthouse (Performance) para comparar contra la estimación cualitativa de `AUDITORIA.md`.

---

## Fase 4 — Accesibilidad WCAG 2.2 AA

**Objetivo:** cerrar las brechas de accesibilidad documentadas: etiquetas de formulario, skip-link, estilos de foco visibles, contraste del botón de WhatsApp, y atributos ARIA faltantes en filtros y menú.

- **Archivos afectados:** `pages/contacto.html` (etiquetas de formulario), `index.html` + las 5 páginas de `pages/` (skip-link, `aria-controls`), `css/style.css` (estilos de foco, corrección de color del botón de WhatsApp), `css/variables.css` (posible nueva variable de color si se ajusta el verde de WhatsApp), `js/main.js` (`aria-pressed` en botones de filtro).
- **Prioridad:** 🟠 Alta.
- **Tiempo estimado:** 5–7 horas (incluye pruebas manuales con teclado y lector de pantalla, no solo la implementación).
- **Impacto:** alto para usuarios que dependen de teclado o lector de pantalla, y reduce el riesgo de que el sitio falle una auditoría WCAG formal si en el futuro se solicita una certificación o revisión externa.
- **Riesgos:**
  - Cambiar el color del botón de WhatsApp para cumplir contraste puede alterar la identidad visual asociada a la marca de WhatsApp (verde reconocible); hay que buscar un tono que mantenga la asociación de marca y cumpla 4.5:1, o alternativamente aumentar el tamaño/peso del texto para calificar como "texto grande" (umbral 3:1).
  - Añadir estilos de foco visibles en todos los elementos interactivos puede alterar ligeramente la estética actual si no se diseñan con cuidado (riesgo estético bajo, pero visible).
- **Pruebas necesarias:**
  - Navegación completa del sitio solo con teclado (Tab/Shift+Tab/Enter/Espacio) en las 6 páginas.
  - Prueba con al menos un lector de pantalla (NVDA o VoiceOver) en el formulario de contacto, el menú móvil y los filtros de actividades/recursos.
  - Verificación de contraste de color con una herramienta de medición (no solo inspección visual) en todos los pares texto/fondo modificados.
  - Escaneo automático con una herramienta de accesibilidad (tipo axe o WAVE) antes/después para comparar el número de incidencias detectadas.

---

## Fase 5 — Enriquecimiento científico del contenido

**Objetivo:** añadir las referencias, datos y secciones faltantes identificadas en `CONTENIDO.md`: prevalencia, proceso de diagnóstico, importancia de la intervención temprana, condiciones coexistentes, y una sección de "Fuentes" citando únicamente OMS, CDC, NIH, NIMH, PubMed, Cochrane, AAP y NICE.

- **Archivos afectados:** `pages/tea.html` (principalmente), `pages/padres.html`, `pages/actividades.html`, `pages/recursos.html` (secciones de "Fuentes" o notas de respaldo).
- **Prioridad:** 🟠 Alta.
- **Tiempo estimado:** 6–10 horas (la mayor parte del tiempo es investigación y verificación de las fuentes exactas antes de citarlas, no la maquetación).
- **Impacto:** alto en credibilidad y utilidad real del sitio como recurso educativo; convierte afirmaciones actualmente no verificables en contenido trazable a fuentes autorizadas.
- **Riesgos:**
  - Riesgo de citar una fuente de forma imprecisa o desactualizada (por ejemplo, una cifra de prevalencia que cambie en el próximo informe del CDC); se recomienda anotar la fecha de la fuente citada y revisar el contenido cada 12 meses.
  - Riesgo de que añadir demasiado texto técnico rompa el tono accesible y cercano que hoy tiene el sitio; se recomienda mantener las citas como notas breves o enlaces, no como bloques extensos de literatura clínica.
  - Esta fase depende de que la Fase 1 (seguridad del contenido) ya esté resuelta, porque comparten las mismas páginas y es más eficiente escribir todo el contenido nuevo de `tea.html` y `padres.html` en un solo pase.
- **Pruebas necesarias:**
  - Verificación cruzada de cada cifra o afirmación nueva contra la fuente original antes de publicar.
  - Revisión de que todas las referencias añadidas pertenecen exclusivamente a la lista de fuentes autorizadas (ninguna fuente secundaria o no verificada).
  - Revisión de legibilidad (que el contenido nuevo no eleve demasiado el nivel de lectura del sitio para el público general).

---

## Fase 6 — Limpieza de código muerto y organización

**Objetivo:** eliminar los archivos huérfanos y duplicados identificados en `AUDITORIA.md` y sanear la configuración del repositorio.

- **Archivos afectados (a eliminar):** `style.css`, `reponsive.css`, `script.js`, `slider.js` (raíz), `css/animation.css`, `css/reponsive.css`, `js/darkmode.js`, `js/slider.js`, `js/topbutton.js`, `components/footer.html`, `components/header.html`, `components/hero.html`, `components/navbar.html`, `xml/blogger-template.xml`. **Archivos a modificar:** `.gitignore` (añadir reglas básicas, por ejemplo para `.vscode/`).
- **Prioridad:** 🟡 Media — no afecta a usuarios finales, pero reduce deuda técnica y confusión para quien mantenga el proyecto.
- **Tiempo estimado:** 1–2 horas.
- **Impacto:** medio; mejora la mantenibilidad y reduce el peso del repositorio, sin cambios visibles para el usuario del sitio.
- **Riesgos:**
  - Bajo, siempre que se confirme antes de borrar que ninguno de estos archivos está enlazado desde ningún HTML (ya verificado en `AUDITORIA.md`, pero conviene re-confirmar justo antes de eliminar por si hubo cambios desde entonces).
  - Si se elimina `.vscode/settings.json` del control de versiones vía `.gitignore`, cada colaborador deberá mantener su propia configuración local; esto es una decisión de equipo, no solo técnica.
- **Pruebas necesarias:**
  - Búsqueda final de referencias a cada archivo antes de eliminarlo (confirmar 0 resultados).
  - Carga de las 6 páginas tras la limpieza para confirmar que ningún estilo o script dejó de aplicarse.
  - Revisión de que el sitio sigue funcionando igual (menú, FAQ, filtros, botón volver arriba) tras el borrado.

---

## Fase 7 — Consistencia de marca, UX y SEO avanzado

**Objetivo:** unificar el logo/marca entre páginas, mejorar estados de UX menores (formulario, filtros sin resultados), y añadir metadatos SEO avanzados (Open Graph, canonical, datos estructurados, página 404 personalizada).

- **Archivos afectados:** `index.html`, `pages/actividades.html`, `pages/contacto.html`, `pages/padres.html`, `pages/recursos.html`, `pages/tea.html` (unificación de logo/marca, meta tags nuevos), archivo nuevo `404.html` en la raíz, `js/main.js` (mensaje de estado vacío en filtros).
- **Prioridad:** 🟡 Media.
- **Tiempo estimado:** 4–6 horas.
- **Impacto:** medio; mejora la coherencia de marca y el aspecto de los enlaces compartidos en redes sociales/WhatsApp, y reduce fricción en casos límite (enlace roto, filtro sin resultados).
- **Riesgos:**
  - Elegir una única variante de marca (por ejemplo, "AJ" + nombre corto, coherente con la mayoría de páginas internas) implica decidir una dirección de identidad visual; conviene validarlo con quien gestiona la marca antes de aplicarlo a las 6 páginas.
  - Los datos estructurados (JSON-LD) deben reflejar exactamente el contenido visible de la página; si el contenido cambia en fases posteriores, hay que mantenerlos sincronizados o Google puede penalizar la discrepancia.
- **Pruebas necesarias:**
  - Vista previa de cómo se ve un enlace compartido (por ejemplo, pegando la URL en un cliente de mensajería) tras añadir Open Graph.
  - Validación de los datos estructurados con una herramienta de prueba de resultados enriquecidos.
  - Prueba manual de navegar a una URL inexistente para confirmar que `404.html` se muestra correctamente en GitHub Pages.
  - Revisión visual de que el logo y el nombre de marca son idénticos en las 6 páginas.

---

## Fase 8 — Refactor de arquitectura (plantilla única) — iniciativa a futuro

**Objetivo:** eliminar la duplicación manual del header, la navegación y el footer en las 6 páginas, sustituyéndola por un sistema de inclusión (por ejemplo, Jekyll, nativo de GitHub Pages, u otra herramienta mínima de build).

- **Archivos afectados:** las 6 páginas HTML completas (reestructuración), potencialmente los archivos actualmente vacíos de `components/` (que podrían reutilizarse como punto de partida en vez de eliminarse, si esta fase se planifica antes que la Fase 6).
- **Prioridad:** 🟢 Media-baja — no bloquea ninguna de las fases anteriores ni afecta al usuario final; es una mejora puramente interna de mantenibilidad.
- **Tiempo estimado:** 8–16 horas (depende de la herramienta elegida y de si se aprovecha o se descarta el intento previo en `components/`).
- **Impacto:** alto a mediano-largo plazo para el equipo de mantenimiento (un solo cambio de header/footer se propaga automáticamente a las 6 páginas), pero impacto nulo o casi nulo para el visitante del sitio.
- **Riesgos:**
  - Es el cambio de mayor alcance de todo el roadmap: toca la estructura completa de cada página, por lo que tiene más probabilidad de introducir regresiones visuales o de rutas rotas que cualquier otra fase.
  - Si se elige una herramienta con build step (por ejemplo Jekyll), cambia el flujo de publicación en GitHub Pages (de "archivos estáticos servidos tal cual" a "archivos generados"), lo que requiere entender bien la compatibilidad con GitHub Pages antes de migrar.
  - Se recomienda ejecutar esta fase **después** de que las fases 1 a 7 estén estables, para no reconstruir sobre una base que todavía va a cambiar (contenido, imágenes, accesibilidad).
- **Pruebas necesarias:**
  - Comparación página por página (antes/después) para confirmar que el HTML final renderizado es equivalente en contenido y estructura.
  - Verificación de que todas las rutas relativas (`../`) se siguen resolviendo correctamente tras el cambio de sistema de generación.
  - Repetición de las pruebas de accesibilidad y SEO de fases anteriores, porque un cambio estructural puede reintroducir problemas ya corregidos.

---

## Fase 9 — QA y validación final

**Objetivo:** cierre y verificación integral antes de dar por resuelto el plan, confirmando que los hallazgos de `AUDITORIA.md` y `CONTENIDO.md` fueron atendidos.

- **Archivos afectados:** ninguno directamente (fase de verificación, no de edición); puede generar como resultado una lista de pendientes si algo no pasa las pruebas.
- **Prioridad:** 🟠 Alta (es la puerta de salida del proyecto, no debe omitirse aunque las fases anteriores parezcan completas).
- **Tiempo estimado:** 3–4 horas.
- **Impacto:** alto como garantía de calidad; sin esta fase no hay forma de confirmar que las correcciones realmente resolvieron los hallazgos originales.
- **Riesgos:**
  - Riesgo de "falso cierre": marcar el proyecto como terminado sin volver a comparar explícitamente contra la tabla de hallazgos de `AUDITORIA.md` y `CONTENIDO.md`.
- **Pruebas necesarias:**
  - Nueva ejecución de Lighthouse (Performance, Accesibilidad, SEO, Buenas prácticas) y comparación contra la estimación cualitativa inicial.
  - Validación HTML de las 6 páginas (verificar ausencia de errores de marcado).
  - Escaneo de accesibilidad automatizado (axe/WAVE) en las 6 páginas.
  - Revisión manual, hallazgo por hallazgo, de las tablas resumen de `AUDITORIA.md` (sección 15) y `CONTENIDO.md` (sección 8), marcando cada uno como resuelto, parcialmente resuelto o pendiente.
  - Prueba de navegación completa en al menos tres tamaños de pantalla (móvil, tablet, escritorio) y dos navegadores distintos.
  - Verificación de que el sitemap y `robots.txt` son coherentes y accesibles públicamente.

---

## Dependencias entre fases

- La Fase 5 depende de que la Fase 1 esté resuelta (comparten `pages/tea.html` y `pages/padres.html`; conviene redactar todo el contenido nuevo de esas páginas en un solo ciclo de revisión).
- La Fase 3 (imágenes) y la Fase 7 (SEO avanzado) comparten la decisión de renombrar archivos de imagen; conviene resolver los nombres de archivo una sola vez dentro de la Fase 3 para no duplicar el trabajo en la Fase 7.
- La Fase 6 (limpieza) es independiente y puede ejecutarse en cualquier momento, pero se recomienda hacerla **antes** de la Fase 8, para no migrar archivos que de todas formas se van a eliminar.
- La Fase 8 se recomienda como la última fase técnica, después de que el contenido y el diseño estén estables, precisamente porque reestructura todas las páginas a la vez.
- La Fase 9 debe ejecutarse al final, después de cualquier subconjunto de fases que se decida abordar, como control de cierre.

## Resumen de impacto por fase

| Fase | Impacto en usuario final | Impacto en credibilidad/salud | Impacto en mantenibilidad |
|---|---|---|---|
| 1 | Medio | Muy alto | Bajo |
| 2 | Medio (SEO) | Alto | Bajo |
| 3 | Muy alto (velocidad) | Bajo | Bajo |
| 4 | Alto (usuarios con discapacidad) | Medio | Bajo |
| 5 | Medio | Muy alto | Medio |
| 6 | Nulo | Nulo | Alto |
| 7 | Medio | Medio | Medio |
| 8 | Nulo | Nulo | Muy alto |
| 9 | Nulo (verificación) | Alto (garantiza todo lo anterior) | Medio |

Este documento no incluye implementación: es la planificación para decidir con qué fase empezar según los recursos y el tiempo disponibles.
