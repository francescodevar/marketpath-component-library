import { callToActionFields } from '../shared-fields.js';

export default {
  id: 'cta-02',
  name: 'Split CTA',
  category: 'cta',
  prefix: 'cta_',
  sharedFieldsId: 'cta',
  datastoreId: 'call-to-action',
  bootstrap: true,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A compact call to action with shared datastore content and a button side by side.',
  tags: ['two-column', 'conversion', 'datastore', 'bootstrap'],
  template: `{%- if entity.cta_datastore_item.is_valid -%}
{%- var cta = entity.cta_datastore_item -%}
<section class="py-5 bg-light">
  <div class="container">
    <div class="row g-4 align-items-center justify-content-between">
      <div class="col-lg">
        {%- if cta.cta_eyebrow.is_valid -%}
        <p class="small text-uppercase text-primary fw-semibold mb-2">{{ cta.cta_eyebrow }}</p>
        {%- endif -%}
        {%- if cta.cta_title.is_valid -%}
        <div>{{ cta.cta_title }}</div>
        {%- endif -%}
        {%- if cta.cta_description.is_valid -%}
        <div class="lead mb-0">{{ cta.cta_description }}</div>
        {%- endif -%}
      </div>
      {%- if cta.cta_button_text.is_valid and cta.cta_button_link.is_valid -%}
      <div class="col-lg-auto">
        <a class="btn btn-primary btn-lg" href="{{ cta.cta_button_link.value | escape }}">{{ cta.cta_button_text }}</a>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: callToActionFields,
  notes: [
    'Select a Call to Action item from the shared datastore. View Datastore shows the reusable item fields.',
    'Replace the DatastoreGUID placeholder in the shared component field with your site’s Call to Action datastore GUID.',
    'This variant uses the same CTA item as Phone & Quote CTA, with a compact side-by-side layout.',
  ],
  preview: {
    html: `<section class="py-5 bg-light">
  <div class="container">
    <div class="row g-4 align-items-center justify-content-between">
      <div class="col-lg">
        <p class="small text-uppercase text-primary fw-semibold mb-2">A NOTE FOR YOUR NEXT PROJECT</p>
        <h2 class="display-6 fw-bold">Ready when you are.</h2>
        <p class="lead mb-0">Tell us what you have in mind. We will take it from there.</p>
      </div>
      <div class="col-lg-auto">
        <a class="btn btn-primary btn-lg" href="#">Let’s talk</a>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    datastore_item: 'Example Call to Action',
  },
};
