import { serviceFields } from '../shared-fields.js';

export default {
  id: 'services-03',
  name: 'Services Cards with Overlay',
  category: 'services',
  prefix: 'services_',
  sharedFieldsId: 'services',
  datastoreId: 'services',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A responsive grid of service images with titles and an animated Learn More overlay.',
  tags: ['cards', 'images', 'hover', 'datastore'],
  template: `{%- if entity.services_items.is_valid -%}
<section class="py-5">
  <div class="container py-2">
    {%- if entity.services_eyebrow.is_valid or entity.services_title.is_valid or entity.services_description.is_valid -%}
    <div class="row mb-5">
      <div class="col-12 col-lg-8 mx-auto text-center">
        {%- if entity.services_eyebrow.is_valid -%}
        <p class="text-primary fw-semibold text-uppercase mb-2">
          {{ entity.services_eyebrow }}
        </p>
        {%- endif -%}
        {%- if entity.services_title.is_valid -%}
        <h2 class="display-5 fw-bold mb-3">
          {{ entity.services_title }}
        </h2>
        {%- endif -%}
        {%- if entity.services_description.is_valid -%}
        <div class="mb-0">
          {{ entity.services_description }}
        </div>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}
    <div class="row g-4 justify-content-center">
      {%- for service in entity.services_items -%}
      <div class="col-12 col-md-6 col-lg-4">
        <a href="{{ service.full_url | escape }}" class="service-card d-block position-relative overflow-hidden shadow text-decoration-none">
          <div class="ratio ratio-4x3">
            {%- if service.services_image.is_valid -%}
            {%- img service.services_image alt:service.services_image.alt|default:'Service image' preset:'800x600-crop webp' class:'service-card-image w-100 h-100 object-fit-cover' -%}
            {%- endif -%}
            <div class="service-card-overlay position-absolute top-0 start-0 w-100 h-100"></div>
            <div class="service-card-content position-absolute bottom-0 start-0 w-100 text-center text-white p-4">
              <h2 class="h3 mb-0">{{ service.title }}</h2>
              <div class="service-card-button mt-3">
                <span class="btn btn-primary">Learn More</span>
              </div>
            </div>
          </div>
        </a>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}

{% add_stylesheet inline %}
.service-card-image {
  transition: transform .35s ease;
}

.service-card-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, .78) 100%);
  transition: background .3s ease;
}

.service-card-content {
  height: auto !important;
  top: auto !important;
  z-index: 1;
  transition: transform .35s ease;
}

.service-card-button {
  opacity: 1;
  transform: translateY(0);
  transition: opacity .3s ease, transform .3s ease;
}

@media (min-width: 992px) and (hover: hover) {
  .service-card-content {
    transform: translateY(55px);
  }

  .service-card-button {
    opacity: 0;
    transform: translateY(15px);
  }

  .service-card:hover .service-card-image,
  .service-card:focus-visible .service-card-image {
    transform: scale(1.03);
  }

  .service-card:hover .service-card-overlay,
  .service-card:focus-visible .service-card-overlay {
    background: linear-gradient(to bottom, rgba(0, 0, 0, .12) 0%, rgba(0, 0, 0, .82) 100%);
  }

  .service-card:hover .service-card-content,
  .service-card:focus-visible .service-card-content {
    transform: translateY(0);
  }

  .service-card:hover .service-card-button,
  .service-card:focus-visible .service-card-button {
    opacity: 1;
    transform: translateY(0);
  }
}
{% end_stylesheet %}`,
  fields: serviceFields,
  notes: [
    'Select the service records to display from the shared Services datastore. The service item title and URL provide the card heading and destination.',
    'Cards use the services_image datastore field and the 800x600-crop preset. Create this preset in your site if you use service images.',
    'The overlay and hover/focus transitions are inline component styles, so this component declares customCss: true.',
    'Replace the DatastoreGUID placeholder with your site’s Services datastore GUID. The same prefixed datastore fields are shared by Services 01 and Services 02.',
  ],
  preview: {
    html: `<style>
.service-card-image { transition: transform .35s ease; }
.service-card-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,.78) 100%); transition: background .3s ease; }
.service-card-content { height: auto !important; top: auto !important; z-index: 1; transition: transform .35s ease; }
.service-card-button { opacity: 1; transform: translateY(0); transition: opacity .3s ease, transform .3s ease; }
@media (min-width: 992px) and (hover: hover) {
  .service-card-content { transform: translateY(55px); }
  .service-card-button { opacity: 0; transform: translateY(15px); }
  .service-card:hover .service-card-image, .service-card:focus-visible .service-card-image { transform: scale(1.03); }
  .service-card:hover .service-card-overlay, .service-card:focus-visible .service-card-overlay { background: linear-gradient(to bottom, rgba(0,0,0,.12) 0%, rgba(0,0,0,.82) 100%); }
  .service-card:hover .service-card-content, .service-card:focus-visible .service-card-content { transform: translateY(0); }
  .service-card:hover .service-card-button, .service-card:focus-visible .service-card-button { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .service-card-image, .service-card-overlay, .service-card-content, .service-card-button { transition: none; }
}
</style>
<section class="py-5">
  <div class="container py-2">
    <div class="row mb-5"><div class="col-12 col-lg-8 mx-auto text-center"><p class="text-primary fw-semibold text-uppercase mb-2">What we do</p><h2 class="display-5 fw-bold mb-3">Services built around you</h2><p class="mb-0">Thoughtful work for the spaces where life happens.</p></div></div>
    <div class="row g-4 justify-content-center">
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="service-card d-block position-relative overflow-hidden shadow text-decoration-none"><div class="ratio ratio-4x3 bg-secondary bg-gradient"><img src="sample-image:modern" class="service-card-image w-100 h-100 object-fit-cover" alt="Example service"><div class="service-card-overlay position-absolute top-0 start-0 w-100 h-100"></div><div class="service-card-content position-absolute bottom-0 start-0 w-100 text-center text-white p-4"><h2 class="h3 mb-0">Home repairs</h2><div class="service-card-button mt-3"><span class="btn btn-primary">Learn More</span></div></div></div></a></div>
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="service-card d-block position-relative overflow-hidden shadow text-decoration-none"><div class="ratio ratio-4x3 bg-dark bg-gradient"><img src="sample-image:exterior" class="service-card-image w-100 h-100 object-fit-cover" alt="Example service"><div class="service-card-overlay position-absolute top-0 start-0 w-100 h-100"></div><div class="service-card-content position-absolute bottom-0 start-0 w-100 text-center text-white p-4"><h2 class="h3 mb-0">Windows &amp; doors</h2><div class="service-card-button mt-3"><span class="btn btn-primary">Learn More</span></div></div></div></a></div>
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="service-card d-block position-relative overflow-hidden shadow text-decoration-none"><div class="ratio ratio-4x3 bg-primary bg-gradient"><img src="sample-image:home" class="service-card-image w-100 h-100 object-fit-cover" alt="Example service"><div class="service-card-overlay position-absolute top-0 start-0 w-100 h-100"></div><div class="service-card-content position-absolute bottom-0 start-0 w-100 text-center text-white p-4"><h2 class="h3 mb-0">Outdoor living</h2><div class="service-card-button mt-3"><span class="btn btn-primary">Learn More</span></div></div></div></a></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'What we do',
    title: 'Services built around you',
    description: 'Thoughtful work for the spaces where life happens.',
    items: [
      { title: 'Home repairs', services_image: '', full_url: '' },
      { title: 'Windows & doors', services_image: '', full_url: '' },
      { title: 'Outdoor living', services_image: '', full_url: '' },
    ],
  },
};
