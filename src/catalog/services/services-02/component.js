import { serviceFields } from '../shared-fields.js';

export default {
  id: 'services-02',
  name: 'Services Stack Cards',
  category: 'services',
  prefix: 'services_',
  sharedFieldsId: 'services',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  datastoreId: 'services',
  description: 'Sticky cards that stack as the reader scrolls, one per service from the shared datastore.',
  tags: ['sticky', 'datastore', 'list', 'services'],
  template: `{%- if entity.services_items.is_valid -%}
<section class="services-sticky pt-5">
  <div class="container py-2">
    <div class="row">
      <div class="col-12 col-lg-9 mx-auto text-center">
        {%- if entity.services_eyebrow.is_valid -%}
        <p class="text-primary fw-semibold text-uppercase mb-2">{{ entity.services_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.services_title.is_valid -%}
        <h2 class="display-3 lh-1">{{ entity.services_title }}</h2>
        {%- endif -%}
        {%- if entity.services_description.is_valid -%}
        <div class="mt-3">{{ entity.services_description }}</div>
        {%- endif -%}
      </div>
    </div>
  </div>
  {%- var bg_colors = 'light|primary|dark|secondary' | split: '|' -%}
  {%- var numcolors = bg_colors | size -%}
  {%- var next_idx = 0 -%}
  {%- for service in entity.services_items -%}
    {%- set bg = bg_colors[next_idx] -%}
    {%- set next_idx = next_idx | plus: 1 | modulo: numcolors -%}
    <div class="sticky-top text-bg-{{ bg }} py-5" style="top:115px;">
      <div class="container py-2">
        <div class="row align-items-center g-5" style="min-height:450px;">
          <div class="col-12 col-md-6 col-lg-7">
            <h2 class="display-4 mb-4">{{ service.title }}</h2>
            {%- if service.services_summary.is_valid -%}
            <div class="lead mb-4">{{ service.services_summary }}</div>
            {%- endif -%}
            {%- if service.has_url -%}
            {%- if bg == 'primary' -%}
            <a href="{{ service.full_url | escape }}" class="btn btn-dark">Learn more <span aria-hidden="true">→</span></a>
            {%- else -%}
            <a href="{{ service.full_url | escape }}" class="btn btn-primary">Learn more <span aria-hidden="true">→</span></a>
            {%- endif -%}
            {%- endif -%}
          </div>
          {%- if service.services_image.is_valid -%}
          <div class="col-12 col-md-6 col-lg-4 offset-lg-1">
            <div class="overflow-hidden shadow-sm" style="aspect-ratio:3 / 2;">
              <img src="{% image_url = service.services_image | preset:'480x320-crop webp' %}" srcset="{% image_url = service.services_image | preset:'240x160-crop webp' %} 240w, {% image_url = service.services_image | preset:'480x320-crop webp' %} 480w, {% image_url = service.services_image | preset:'720x480-crop webp' %} 720w" sizes="(min-width: 1400px) 416px, (min-width: 1200px) 356px, (min-width: 992px) 296px, (min-width: 768px) 336px, calc(100vw - 24px)" alt="{{ service.services_image.alt | default: 'Service image' | escape }}" class="w-100 h-100 object-fit-cover" loading="lazy" decoding="async">
            </div>
          </div>
          {%- endif -%}
        </div>
      </div>
    </div>
  {%- endfor -%}
</section>
{%- endif -%}`,
  fields: serviceFields,
  notes: [
    'This template shares the Services datastore. Use View Datastore to inspect or copy it, then replace the DatastoreGUID placeholder with your site GUID.',
    'Services is a datastoreitemlist; the section renders one sticky card per selected item and stays hidden when the list is empty.',
    'Each card uses the datastore item’s default title, image, and services_summary. The full services_content belongs on the individual Service Detail page.',
    'Card backgrounds rotate through light, primary, dark, and secondary automatically.',
    'Each card is sticky at top: 115px with a 450px minimum height, so this component declares customCss. No custom JavaScript is used.',
    'Create the 240x160-crop, 480x320-crop, 720x480-crop, and webp presets in Marketpath. Responsive srcset variants help the browser choose a size close to the image column width. Marketpath provides has_url and full_url as item URL properties.',
  ],
  preview: {
    html: `<section class="services-sticky pt-5">
  <div class="container py-2">
    <div class="row"><div class="col-12 col-lg-9 mx-auto text-center"><p class="text-primary fw-semibold text-uppercase mb-2">What we do</p><h2 class="display-3 lh-1">Three ways we help you build something lasting.</h2><div class="mt-3"><p class="lead mb-0">Thoughtful services for everyday living.</p></div></div></div>
  </div>
  <div class="sticky-top text-bg-light py-5" style="top:115px;">
    <div class="container py-2">
      <div class="row align-items-center g-5" style="min-height:450px;">
        <div class="col-12 col-md-6 col-lg-7">
          <div class="lead mb-4">Open up your space with quality, comfort, and a fresh perspective.</div>
          <h2 class="display-4 mb-4">Windows &amp; doors</h2>
          <a href="#" class="btn btn-primary">Learn more <span aria-hidden="true">→</span></a>
        </div>
        <div class="col-12 col-md-6 col-lg-4 offset-lg-1"><div class="overflow-hidden shadow-sm" style="aspect-ratio:3 / 2;"><img src="sample-image:modern" class="w-100 h-100 object-fit-cover" alt="Example service"></div></div>
      </div>
    </div>
  </div>
  <div class="sticky-top text-bg-dark py-5" style="top:115px;">
    <div class="container py-2">
      <div class="row align-items-center g-5" style="min-height:450px;">
        <div class="col-12 col-md-6 col-lg-7">
          <div class="lead mb-4">Make more room for the moments you love, outside.</div>
          <h2 class="display-4 mb-4">Decks &amp; outdoors</h2>
          <a href="#" class="btn btn-primary">Learn more <span aria-hidden="true">→</span></a>
        </div>
        <div class="col-12 col-md-6 col-lg-4 offset-lg-1"><div class="overflow-hidden shadow-sm" style="aspect-ratio:3 / 2;"><img src="sample-image:exterior" class="w-100 h-100 object-fit-cover" alt="Example service"></div></div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'What we do',
    title: 'Three ways we help you build something lasting.',
    description: '<p>Thoughtful services for everyday living.</p>',
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
