# Marketpath Components

Biblioteca visual de wireframes Bootstrap para Marketpath CMS, construida con **Astro** y salida estática.

## Requisitos

- Node `>= 22.12` o Bun `>= 1.2`.
- Conexión a Internet en runtime: Bootstrap 5.3.3, Bootstrap Icons y Prism 1.29.0 se cargan por CDN.

## Comandos

- `bun install` — instala dependencias.
- `bun run dev` — servidor de desarrollo con HMR en `http://localhost:4321`.
- `bun run build` — genera el sitio estático en `dist/`.
- `bun run preview` — sirve `dist/` localmente.
- `bun run check` (o `node tests/check.cjs`) — valida el contrato del catálogo.

## Uso

Filtra desde los grupos desplegables Services, Projects, Layout, Resources y Content; solo un grupo queda abierto a la vez. Services agrupa Services e Inside Services; Projects agrupa Projects e Inside Projects. También puedes buscar por nombre, ID, descripción y tags. `/` enfoca la búsqueda. Haz clic en un preview para abrir el detalle, o en **View code** para ir al Template. Las pestañas admiten flechas, Home y End; Escape cierra el diálogo y devuelve el foco. Desktop, Tablet y Mobile usan viewports reales de 1200, 768 y 390 px, escalados para caber en la ventana. El contenido largo se desplaza dentro del iframe.

Copy Template copia solamente Liquid/HTML. Copy Fields copia solamente JSON. Si el navegador no permite Clipboard API, se intenta la copia nativa; si también falla, se selecciona el código y se indica cómo copiarlo manualmente.

En el detalle de cada variante Services puedes descargar un paquete JSON vacío con el partial, sus Page Fields, el template de página y el datastore. **Create Files** genera el mismo paquete con tres items de servicio de ejemplo sin imágenes y un Article que ya los selecciona.

## Estructura

- `src/catalog/<category>/<id>/component.js`: un template por carpeta, como `src/catalog/services/services-02/component.js`. Exporta un objeto default con metadata, mockup, Liquid, fields y notes.
- `src/catalog/<category>/shared-fields.js`: Fields de página compartidos por variantes de una categoría. Testimonials comparte sus Page Fields; CTA 01/02 comparten `cta_datastore_item`; Services 01/02/03 importan `services_eyebrow`, `services_title`, `services_description`, `services_items`; Gallery usa los IDs `gallery_filters`, `gallery_title`, `gallery_images`. Estas definiciones compartidas permiten copiar el JSON entre variantes.
- `src/data/components.js`: descubre y ordena las carpetas automáticamente; no se mantiene una lista manual.
- `src/datastores/<id>/datastore.js`: schemas compartidos por varios templates; `src/data/datastores.js` los descubre automáticamente.
- `src/components/ui/ComponentCard.astro`: tarjeta visual compartida para todos los templates.
- `src/pages/index.astro`: homepage generada en build desde el catálogo (tarjetas, filtros y contadores).
- La pestaña **Fields** contiene los Custom Fields de la página. El botón global **View Datastore**, junto al resumen de resultados, muestra y copia schemas compartidos.
- `src/scripts/gallery.js`: búsqueda, filtros, diálogo, tabs, copia y tamaños de preview (isla de cliente).
- `src/lib/utils.js`: `escapeHtml`, `categoryLabel` y `previewDocument` (documento del iframe con CSP).
- `src/layouts/Layout.astro`: `<head>`, dependencias CDN y CSS global.
- `src/styles/app.css`: estilos de la biblioteca, aislados de los componentes.
- `tests/check.cjs`: comprobación ejecutable sin dependencias.

Para agregar un template, crea `src/catalog/<category>/<id>/component.js` y exporta el objeto del componente (`export default { ... }`). No cambies la homepage, las tarjetas ni el registro: Astro descubre la carpeta y genera categoría, filtro, contador, preview y diálogo automáticamente. Si varias variantes necesitan los mismos Page Fields, impórtalos desde `<category>/shared-fields.js` y usa el mismo `sharedFieldsId`; así se copia el JSON una vez y después se puede pegar solo el markup de otra variante. Los componentes pueden referenciar un registro único con `datastoreitem` o una selección múltiple con `datastoreitemlist`; en ambos casos, crea el schema una sola vez en `src/datastores/<id>/datastore.js` y enlázalo mediante `datastoreId`. `preview.html` es HTML de muestra escrito de forma independiente: no se interpreta Liquid y `mockData` es su referencia editorial, no un motor de rendering. El catálogo es código local de confianza; los iframes están aislados mediante sandbox y CSP.

## Llevar un componente a Marketpath

1. Copia Template al template de la página.
2. Copia Fields al editor JSON de Custom Fields. Si el template ya tiene campos, añade el grupo al array existente; no reemplaces su contenido.
3. Carga Bootstrap 5.3 CSS una vez en la página. Para FAQ y Gallery, carga también `bootstrap.bundle.min.js` una vez.
4. Crea los presets citados en Notes; los nombres son requisitos del proyecto, no presets incorporados: `1920x1080-crop`, `800x600-crop`, `1920x600-crop`, `720x480-crop` y `300x300-max` (Logo Carousel).
5. Revisa Notes para identificar si la sección necesita Page Custom Fields o usa el datastore global **Page Settings**. Los campos opcionales se protegen con `is_valid`.

Gallery 01 usa `taglist` para filtros y `imagelist` para las imágenes. Añade tags coincidentes a las imágenes y carga Bootstrap Icons CSS, además del bundle de Bootstrap indicado en Notes.

Gallery 02 comparte los mismos Page Fields y presenta una cuadrícula masonry de proporción natural. Sus imágenes abren un lightbox con carrusel; carga el bundle de Bootstrap indicado en Notes.

Gallery 03 también comparte los Page Fields de Gallery 01 y 02. Muestra una imagen grande arriba y miniaturas seleccionables en filas de cuatro (tres en tablet y dos en móvil), además de filtros por tags; no requiere Bootstrap JavaScript.

Page Title 01 (Solid) y Page Title 02 (Image) comparten los Fields de fuente del título, título custom y breadcrumbs. Cada variante añade solo su propio campo de fondo. Son Page Custom Fields, no usan datastore; el breadcrumb utiliza `Home`, el padre directo si existe y la página actual.

Generic Pages / Inside Services muestra un item del datastore Services, links laterales seleccionables desde Services y FAQs seleccionables desde el datastore FAQs. Generic Pages / Inside Projects muestra un item de Projects. FAQ 01 (Accordion) y FAQ Main (FAQ 02) usan el datastore FAQs: el título del item es la pregunta y `faq_answer` es una respuesta HTML.

Projects 01 (Project Cards) usa el datastore Projects y el Field `projects_items`. Cada tarjeta completa enlaza al proyecto, usa su título predeterminado y muestra `project_image` (o la primera imagen de `project_images`); el summary/content y demás detalles quedan disponibles para una página de proyecto individual. El panel de acción aparece al hover/focus y se mantiene visible en touch.

Blog 01 no usa Page Custom Fields; consulta el blog de Marketpath, los posts, query parameters y Page Settings. La variable Liquid `blog` puede indicar el nombre del blog y por defecto usa `Blog`. El layout muestra listados o un post individual según la URL. Si los posts tienen imágenes, crea los presets `960x540-crop`, `600x338-crop` y `200x200-crop`.

Banner 02 (Experience & Contact) lee `settings.company_address` y `settings.company_email`; su único Page Custom Field es el número de experiencia. Los headers y footers leen los campos globales de **Page Settings**, cuyo schema puede copiarse desde **View Datastore**. Asegúrate de que el header cargue el datastore y asigne `settings` antes de renderizar esos componentes.

Services 01 (Service Cards), Services 02 (Stack Cards) y Services 03 (Image Overlay Service Cards) comparten el datastore Services y los mismos Page Fields. Sus campos de datastore son `services_image`, `services_summary` y `services_content`; los dos últimos aceptan HTML. El título de cada tarjeta viene del `title` predeterminado del item de datastore. Las tres variantes leen la misma lista `services_items`. Reemplaza `WRITE HERE YOUR SERVICES GUID` en el JSON compartido por el GUID del datastore de tu sitio.

Testimonials 01 y 02 comparten el datastore Testimonials, visible desde **View Datastore**. El nombre del reviewer viene del `title` predeterminado del item; `testimonial_text` es HTML y `testimonial_highlight` es una etiqueta opcional. El GUID se configura en el Page Field de cada template. Banner 03 (Stats Banner) usa un `fieldset` repetible con hasta cuatro ítems. Banner 04 (Logo Carousel) usa un `fieldset` de imágenes y los assets Swiper de Marketpath. Carga Bootstrap Icons CSS en la página de Marketpath para mostrar los iconos seleccionables.

CTA 01 y CTA 02 comparten el Page Field `cta_datastore_item` y el datastore **Call to Action**. Configura el GUID del datastore en ese campo compartido y selecciona el mismo registro desde cualquiera de las variantes.

Los componentes usan Bootstrap estándar; `py-lg-8` no se incluye porque no existe en la distribución estándar. Hero 01, Banner 02, Services 02, Testimonials 01, Banner 04, las dos variantes de Header y Gallery declaran `customCss: true`. FAQ y Gallery usan el bundle de Bootstrap; Testimonials 01, Banner 04 y Gallery incluyen JavaScript custom inline. Las imágenes de muestra son placeholders SVG embebidos, sin descargas externas.

Los prefijos evitan colisiones entre componentes diferentes. Si repites la misma variante en una página, cambia tanto FieldIDs/referencias como IDs HTML del acordeón. Servicios 01 y FAQ tienen tres entradas fijas; las variantes de footer usan el datastore global Page Settings en lugar de Page Custom Fields propios. El selector Light/Dark del preview cambia las clases de color del markup que se muestra y copia, sin duplicar la estructura del footer. Los grupos son solo organización visual, sin un nivel extra en `entity`. No hay formularios, autenticación ni edición del catálogo en la UI.

## Documentación consultada

Revisión: 5 de octubre de 2026. Se usan las definiciones oficiales, no sintaxis de Shopify.

- [Defining Custom Fields](https://help.marketpath.com/custom-fields/defining-custom-fields) y [Field Types](https://help.marketpath.com/custom-fields/types).
- [Text](https://help.marketpath.com/custom-fields/types/text), [Textarea](https://help.marketpath.com/custom-fields/types/textarea), [Image](https://help.marketpath.com/custom-fields/types/image), [URL](https://help.marketpath.com/custom-fields/types/url), [Radio](https://help.marketpath.com/custom-fields/types/radio), [Group](https://help.marketpath.com/custom-fields/types/group) y [Toggle](https://help.marketpath.com/custom-fields/types/toggle).
- [Entity](https://help.marketpath.com/liquid/entity-object-and-entity-driven-pages): root `entity` existe; se validan sus campos opcionales.
- [Field Values](https://help.marketpath.com/liquid/field-values), [Conditions](https://help.marketpath.com/liquid/conditions-overview) y [Safe Output](https://help.marketpath.com/liquid/safe-output): texto con la salida normal; atributos con `.value | escape`.
- [Img](https://help.marketpath.com/liquid/img) e [Image presets](https://help.marketpath.com/courses/developer-basic-training/other-developer-objects/image-presets).
- [Toggle](https://help.marketpath.com/liquid/toggle): lectura con `.on`.
- [Fieldset](https://help.marketpath.com/liquid/fieldset): revisado; esta primera versión usa la alternativa de campos individuales solicitada.
- [Variables y scope](https://help.marketpath.com/liquid/methods-variables-capture): `var`/`set` para omitir listas vacías.
- [Bootstrap accordion](https://getbootstrap.com/docs/5.3/components/accordion/).

## Verificación y límites

`node tests/check.cjs` (o `bun run check`) descubre las carpetas y valida todos los componentes y sus FieldIDs únicos, tipos utilizados, correspondencia entre fields y templates, guards, escape de URLs, balance de bloques Liquid y destinos del acordeón. `bun run build` compila la galería; no sustituye al compilador de Marketpath. La prueba final de importación y renderizado dentro del CMS requiere un sitio Marketpath; esta entrega no tiene una sesión conectada al CMS.
