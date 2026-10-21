import { serviceFields } from '../shared-fields.js';

export default {
  id: 'services-01',
  name: 'Services Cards Classic',
  category: 'services',
  prefix: 'services_',
  sharedFieldsId: 'services',
  datastoreId: 'services',
  bootstrap: true,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A section introduction and responsive cards populated from the shared Services datastore.',
  tags: ['cards', 'three-column', 'datastore', 'services'],
  template: `{%- if entity.services_items.is_valid -%}
<section class="py-5 bg-white">
  <div class="container py-2">
    {%- if entity.services_eyebrow.is_valid -%}
    <p class="small text-uppercase text-primary fw-semibold">
      {{ entity.services_eyebrow }}
    </p>
    {%- endif -%}
    {%- if entity.services_title.is_valid -%}
    <h2 class="display-6 fw-bold">
      {{ entity.services_title }}
    </h2>
    {%- endif -%}
    {%- if entity.services_description.is_valid -%}
    <div class="lead text-secondary mb-4">
      {{ entity.services_description }}
    </div>
    {%- endif -%}
    <div class="row g-4">
      {%- for service in entity.services_items -%}
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          {%- if service.services_image.is_valid -%}
          <div class="ratio ratio-4x3">
            <img src="{% image_url = service.services_image | preset:'480x320-crop webp' %}" srcset="{% image_url = service.services_image | preset:'240x160-crop webp' %} 240w, {% image_url = service.services_image | preset:'480x320-crop webp' %} 480w, {% image_url = service.services_image | preset:'720x480-crop webp' %} 720w" sizes="(min-width: 1400px) 416px, (min-width: 1200px) 356px, (min-width: 992px) 296px, (min-width: 768px) 336px, calc(100vw - 24px)" class="w-100 h-100 object-fit-cover" alt="{{ service.services_image.alt | default: 'Service image' | escape }}" loading="lazy" decoding="async">
          </div>
          {%- endif -%}
          <div class="card-body p-4 d-flex flex-column">
            <h3 class="h4">{{ service.title }}</h3>
            {%- if service.services_summary.is_valid -%}
            <div class="text-secondary">
              {{ service.services_summary }}
            </div>
            {%- endif -%}
            {%- if service.services_content.is_valid -%}
            <div class="mt-3">
              {{ service.services_content }}
            </div>
            {%- endif -%}
            {%- if service.has_url -%}
            <a class="link-primary text-decoration-none mt-auto pt-3" href="{{ service.full_url | escape }}">
              Learn more <span aria-hidden="true">→</span>
            </a>
            {%- endif -%}
          </div>
        </article>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: serviceFields,
  notes: [
    'Select the service records to display from the shared Services datastore. Each selected record becomes a responsive card.',
    'Each card uses the datastore item’s default title for its heading. The datastore provides services_image, services_summary, and services_content for its image and rich content.',
    'Create the 240x160-crop, 480x320-crop, 720x480-crop, and webp presets in Marketpath. The responsive srcset serves a size closer to each card’s display width.',
    'Service links use Marketpath item URL properties when the selected record has a URL.',
  ],
  preview: {
    html: `<section class="py-5 bg-white">
  <div class="container py-2">
    <p class="small text-uppercase text-primary fw-semibold">WHAT WE DO</p>
    <h2 class="display-6 fw-bold">Thoughtful work. From start to finish.</h2>
    <div class="lead text-secondary mb-4">The expertise you need to bring your next project to life.</div>
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="ratio ratio-4x3"><img src="sample-image:modern" class="w-100 h-100 object-fit-cover" alt="Example service"></div>
          <div class="card-body p-4 d-flex flex-column">
            <div class="text-secondary">Open up your space with quality, comfort, and a fresh perspective.</div>
            <h3 class="h4">Windows &amp; doors</h3>
            <div class="mt-3"><p>Thoughtful upgrades for a more comfortable home.</p></div>
            <a class="link-primary text-decoration-none mt-auto pt-3" href="#">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="ratio ratio-4x3"><img src="sample-image:exterior" class="w-100 h-100 object-fit-cover" alt="Example service"></div>
          <div class="card-body p-4 d-flex flex-column">
            <div class="text-secondary">Make more room for the moments you love, outside.</div>
            <h3 class="h4">Decks &amp; outdoors</h3>
            <div class="mt-3"><p>Outdoor spaces designed for everyday living.</p></div>
            <a class="link-primary text-decoration-none mt-auto pt-3" href="#">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="ratio ratio-4x3"><img src="sample-image:home" class="w-100 h-100 object-fit-cover" alt="Example service"></div>
          <div class="card-body p-4 d-flex flex-column">
            <div class="text-secondary">Turn your ideas into a clear plan with an experienced team.</div>
            <h3 class="h4">Design &amp; planning</h3>
            <div class="mt-3"><p>A clear path from first idea to finished project.</p></div>
            <a class="link-primary text-decoration-none mt-auto pt-3" href="#">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'WHAT WE DO',
    title: 'Thoughtful work. From start to finish.',
    description: '<p>The expertise you need to bring your next project to life.</p>',
    items: [
      {
        services_image: '',
        services_summary: '<p>Open up your space with quality, comfort, and a fresh perspective.</p>',
        services_content: '<p>Thoughtful upgrades for a more comfortable home.</p>',
        full_url: '',
      },
      {
        services_image: '',
        services_summary: '<p>Make more room for the moments you love, outside.</p>',
        services_content: '<p>Outdoor spaces designed for everyday living.</p>',
        full_url: '',
      },
      {
        services_image: '',
        services_summary: '<p>Turn your ideas into a clear plan with an experienced team.</p>',
        services_content: '<p>A clear path from first idea to finished project.</p>',
        full_url: '',
      },
    ],
  },
};
