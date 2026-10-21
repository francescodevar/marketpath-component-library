import { serviceFields } from '../shared-fields.js';

export default {
  id: 'services-04',
  name: 'Services Alternate Feature Rows',
  category: 'services',
  prefix: 'services_',
  sharedFieldsId: 'services',
  datastoreId: 'services',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'Service datastore items displayed as alternating color panels and square images with a summary and detail link.',
  tags: ['services', 'datastore', 'alternating', 'image', 'summary'],
  template: `{%- if entity.services_items.is_valid -%}
<section class="services-04 py-5 bg-white">
  <div class="container py-2">
    {%- if entity.services_eyebrow.is_valid or entity.services_title.is_valid or entity.services_description.is_valid -%}
    <div class="row justify-content-center text-center mb-5">
      <div class="col-12 col-lg-9">
        {%- if entity.services_eyebrow.is_valid -%}
        <p class="small text-uppercase text-primary fw-semibold mb-3">{{ entity.services_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.services_title.is_valid -%}
        <h2 class="display-5 fw-bold text-dark mb-3">{{ entity.services_title }}</h2>
        {%- endif -%}
        {%- if entity.services_description.is_valid -%}
        <div class="lead text-secondary">{{ entity.services_description }}</div>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}

    <div class="row g-0">
      {%- for service in entity.services_items -%}
      {%- assign service_position = forloop.index0 | modulo: 2 -%}
      <div class="col-12">
        <article class="row g-0 align-items-stretch{% if service_position == 1 and service.services_image.is_valid %} flex-lg-row-reverse{% endif %}">
          <div class="col-12 {% if service.services_image.is_valid %}col-lg-6{% endif %}">
            <div class="h-100 d-flex flex-column justify-content-center text-white p-4 p-lg-5 {% if service_position == 1 %}bg-dark{% else %}bg-primary{% endif %}">
              {%- if service.title.is_valid -%}
              <h3 class="display-6 fw-bold mb-3">{{ service.title }}</h3>
              {%- endif -%}
              {%- if service.services_summary.is_valid -%}
              <div class="mb-4">{{ service.services_summary }}</div>
              {%- endif -%}
              {%- if service.has_url -%}
              <a class="btn btn-outline-light align-self-start" href="{{ service.full_url | escape }}">Learn More</a>
              {%- endif -%}
            </div>
          </div>
          {%- if service.services_image.is_valid -%}
          <div class="col-12 col-lg-6">
            <div class="ratio ratio-1x1 overflow-hidden">
              <img src="{% image_url = service.services_image | preset:'480x320-crop webp' %}" srcset="{% image_url = service.services_image | preset:'240x160-crop webp' %} 240w, {% image_url = service.services_image | preset:'480x320-crop webp' %} 480w, {% image_url = service.services_image | preset:'720x480-crop webp' %} 720w" sizes="(min-width: 1400px) 660px, (min-width: 1200px) 570px, (min-width: 992px) 480px, 100vw" class="w-100 h-100 object-fit-cover" alt="{{ service.services_image.alt | default: service.title | escape }}" loading="lazy" decoding="async">
            </div>
          </div>
          {%- endif -%}
        </article>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: serviceFields,
  notes: [
    'This variant uses the shared Services Page Fields and datastore. Each selected item becomes a text-and-image row; row order alternates automatically.',
    'The datastore item title is the service name, services_summary supplies the rich-text summary, and services_image supplies the image. The button uses the item URL when available.',
    'Create the 240x160-crop, 480x320-crop, 720x480-crop, and webp presets in Marketpath. A responsive srcset lets the browser choose a size close to the displayed image column.',
    'Bootstrap Icons CSS is needed for the Learn More icon.',
    'Replace the shared Services DatastoreGUID placeholder with the GUID from your site.',
  ],
  preview: {
    html: `<section class="services-04 py-5 bg-white">
  <div class="container py-2">
    <div class="row g-0">
      <div class="col-12"><article class="row g-0 align-items-stretch"><div class="col-12 col-lg-6"><div class="h-100 d-flex flex-column justify-content-center text-white p-4 p-lg-5 bg-primary"><h3 class="display-6 fw-bold mb-3">Project Planning</h3><div class="mb-4">Clear advice and a thoughtful plan help make every project easier to navigate.</div><a class="btn btn-outline-light align-self-start" href="#">Learn More</a></div></div><div class="col-12 col-lg-6"><div class="ratio ratio-1x1 overflow-hidden"><img src="sample-image:modern" class="w-100 h-100 object-fit-cover" alt=""></div></div></article></div>
      <div class="col-12"><article class="row g-0 align-items-stretch flex-lg-row-reverse"><div class="col-12 col-lg-6"><div class="h-100 d-flex flex-column justify-content-center text-white p-4 p-lg-5 bg-dark"><h3 class="display-6 fw-bold mb-3">Home Improvements</h3><div class="mb-4">Bring comfort, function, and lasting quality to the spaces you use every day.</div><a class="btn btn-outline-light align-self-start" href="#">Learn More</a></div></div><div class="col-12 col-lg-6"><div class="ratio ratio-1x1 overflow-hidden"><img src="sample-image:exterior" class="w-100 h-100 object-fit-cover" alt=""></div></div></article></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: '',
    title: '',
    description: '',
    services: [
      { title: 'Project Planning', services_image: '', services_summary: '<p>Clear advice and a thoughtful plan help make every project easier to navigate.</p>', services_content: '' },
      { title: 'Home Improvements', services_image: '', services_summary: '<p>Bring comfort, function, and lasting quality to the spaces you use every day.</p>', services_content: '' },
    ],
  },
};
