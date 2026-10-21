# Importaciones de componentes en Marketpath

Referencia: ZIP `services-page-example.zip` proporcionado por el usuario el 19 de octubre de 2026. Los nombres y el dominio de los ejemplos siguientes son genéricos.

## Página, entidad y ruta

Una página de tipo Article se declara explícitamente en el array `Article`. El ejemplo recibido contiene:

```json
{
  "Article": [{
    "Name": "Services Cards with Overlay Example",
    "Title": "Services Cards with Overlay Example",
    "PostDate": "2026-10-19 14:07:26.043",
    "URL": "//example.marketpath.site/services-cards-with-overlay-example",
    "TemplateGUID": "/pages/_services-03-example.liquid",
    "BrowserTitle": "Services Cards with Overlay Example",
    "IncludeInSearch": true,
    "SummaryHTML": null,
    "ContentHTML": null
  }]
}
```

- `Article` es la entidad de la página. `TemplateGUID` la conecta con su template de página.
- `URL` en esta referencia incluye el dominio destino y la ruta, con la forma `//dominio/ruta`.
- `Datastore.DefaultRootPath` organiza las rutas del datastore. No sustituye el registro `Article` ni su `URL`.
- El datastore Services del ejemplo tiene `CreatePageByDefault: false`, `DefaultRootPath: "/services/"` y `EnforceRootPath: false`. Sus tres `DatastoreItem` tienen contenido, pero no tienen `URL` ni `TemplateGUID`: el ejemplo por sí solo no demuestra la creación de páginas individuales para esos items.
- El ZIP de referencia no incluye `Template`. Por tanto, su `Article.TemplateGUID` referencia un template que debe existir en el sitio. Nuestro exportador incluye los templates seleccionados en su propio paquete.

El artículo de la referencia no contiene Page Custom Fields. Para llenar también la sección, nuestro exportador añade los valores de ejemplo al artículo usando los FieldIDs como claves: `services_title`, `services_description`, `services_items`, etc. La lista `services_items` referencia los `Name` de los registros de Services. Esta parte debe verificarse en el CMS; no está demostrada por el artículo vacío de campos del ZIP recibido.

## Imágenes y datastores

El archivo binario por sí solo no declara una imagen en el JSON. El paquete de referencia relaciona las tres piezas así:

```json
{
  "Image": [{
    "Name": "placeholder.jpg",
    "Title": "Example placeholder",
    "Alt": "Example image placeholder",
    "Attribution": "",
    "FileGUID": "image/placeholder.jpg"
  }],
  "DatastoreItem": [{
    "Name": "Example Service 1",
    "Title": "Home repairs",
    "DatastoreGUID": "Services",
    "services_image": "placeholder.jpg",
    "services_summary": "<p>Example summary.</p>",
    "services_content": "<p>Example content.</p>"
  }]
}
```

El ZIP incluye físicamente `image/placeholder.jpg`. El nombre del campo de imagen coincide con `Image.Name`; `Image.FileGUID` coincide con la ruta del archivo dentro del ZIP. `DatastoreItem.DatastoreGUID` referencia el datastore `Services` por su nombre en este paquete.

## Comportamiento del catálogo

**Example content** importa los registros de muestra de los datastores y sus imágenes, sin crear un Article ni rutas. No requiere dominio. En Services se generan tres items con imagen, resumen y contenido. En componentes sin datastore, los textos de Page Fields se importan cuando se crea una página de ejemplo.

Dentro de **Example content**, la opción **Do you want to create a page example?** está desmarcada por defecto. Al activarla aparecen el dominio destino y la ruta deseada. Solo entonces el exportador construye `Article.URL` con ambos valores y conserva su template y sus valores de ejemplo. En Services Detail Page, la ruta se usa como raíz para las páginas individuales y se añade el nombre de cada servicio. No copiar un dominio real de un paquete de referencia al código.

Al descargar Main Services (Cards Classic, Stack Cards, Cards with Overlay, etc.), incluir únicamente el partial del componente y el template de la página de ejemplo: por ejemplo, `/partials/services/services-03.liquid` y `/pages/_services-03-example.liquid`. El Article de ejemplo referencia ese template de página. No añadir templates de detalle, rutas individuales ni `DefaultTemplateGUID` a los items o al datastore Services desde esta descarga. Services Detail Page se importa únicamente cuando el usuario selecciona ese componente de Inside Services.

Main Services importa sus propios registros de Services. Los FAQs corresponden a Services Detail Page, que declara esa dependencia. Las páginas de entidades de Services usan `DatastoreItem.URL` y `TemplateGUID`; son páginas de tipo DatastoreItem, distintas de una página de listado de tipo Article. Conservar los nombres, títulos y datos de cada servicio al copiar los Page Fields del detalle: no copiar los metadatos de un Article encima de un DatastoreItem.

La estructura anterior se basa en el archivo recibido y en el exportador local. Una comprobación del JSON o del build no confirma que Marketpath haya creado la página; confirmar ese resultado importando en el sitio destino.
