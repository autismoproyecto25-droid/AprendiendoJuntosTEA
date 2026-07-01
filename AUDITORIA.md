# Auditoría profesional — Aprendiendo Juntos TEA

**Fecha de auditoría:** 2026-06-30
**Tipo de sitio:** Sitio estático (HTML + CSS + JS vanilla), sin build system, alojado en GitHub Pages.
**Alcance:** Revisión estática completa del código fuente (HTML, CSS, JS, assets, configuración). No se ejecutó Lighthouse en navegador real ni un validador HTML online; las métricas de rendimiento y accesibilidad se estiman a partir de análisis manual del código y de los pesos reales de archivo en disco (indicado explícitamente donde aplica).

---

## 1. Resumen ejecutivo

El sitio tiene una base de contenido cuidada, con buen tono, estructura semántica razonable por página y un JavaScript pequeño y bien escrito. Sin embargo, arrastra tres problemas graves que deberían resolverse antes de cualquier otra mejora:

1. **Imágenes sin optimizar** (varias de 2–2.5 MB cada una) que penalizan fuertemente el rendimiento y el Core Web Vitals.
2. **Inconsistencia terminológica**: el sitio trata sobre "Trastorno del Espectro Autista" pero la mayoría de títulos, meta descripciones y textos usan la grafía incorrecta **"Transtorno"** (con "n"), mientras que `pages/tea.html` usa la forma correcta. Esto es un error ortográfico y a la vez un problema de SEO (la gente busca "trastorno", no "transtorno").
3. **Código muerto considerable**: archivos vacíos, hojas de estilo duplicadas/huérfanas y una imagen de 2.4 MB que no se usa en ninguna página, todo aumentando el peso del repositorio sin aportar nada.

Fuera de eso, la arquitectura es simple y coherente con GitHub Pages (rutas relativas correctas, sin dependencias de servidor), el diseño responsive funciona en dos breakpoints razonables, y la accesibilidad tiene una base decente (uso de `aria-label`, `aria-expanded`, `alt` en imágenes) pero con vacíos importantes (formulario sin `<label>`, sin skip-link, sin estilos de foco, un botón con contraste de color que falla WCAG).

**Calificación global orientativa: 6/10** — funcional y publicable, pero con deuda técnica y de contenido que conviene resolver pronto.

---

## 2. Arquitectura

- **Tipo:** sitio 100% estático, sin framework, sin bundler (no hay `package.json`), sin preprocesador CSS. Encaja bien con GitHub Pages, que solo sirve archivos estáticos.
- **Duplicación de plantilla:** el header, la navegación y el footer están **copiados y pegados en las 6 páginas** (`index.html` + 5 páginas en `pages/`). No hay ningún mecanismo de inclusión (ni SSI, ni JS `fetch`, ni build step). Esto es evidente en `components/header.html`, `components/footer.html`, `components/hero.html` y `components/navbar.html`, que existen pero están **completamente vacíos (0 bytes)** y no están referenciados desde ningún HTML — parecen el inicio de una componentización que nunca se completó ni se conectó.
- **Consecuencia práctica:** cualquier cambio en el menú, el footer o los datos de contacto (teléfono, correo) debe repetirse manualmente en 6 archivos. Ya hay evidencia de que esto genera desincronización (ver sección 12, "Contenido").
- **Separación de responsabilidades:** correcta a nivel de carpetas (`css/`, `js/`, `images/`, `pages/`), pero el árbol raíz tiene **restos de una reestructuración anterior**: `style.css`, `reponsive.css`, `script.js` y `slider.js` en la raíz (todos vacíos, 0 bytes) coexisten con sus equivalentes dentro de `css/` y `js/`. Ningún HTML los referencia.
- **`xml/blogger-template.xml`**: archivo de plantilla de Blogger, de 0 líneas legibles/vacío en la práctica, sin relación aparente con el sitio actual. Sugiere un origen distinto del proyecto (migración desde Blogger) que no se limpió.

**Recomendación de fondo:** si el proyecto va a seguir siendo HTML estático puro, conviene formalizar la duplicación con una herramienta mínima de build (11ty, Jekyll —que además es nativo de GitHub Pages—, o un script simple de includes) para eliminar la copia manual del header/footer/nav. Si se descarta esa vía, al menos debe eliminarse el intento incompleto de componentización (`components/`) para no confundir a futuros colaboradores.

---

## 3. HTML

**Aspectos positivos:**
- `<!DOCTYPE html>` y `lang="es"` correctos en las 6 páginas.
- Un único `<h1>` por página, con jerarquía `h2`/`h3` mayormente respetada.
- Uso correcto de elementos semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Atributos `alt` descriptivos en casi todas las imágenes de contenido (no genéricos tipo "imagen1").
- Comentarios HTML explicando la intención de cada bloque (buena práctica de mantenibilidad, aunque son comentarios "qué hace la sección", no imprescindibles).

**Problemas detectados:**
- **Formulario de contacto sin `<label>`** (`pages/contacto.html`): los 4 campos (`nombre`, `correo`, `asunto`, `mensaje`) solo tienen `placeholder`, sin `<label>` asociado ni `aria-label`. El placeholder desaparece al escribir y no es un sustituto válido de etiqueta según WCAG 1.3.1 / 3.3.2.
- **Sin "skip link"** (enlace "Saltar al contenido") en ninguna página — los usuarios de teclado/lector de pantalla deben pasar por todo el menú en cada carga de página.
- **Botones de filtro sin `aria-pressed`** (`pages/actividades.html`, `pages/recursos.html`): el estado "activo" del filtro solo se comunica visualmente (`class="active"`), no a tecnología asistiva.
- **`aria-controls` ausente** en el botón `.menu-toggle`: no vincula el botón con el `<ul class="nav-links">` que despliega.
- **Inconsistencia de mayúsculas en `aria-label`** del `<nav>`: unas páginas usan `aria-label="navegación principal"` (minúscula) y otras `aria-label="Navegación principal"` — indicio de copiar/pegar sin revisión, no un error funcional pero sí de descuido.
- **Iconos de tarjeta como texto plano ("CO", "AC", "FA", "RV", "EM"...)**: son abreviaturas de 2 letras dentro de `<span class="card-icon">`, sin `aria-hidden="true"`. Un lector de pantalla las anuncia literalmente ("Ce, O") antes del `<h3>` real, aportando ruido sin significado. Deberían marcarse como decorativas u ocultarse de la lectura.
- **Atributo `src` con entidad HTML sin codificar en ruta de archivo**: `images/banners/Familia interactuando con ni&ntilde;o.png` mezcla una entidad HTML (`&ntilde;`) con espacios sin codificar dentro de un atributo `src`. Funciona en la mayoría de navegadores porque decodifican entidades en atributos, pero es una práctica frágil (ver también sección 11, GitHub Pages).
- **Título de `<title>` demasiado largo**: por ejemplo, el de `index.html` tiene 89 caracteres; Google trunca aproximadamente a 60. Ver también sección 9 (SEO).

---

## 4. CSS

**Aspectos positivos:**
- Sistema de variables CSS centralizado (`css/variables.css`) con paleta de color, radios, sombras y transición definidos una sola vez — buena base de diseño.
- CSS total muy ligero (~13 KB entre `style.css` + `responsive.css` + `variables.css`, sin minificar), lo cual es excelente y no es un cuello de botella de rendimiento.
- Uso de `clamp()` para tipografía fluida, `aspect-ratio` para evitar CLS en imágenes con proporciones fijas, y `@media (prefers-reduced-motion: reduce)` implementado correctamente para respetar la preferencia de accesibilidad del usuario.
- Nomenclatura de clases consistente y legible (BEM-like informal: `.feature-card`, `.resource-card`, `.activity-card`).

**Problemas detectados:**
- **`css/animation.css` no está enlazado en ningún HTML.** Es un archivo huérfano (define `.hidden`/`.show`, que ya están redefinidos —de forma distinta— dentro de `css/style.css`). Muerto y potencialmente confuso si alguien lo edita pensando que tiene efecto.
- **`css/reponsive.css` (nombre con error tipográfico) también es huérfano**, no enlazado en ningún HTML. Contiene un breakpoint distinto (900px) al que realmente se usa en `css/responsive.css` (980px), con una implementación de menú móvil diferente (desliza desde la derecha con `right:-100%`) a la que realmente está activa (`display:none/flex`). Si alguien lo reactivara por error, rompería el menú.
- **Variables CSS sin uso**: `--accent`, `--muted` y `--danger` están definidas en `variables.css` pero no se usan en ninguna regla de `style.css` ni `responsive.css`. No es grave, pero indica que faltan estados (error, advertencia, texto secundario) que probablemente deberían existir, por ejemplo, en la validación del formulario de contacto.
- **Selector `.newsletter-form input` sin HTML correspondiente**: no existe ningún formulario de newsletter en el sitio; regla CSS muerta.
- **Sin estilos de foco (`:focus` / `:focus-visible`) definidos explícitamente** en ningún selector interactivo (enlaces, botones, inputs). Se depende enteramente del estilo por defecto del navegador, lo cual es inconsistente entre navegadores y a veces poco visible sobre fondos de color (por ejemplo, sobre `--primary-dark` en la sección `.cta`).
- **Contraste de color insuficiente en el botón flotante de WhatsApp** (`.whatsapp`): texto blanco "WA" sobre fondo `#25d366`. Ratio de contraste calculado ≈ **1.98:1**, muy por debajo del mínimo WCAG AA de 4.5:1 (o 3:1 para texto grande). Es un fallo objetivo y verificable, no una estimación.
- **`.btn-primary` (texto blanco sobre `--primary` `#1f7a8c`)** da un contraste ≈ 4.98:1 — aprueba AA por muy poco margen; conviene no oscurecer más el fondo en futuros cambios de marca.

---

## 5. JavaScript

**Aspectos positivos:**
- `js/main.js` (87 líneas) es compacto, legible, sin dependencias externas y cubre 4 funcionalidades independientes: menú móvil, acordeón de FAQ, filtros por categoría y botón "volver arriba", más animación de entrada con `IntersectionObserver`.
- Buen manejo defensivo: comprueba existencia de elementos antes de añadir listeners (`if (menuToggle && navLinks)`).
- Usa `IntersectionObserver` con `unobserve` tras la primera aparición (evita recalcular innecesariamente) y tiene *fallback* si el navegador no lo soporta.
- Mantiene sincronizados los atributos `aria-expanded` con el estado visual en el menú y el acordeón de FAQ — buena práctica de accesibilidad ya aplicada.

**Problemas detectados:**
- **Archivos JS vacíos y sin usar**: `js/darkmode.js`, `js/slider.js`, `js/topbutton.js` (0 bytes cada uno) no están enlazados en ningún HTML. El nombre `darkmode.js` sugiere una función de modo oscuro planeada (el README no la menciona) que nunca se implementó; puede generar confusión sobre si el sitio "tiene" modo oscuro o no.
- **Filtros no reflejan estado accesible**: como se indicó en HTML, el `dataset.filter` activo se marca solo por clase CSS, sin `aria-pressed` en el botón.
- **No hay gestión de errores/estado en el envío del formulario** de contacto (es normal en un formulario que apunta a FormSubmit sin backend propio, pero no hay ningún mensaje de confirmación o validación adicional en cliente más allá de `required` nativo del navegador).
- **No hay JS de analítica/monitorización** (Google Analytics, Plausible, etc.) — no es un defecto en sí, pero significa que actualmente no hay forma de medir tráfico ni uso real de las páginas.

---

## 6. Diseño responsive

- Dos breakpoints activos y coherentes: `980px` (tablet — colapsa a menú hamburguesa y grids de 2 columnas) y `640px` (móvil — una columna, botones a ancho completo).
- Uso de `grid-template-columns: repeat(3, minmax(0, 1fr))` que degrada limpiamente a 2 y luego 1 columna.
- Tipografía fluida vía `clamp()` reduce la necesidad de overrides de `font-size` en los media queries.
- El menú móvil (`.nav-links` con `display:none/flex` según `.active`) es simple y funcional.
- **Riesgo real**: como se indicó en la sección 4, existe un segundo archivo de responsive (`css/reponsive.css`) con un breakpoint y comportamiento distintos que, de enlazarse por error algún día, entraría en conflicto directo con el sistema actual.
- No se detectan `overflow-x` no controlados evidentes en el CSS, pero el nombre de marca completo en el `<span>` del logo (`"Aprendiendo Juntos sobre Transtorno del Espectro Autista - TEA"`) es muy largo para caber junto al `logo-mark` en pantallas pequeñas; solo se mitiga parcialmente con `max-width: 190px` en el breakpoint de 640px, lo que provocará truncado/recorte de texto en el móvil más pequeño (no hay `text-overflow: ellipsis` explícito para ese `max-width`, así que el texto probablemente se corta de forma abrupta o desborda según el navegador).
- No se usan unidades `vw`/`vh` peligrosas sin `clamp`/`min`/`max` que puedan romper en pantallas muy pequeñas o muy grandes, salvo el cálculo de padding en `.soft` que usa `calc((100vw - var(--container)) / 2 + 24px)`, correctamente protegido con `max()`.

---

## 7. Accesibilidad (WCAG 2.2)

| Criterio WCAG | Estado | Detalle |
|---|---|---|
| 1.1.1 Contenido no textual | ⚠️ Parcial | Imágenes de contenido con buen `alt`; iconos de 2 letras (`card-icon`) sin `aria-hidden`, leídos como texto sin sentido. |
| 1.3.1 Información y relaciones | ❌ Falla | Formulario de contacto sin `<label>` asociado a los inputs. |
| 1.4.3 Contraste mínimo | ❌ Falla (verificado) | Botón flotante de WhatsApp: contraste ≈1.98:1 (mínimo requerido 4.5:1). |
| 2.1.1 Teclado | ✅ Cumple | Todos los controles son `<button>`/`<a>` nativos, operables por teclado. |
| 2.4.1 Evitar bloques | ❌ Falla | No existe "skip link" para saltar la navegación repetida. |
| 2.4.3 Orden del foco | ⚠️ No verificable sin ejecución, pero el DOM sigue un orden lógico razonable. |
| 2.4.6 Encabezados y etiquetas | ✅ Cumple en general | Un `h1` por página, jerarquía coherente. |
| 2.4.7 Foco visible | ❌ Falla | No hay estilos `:focus-visible` personalizados; depende 100% del navegador. |
| 3.3.2 Etiquetas o instrucciones | ❌ Falla | Mismo problema del formulario de contacto (solo `placeholder`). |
| 4.1.2 Nombre, función, valor | ⚠️ Parcial | Botones de filtro no exponen `aria-pressed`; el botón de menú carece de `aria-controls`. |
| Movimiento reducido | ✅ Cumple | `@media (prefers-reduced-motion: reduce)` implementado correctamente. |

**Resumen:** el sitio tiene buenas intenciones de accesibilidad (los desarrolladores claramente pensaron en `aria-expanded`, `aria-label`, reduced-motion), pero le faltan piezas estándar y fáciles de añadir: etiquetas de formulario, skip link, estilos de foco y corregir el contraste del botón de WhatsApp. Con el estado actual, el sitio **no pasaría una auditoría WCAG 2.2 nivel AA**.

---

## 8. SEO

**Aspectos positivos:**
- `robots.txt` y `sitemap.xml` presentes.
- Metaetiquetas `description` presentes y de longitud razonable en las 6 páginas, cada una distinta (no duplicada).
- Estructura de `<title>` por página con patrón "Página | Marca" (bueno para SEO, salvo por la longitud).
- Un único `<h1>` claro por página, alineado con el contenido.
- `lang="es"` correcto para SEO multilingüe/geolocalizado.

**Problemas detectados:**
- **Error crítico en `robots.txt`**: la línea `Sitemap:` apunta a `https://autismoproyecto25-droid.io/AprendiendoJuntosTEA/sitemap.xml`, mientras que `sitemap.xml` y el propio sitio (según convención de GitHub Pages) usan el dominio `https://autismoproyecto25-droid.github.io/AprendiendoJuntosTEA/`. Falta `.github` en el dominio del `robots.txt` — **la URL del sitemap declarada en robots.txt es inválida y los rastreadores no la resolverán.**
- **Inconsistencia ortográfica "Transtorno" vs. "Trastorno"** en títulos, meta descripciones, encabezados y textos de marca (ver detalle en sección 12). Impacto SEO directo: la keyword objetivo que la gente busca en Google es "trastorno del espectro autista", no "transtorno". El sitio compite mal en ese término clave en la mayoría de páginas.
- **Sin metaetiquetas Open Graph ni Twitter Card** (`og:title`, `og:description`, `og:image`, `twitter:card`) en ninguna página — los enlaces compartidos en redes sociales o WhatsApp no mostrarán una vista previa enriquecida, algo especialmente relevante dado que el sitio ya promueve contacto vía WhatsApp.
- **Sin `<link rel="canonical">`** en ninguna página.
- **Sin datos estructurados (JSON-LD / schema.org)** — para un sitio de recursos/salud educativa, marcar tipo `Organization`, `FAQPage` (ya hay contenido de FAQ listo para ese schema) o `WebSite` aportaría resultados enriquecidos en buscadores.
- **Títulos demasiado largos** (>60 caracteres) en varias páginas, con riesgo de truncamiento en resultados de búsqueda.
- **Imagen huérfana no indexable**: `images/resources/Niño con materiales educativos.png` (2.4 MB) no está enlazada desde ninguna página, por lo que ni siquiera aporta a SEO de imágenes pese a su peso.
- **Nombres de archivo de imagen con espacios y tildes** (`Familia interactuando con niño.png`, `Niño con materiales educativos.png`): generan URLs con caracteres codificados (`%20`, `%C3%B1`), menos limpias para SEO e indexación de imágenes que un slug tipo `familia-interactuando-nino.png`.
- **Favicon de 270 KB en formato `.ico`**: no afecta SEO directamente, pero es un desperdicio de peso para un recurso que se carga en cada página.

---

## 9. Rendimiento (análisis estático) y estimación tipo Lighthouse

> Nota metodológica: no se ejecutó Lighthouse en un navegador real dentro de esta auditoría (no se lanzó ningún servidor ni se modificó el repositorio). Las cifras siguientes provienen de medir directamente el peso de los archivos en disco y de examinar cómo se cargan.

**Pesos reales encontrados (el hallazgo más importante de esta auditoría):**

| Recurso | Peso |
|---|---|
| `images/activities/Motricidad.jpg` | 2.54 MB |
| `images/resources/Niño con materiales educativos.png` (no usada) | 2.46 MB |
| `images/banners/Familia interactuando con niño.png` | 2.25 MB |
| `images/activities/Colores.jpg` | 2.23 MB |
| `images/activities/Sensorial.jpg` | 2.14 MB |
| `images/activities/Emociones.jpg` | 1.93 MB |
| `images/activities/Musica.jpg` | 1.87 MB |
| `images/activities/Lectura.jpg` | 0.63 MB |
| `images/logo/favicon.ico` | 0.27 MB |
| **Total imágenes** | **~16.3 MB** |
| CSS + JS combinados (sin minificar) | ~13 KB (insignificante) |

- La página de inicio (`index.html`) carga por sí sola el banner (2.25 MB) más 3 imágenes de actividades (Sensorial, Emociones, Lectura ≈ 4.7 MB), es decir, **cerca de 7 MB solo en imágenes** antes de cualquier interacción. Esto es entre 15 y 30 veces más de lo recomendable para una landing page (idealmente <1–2 MB totales de imágenes por página en conexiones móviles).
- `pages/actividades.html` carga las 6 imágenes de actividades a la vez ≈ **11.3 MB** en una sola carga de página.
- **Ninguna imagen tiene atributos `width`/`height` explícitos en el HTML**, lo que impide al navegador reservar espacio antes de la carga y contribuye a *Cumulative Layout Shift* (CLS) — aunque el CSS mitiga parcialmente esto con `aspect-ratio` en `.hero-image img` y `.activity-card img`, no todas las imágenes están cubiertas por esas reglas (por ejemplo, el `<img>` de banner en el hero sí, pero conviene verificar cada instancia).
- **Ninguna imagen usa `loading="lazy"`**, por lo que todas las imágenes de una página (incluidas las que están fuera de la vista inicial, como las 6 de `actividades.html`) se descargan de inmediato.
- **No hay imágenes responsive** (`srcset`/`sizes`, ni `<picture>` con formatos modernos como WebP/AVIF). Se sirve el mismo archivo PNG/JPG de resolución completa tanto a un móvil de 375px de ancho como a un monitor 4K.
- **Fuente externa**: Google Fonts (Poppins) se carga vía `<link>` con `preconnect` correctamente configurado — buena práctica ya aplicada, reduce el costo de la conexión TLS inicial.
- **CSS/JS no minificados**, pero su peso combinado (~13 KB) es tan bajo que minificarlos apenas movería la aguja frente al problema de las imágenes.
- **Estimación cualitativa de Lighthouse** (no medida, inferida): la puntuación de **Performance probablemente sea baja-media (rango 40–65/100 en 4G simulado)**, penalizada casi exclusivamente por *Largest Contentful Paint* (LCP) alto debido al peso de imágenes, no por JS/CSS. Accesibilidad probablemente en rango medio (70–85/100) por los fallos WCAG documentados en la sección 7. SEO probablemente medio-alto (80–90/100) si no fuera por el error del sitemap en `robots.txt` y la ausencia de Open Graph.

**Este es, con diferencia, el problema técnico más impactante y más fácil de cuantificar de todo el proyecto.**

---

## 10. Organización del código

- Convención de nombres de carpetas correcta (`css/`, `js/`, `images/`, `pages/`).
- **Múltiples archivos duplicados/huérfanos que deberían eliminarse** (resumen consolidado):
  - Raíz: `style.css`, `reponsive.css`, `script.js`, `slider.js` (0 bytes, no referenciados).
  - `css/animation.css` y `css/reponsive.css` (no enlazados, contenido redundante o contradictorio con los archivos activos).
  - `js/darkmode.js`, `js/slider.js`, `js/topbutton.js` (0 bytes, no referenciados).
  - `components/footer.html`, `components/header.html`, `components/hero.html`, `components/navbar.html` (0 bytes, no referenciados).
  - `xml/blogger-template.xml` (residuo aparente de otra plataforma).
  - `images/resources/Niño con materiales educativos.png` (2.4 MB, no enlazada desde ningún HTML).
- **`.gitignore` está vacío** (0 bytes): no se excluye nada, por lo que archivos de editor como `.vscode/settings.json` terminan versionados en el repositorio. No es grave, pero no es buena práctica para un repo destinado a colaboración.
- El archivo `.vscode/settings.json` incluye un diccionario personalizado de `cSpell.words` que contiene **"Transtorno"** como palabra aceptada — es decir, el corrector ortográfico del editor está configurado para silenciar precisamente el error tipográfico más relevante del sitio (ver secciones 8 y 12).
- El `README.md` es breve pero correcto y describe bien el objetivo del sitio; no documenta la existencia de archivos huérfanos ni advierte sobre el estado incompleto de `components/`.

---

## 11. Compatibilidad con GitHub Pages

- **Rutas relativas correctas**: `index.html` usa rutas sin prefijo (`css/…`, `images/…`, `pages/…`) y las páginas internas usan `../` correctamente para volver a la raíz. Esto es compatible tanto con un *user/organization site* como con un *project site* (`usuario.github.io/AprendiendoJuntosTEA/`), que es el caso aquí según `sitemap.xml`.
- **No requiere build step**: al ser HTML/CSS/JS puro, GitHub Pages lo sirve directamente sin configuración adicional (no hace falta GitHub Actions ni Jekyll).
- **Riesgo de sensibilidad a mayúsculas/minúsculas y caracteres especiales**: GitHub Pages sirve desde un sistema de archivos Linux, sensible a mayúsculas/minúsculas, a diferencia de Windows (donde aparentemente se desarrolló el sitio, según las rutas absolutas del entorno). Los nombres de archivo con espacios y tildes (`Familia interactuando con niño.png`, `Niño con materiales educativos.png`) **funcionan hoy porque las referencias en el HTML coinciden exactamente**, pero son una fuente de errores frágil: cualquier cambio de mayúsculas, un `git mv` mal hecho en Windows, o un futuro colaborador en Linux/Mac que renombre el archivo puede romper el enlace de forma silenciosa (404 en producción sin aviso local, porque en Windows el sistema de archivos no distingue mayúsculas). Se recomienda renombrar todos los assets a minúsculas, sin espacios ni tildes (slugs), independientemente de si hoy "funciona".
- **No hay archivo `404.html` personalizado**: GitHub Pages permite definir una página 404 propia; sin ella, un enlace roto muestra la página de error genérica de GitHub, rompiendo la identidad visual del sitio.
- **No hay archivo `CNAME`**: coherente con que el sitio usa el dominio `github.io` por defecto (confirmado en `sitemap.xml`), no haría falta salvo que se planee un dominio propio.
- **HTTPS**: al usar GitHub Pages con dominio `github.io`, HTTPS está garantizado automáticamente; no hay contenido mixto (`http://`) detectado en los enlaces externos revisados (Google Fonts y WhatsApp usan `https://`).

---

## 12. Problemas de UX

- **Inconsistencia de marca en el logo**: la marca corta del logo (`logo-mark`) muestra **"TEA"** en `index.html` pero **"AJ"** en las 5 páginas internas — el usuario ve un logo distinto según si está en el home o en el resto del sitio, lo cual es confuso para el reconocimiento de marca.
- **Inconsistencia en el texto del logo**: el texto largo junto al logo tiene **tres variantes distintas** entre páginas: la marca completa larga (`"Aprendiendo Juntos sobre Transtorno del Espectro Autista - TEA"`) en `index.html`, `actividades.html` y `padres.html`; y una versión corta (`"Aprendiendo Juntos TEA"`) en `contacto.html`, `recursos.html` y `tea.html`. No hay un criterio aparente para cuál usar dónde.
- **Tiempos de carga percibidos**: dado el peso de imágenes (sección 9), en conexiones móviles medias/lentas el usuario verá el hero y las tarjetas de actividades cargar de forma muy lenta o con imágenes en blanco durante varios segundos, lo cual en un sitio dirigido a familias (que pueden acceder desde datos móviles) es una barrera de acceso real al contenido, no solo un problema técnico abstracto.
- **Botón "volver arriba" sin animación de aparición** y controlado solo por `style.display` en JS en lugar de una clase con transición — funciona, pero el cambio es abrupto (aparece/desaparece de golpe) en lugar de un fade suave, lo que contrasta con el resto del sitio que sí cuida las transiciones (`.show`, `hover` con `transform`).
- **El formulario de contacto no da feedback de éxito/error dentro del sitio**: al enviarse a FormSubmit, el usuario es redirigido fuera del dominio (comportamiento por defecto de FormSubmit sin `_next` configurado); no hay confirmación visual controlada por el propio sitio ni manejo de error si el envío falla.
- **Los iconos de tarjeta ("CO", "AC", "RV"...) no comunican significado visual** por sí mismos a un usuario vidente que escanee rápido — son iniciales abstractas sin un pictograma o icono real, lo cual es una oportunidad perdida especialmente notable en un sitio centrado en apoyos *visuales* para TEA (la propia guía de contenido del sitio recomienda "usar apoyos visuales", pero el propio sitio usa iniciales de texto en vez de iconografía).
- **Filtros de actividades/recursos sin indicación de "0 resultados"**: si en el futuro se añaden más categorías y un filtro no matchea ninguna tarjeta, no hay un estado vacío diseñado; el usuario vería una sección en blanco sin explicación.

---

## 13. Contenido

- **Error ortográfico sistemático "Transtorno" → debería ser "Trastorno"**: 24 apariciones de la forma incorrecta frente a 5 de la forma correcta (todas concentradas en `pages/tea.html`, que fue aparentemente corregida en el último commit — "Fix accents in TEA page copy" — pero sin propagar la corrección al resto del sitio). Esto afecta: `<title>`, `<meta description>`, `<h1>`, texto de navegación, logo y footer de `index.html`, `pages/actividades.html`, `pages/contacto.html`, `pages/padres.html`, `pages/recursos.html`, y también aparece en `README.md`.
- **Tono y redacción del contenido**: en general muy bien logrado — lenguaje respetuoso, centrado en la persona ("el TEA no define a una persona"), no alarmista, con secciones de mitos/realidades bien planteadas. Este es uno de los puntos más fuertes del proyecto.
- **Minúsculas después de punto/en inicios de frase**: se detectan varias inconsistencias menores de capitalización, por ejemplo "navegación" como encabezado de columna del footer en minúscula (`<h3>navegación</h3>` en `index.html`) mientras el resto de encabezados de esa misma sección usan mayúscula inicial, y "exploración con texturas..." iniciando en minúscula dentro de un párrafo que debería empezar en mayúscula.
- **Número de contacto y correo duplicados manualmente en 6 footers**: cualquier cambio de WhatsApp o correo debe replicarse a mano en cada página (riesgo de desincronización ya mencionado en Arquitectura).
- **Fecha de copyright "2026"**: coherente con la fecha actual del sistema, no es un error, pero conviene confirmar que se actualiza cada año si no hay automatización.

---

## 14. Estructura del sitio

```
/ (index.html)                    → Inicio
├── pages/tea.html                → ¿Qué es el TEA?
├── pages/recursos.html           → Recursos (con filtros)
├── pages/actividades.html        → Actividades (con filtros)
├── pages/padres.html             → Para familias
└── pages/contacto.html           → Contacto (formulario)
```

- Estructura plana y poco profunda (todas las páginas internas a un solo nivel bajo `pages/`), lo cual es apropiado para un sitio de 6 páginas: fácil de navegar, buena para SEO (todo a un clic desde el home).
- La navegación principal y el `sitemap.xml` están alineados (mismas 6 URLs, sin páginas huérfanas fuera del sitemap y sin URLs en el sitemap que no existan).
- No hay breadcrumbs, pero con solo un nivel de profundidad no son estrictamente necesarios.
- No hay una página de búsqueda interna ni un índice/mapa del sitio visible para el usuario (más allá del menú), lo cual es razonable para 6 páginas pero podría quedarse corto si el catálogo de recursos/actividades crece.

---

## 15. Tabla resumen de hallazgos priorizados

| # | Hallazgo | Categoría | Severidad |
|---|---|---|---|
| 1 | Imágenes sin optimizar/comprimir (~16 MB totales, hasta 2.5 MB cada una) | Rendimiento | 🔴 Crítica |
| 2 | Sin `loading="lazy"`, `srcset` ni formatos modernos (WebP/AVIF) en imágenes | Rendimiento | 🔴 Crítica |
| 3 | URL del sitemap incorrecta en `robots.txt` (dominio `.io` en vez de `.github.io`) | SEO | 🔴 Crítica |
| 4 | "Transtorno" (incorrecto) usado en la mayoría de títulos/metadatos en vez de "Trastorno" | SEO / Contenido | 🔴 Crítica |
| 5 | Formulario de contacto sin `<label>` en los campos | Accesibilidad | 🟠 Alta |
| 6 | Contraste insuficiente (≈1.98:1) en el botón flotante de WhatsApp | Accesibilidad | 🟠 Alta |
| 7 | Sin skip-link ni estilos de foco visibles | Accesibilidad | 🟠 Alta |
| 8 | Duplicación completa de header/nav/footer en 6 archivos, sin sistema de includes | Arquitectura | 🟠 Alta |
| 9 | Archivos y CSS/JS muertos (raíz, `components/`, `css/animation.css`, `css/reponsive.css`, `js/*.js` vacíos) | Organización | 🟡 Media |
| 10 | Imagen no utilizada de 2.4 MB (`images/resources/Niño con materiales educativos.png`) | Organización / Rendimiento | 🟡 Media |
| 11 | Inconsistencia de logo/marca entre `index.html` y páginas internas | UX / Contenido | 🟡 Media |
| 12 | Sin Open Graph / Twitter Card / canonical / datos estructurados | SEO | 🟡 Media |
| 13 | Nombres de archivo de imagen con espacios y tildes | GitHub Pages / SEO | 🟡 Media |
| 14 | Botones de filtro sin `aria-pressed`, menú sin `aria-controls` | Accesibilidad | 🟢 Baja |
| 15 | `.gitignore` vacío; `.vscode/settings.json` versionado con "Transtorno" en el diccionario | Organización | 🟢 Baja |
| 16 | Sin página `404.html` personalizada | GitHub Pages / UX | 🟢 Baja |
| 17 | Favicon de 270 KB (excesivo para su función) | Rendimiento | 🟢 Baja |

---

## 16. Conclusión

El sitio "Aprendiendo Juntos TEA" tiene un propósito claro, contenido bien redactado y una implementación técnica sencilla que encaja con GitHub Pages sin fricción. El problema no es de concepto ni de tono, sino de **pulido técnico**: el peso de las imágenes es, con mucho, el mayor obstáculo real para los usuarios (especialmente en móvil, el dispositivo más probable para una familia buscando recursos rápidos), seguido de cerca por la inconsistencia ortográfica de la palabra clave del propio nicho del sitio ("Trastorno") y por vacíos de accesibilidad que son sencillos de corregir uno por uno.

Ninguno de los hallazgos requiere rediseñar el sitio: son correcciones puntuales y acotadas. Tal como se pidió, este informe no incluye código ni cambios — es un diagnóstico para decidir, con esta lista priorizada, qué abordar primero.
