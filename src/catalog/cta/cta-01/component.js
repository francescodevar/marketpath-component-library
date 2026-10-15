import { callToActionFields } from '../shared-fields.js';

export default {
  id: 'cta-01',
  name: 'Phone & Quote CTA',
  category: 'cta',
  prefix: 'cta_',
  sharedFieldsId: 'cta',
  datastoreId: 'call-to-action',
  bootstrap: true,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A spacious, two-column contact call to action with a prominent phone number and quote button.',
  tags: ['phone', 'two-column', 'conversion', 'datastore', 'bootstrap'],
  template: `{%- if entity.cta_datastore_item.is_valid -%}
{%- var cta = entity.cta_datastore_item -%}
<section class="container-fluid py-5 text-bg-secondary">
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-9">
        {%- if cta.cta_eyebrow.is_valid -%}
        <p class="h3">{{ cta.cta_eyebrow }}</p>
        {%- endif -%}
        {%- if cta.cta_title.is_valid -%}
        <div class="fs-1 fw-bold mb-0">{{ cta.cta_title }}</div>
        {%- endif -%}
        {%- if cta.cta_description.is_valid -%}
        <div>{{ cta.cta_description }}</div>
        {%- endif -%}
      </div>
      {%- if cta.cta_button_text.is_valid and cta.cta_button_link.is_valid -%}
      <div class="col-12 col-md-3 d-flex flex-column justify-content-center align-items-start align-items-md-end">
        <a href="{{ cta.cta_button_link.value | escape }}" class="btn px-md-3 py-md-3 px-lg-4 px-xl-5 py-xl-3 btn-primary px-4">{{ cta.cta_button_text }}</a>
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
    'The selected item provides the eyebrow, rich-text title and description, and button label and URL.',
  ],
  preview: {
    html: `<section class="container-fluid py-5 text-bg-secondary">
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-9">
        <p class="h3">LET’S TALK ABOUT YOUR PROJECT.</p>
        <p class="fs-1 fw-bold mb-0">CALL +1 (555) 010-0100</p>
        <div><p>We’re here to answer your questions and help you plan your next step.</p></div>
      </div>
      <div class="col-12 col-md-3 d-flex flex-column justify-content-center align-items-start align-items-md-end">
        <a href="#" class="btn px-md-3 py-md-3 px-lg-4 px-xl-5 py-xl-3 btn-primary px-4">Request a Quote</a>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    datastore_item: 'Example Call to Action',
  },
};
