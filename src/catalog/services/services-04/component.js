import { serviceFields } from '../shared-fields.js';

export default {
  id: 'services-04',
  name: 'Alternating Service Feature Rows',
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
      <div class="col-12"><article class="row g-0 align-items-stretch"><div class="col-12 col-lg-6"><div class="h-100 d-flex flex-column justify-content-center text-white p-4 p-lg-5 bg-primary"><h3 class="display-6 fw-bold mb-3">Project Planning</h3><div class="mb-4">Clear advice and a thoughtful plan help make every project easier to navigate.</div><a class="btn btn-outline-light align-self-start" href="#">Learn More</a></div></div><div class="col-12 col-lg-6"><div class="ratio ratio-1x1 overflow-hidden"><svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="600" height="600" fill="#e1e9e6"/><rect x="70" y="70" width="530" height="370" fill="#879991"/><path d="M70 130h530M70 190h530M70 250h530M70 310h530M70 370h530" stroke="#a6b5ae" stroke-width="8"/><rect x="325" y="120" width="195" height="145" fill="#bad0d4" stroke="#f5f0e5" stroke-width="12"/><path d="M420 126v133m-89-66h183" stroke="#f5f0e5" stroke-width="8"/><path d="M0 450h600v150H0z" fill="#967656"/><path d="M0 495h600M0 545h600" stroke="#c4a27b" stroke-width="7"/></svg></div></div></article></div>
      <div class="col-12"><article class="row g-0 align-items-stretch flex-lg-row-reverse"><div class="col-12 col-lg-6"><div class="h-100 d-flex flex-column justify-content-center text-white p-4 p-lg-5 bg-dark"><h3 class="display-6 fw-bold mb-3">Home Improvements</h3><div class="mb-4">Bring comfort, function, and lasting quality to the spaces you use every day.</div><a class="btn btn-outline-light align-self-start" href="#">Learn More</a></div></div><div class="col-12 col-lg-6"><div class="ratio ratio-1x1 overflow-hidden"><svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="600" height="600" fill="#d6e6e8"/><rect y="72" width="600" height="340" fill="#536c73"/><path d="M0 145h600M0 210h600M0 275h600M0 340h600" stroke="#71888c" stroke-width="8"/><rect x="80" y="120" width="180" height="180" fill="#cadbdd" stroke="#eee9dc" stroke-width="14"/><rect x="330" y="120" width="190" height="180" fill="#cadbdd" stroke="#eee9dc" stroke-width="14"/><path d="M170 127v166m-83-83h165m255-83v166m-88-83h176" stroke="#eee9dc" stroke-width="8"/><path d="M0 412h600v188H0z" fill="#9a795a"/><path d="M0 458h600M0 510h600M0 562h600" stroke="#c29d75" stroke-width="7"/></svg></div></div></article></div>
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
