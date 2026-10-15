import { testimonialFields } from '../shared-fields.js';

export default {
  id: 'testimonials-03',
  name: 'Client Story with Image',
  category: 'testimonials',
  prefix: 'testimonials_',
  sharedFieldsId: 'testimonials',
  sharedFieldIds: ['testimonials_section_title', 'testimonials_intro_text', 'testimonials_section_items'],
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  datastoreId: 'testimonials',
  description: 'A two-column testimonial section with a heading and datastore-powered client quotes beside a project image.',
  tags: ['testimonial', 'client story', 'image', 'reviews'],
  template: `{%- if entity.testimonials_section_title.is_valid or entity.testimonials_intro_text.is_valid or entity.testimonials_section_items.is_valid or entity.testimonials_03_image.is_valid -%}
<section class="testimonials-03 bg-white py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-center">
      <div class="col-12 {% if entity.testimonials_03_image.is_valid %}col-lg-6{% endif %}">
        {%- if entity.testimonials_section_title.is_valid -%}
        <h2 class="display-6 fw-normal text-dark mb-3">{{ entity.testimonials_section_title }}</h2>
        {%- endif -%}
        {%- if entity.testimonials_intro_text.is_valid -%}
        <h3 class="h4 fw-normal text-primary mb-4">{{ entity.testimonials_intro_text }}</h3>
        {%- endif -%}

        {%- if entity.testimonials_section_items.is_valid -%}
        <div class="d-grid gap-4">
          {%- for testimonial in entity.testimonials_section_items -%}
          <figure class="mb-0">
            {%- if testimonial.testimonial_text.is_valid -%}
            <blockquote class="mb-2 text-secondary lh-lg">{{ testimonial.testimonial_text }}</blockquote>
            {%- endif -%}
            {%- if testimonial.title.is_valid -%}
            <figcaption class="fw-bold text-dark">— {{ testimonial.title }}</figcaption>
            {%- endif -%}
            {%- if testimonial.testimonial_highlight.is_valid -%}
            <div class="small text-secondary mt-1">{{ testimonial.testimonial_highlight }}</div>
            {%- endif -%}
          </figure>
          {%- endfor -%}
        </div>
        {%- endif -%}
      </div>

      {%- if entity.testimonials_03_image.is_valid -%}
      <div class="col-12 col-lg-6">
        <div class="ratio ratio-1x1 overflow-hidden rounded-3">
          {%- img entity.testimonials_03_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" alt:entity.testimonials_03_image.alt|default:'Client project' link:false loading:"lazy" -%}
        </div>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    ...testimonialFields,
    {
      Type: 'group',
      Label: 'Project Image',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'image',
          FieldID: 'testimonials_03_image',
          Label: 'Image',
          Subtext: 'Shown to the right of the client testimonials.',
          Condition: null,
          IsRequired: false,
        },
      ],
    },
  ],
  notes: [
    'The title, subtitle, and selected testimonial items use the same Page Fields as Testimonials 01 and 02.',
    'Each testimonial uses the datastore item title as the reviewer name and testimonial_text as rich HTML. testimonial_highlight appears as an optional label.',
    'The right-side image is a variant-specific Page Field. Create the 800x600-crop image preset in Marketpath.',
    'Replace the DatastoreGUID placeholder in the shared Fields with the GUID of the site Testimonials datastore.',
  ],
  preview: {
    html: `<section class="testimonials-03 bg-white py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-center">
      <div class="col-12 col-lg-6">
        <h2 class="display-6 fw-normal text-dark mb-3">Client Testimonials</h2>
        <h3 class="h4 fw-normal text-primary mb-4">Hear What Our Clients Have to Say</h3>
        <div class="d-grid gap-4">
          <figure class="mb-0"><blockquote class="mb-2 text-secondary lh-lg">We appreciated the thoughtful communication, careful work, and clear guidance from the first conversation through the finished project.</blockquote><figcaption class="fw-bold text-dark">— Jane Smith</figcaption><div class="small text-secondary mt-1">Homeowner</div></figure>
          <figure class="mb-0"><blockquote class="mb-2 text-secondary lh-lg">The process felt organized and easy to follow. The team paid close attention to every detail and delivered a result we’re proud of.</blockquote><figcaption class="fw-bold text-dark">— John Doe</figcaption><div class="small text-secondary mt-1">Project client</div></figure>
          <figure class="mb-0"><blockquote class="mb-2 text-secondary lh-lg">From planning to completion, everything was handled with care. We would gladly recommend the team to a friend.</blockquote><figcaption class="fw-bold text-dark">— Jane Smith</figcaption><div class="small text-secondary mt-1">Homeowner</div></figure>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="ratio ratio-1x1 overflow-hidden rounded-3" role="img" aria-label="Illustration of a home improvement project">
          <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="600" height="600" fill="#dce9e5"/>
            <rect x="48" y="32" width="552" height="365" fill="#778b84"/>
            <path d="M48 95h552M48 145h552M48 195h552M48 245h552M48 295h552M48 345h552" stroke="#91a49c" stroke-width="8"/>
            <rect x="332" y="62" width="206" height="156" rx="3" fill="#d7e7ec" stroke="#f5f2e9" stroke-width="12"/>
            <path d="M435 68v144M338 140h194" stroke="#f5f2e9" stroke-width="8"/>
            <rect y="397" width="600" height="203" fill="#9b7659"/>
            <path d="M0 438h600M0 488h600M0 538h600M0 588h600" stroke="#bd9875" stroke-width="5"/>
            <path d="M0 470h600M0 520h600M0 570h600" stroke="#795a45" stroke-width="2"/>
            <path d="M0 370h600v34H0z" fill="#d3c1a5"/>
            <circle cx="174" cy="267" r="25" fill="#bd8d65"/>
            <path d="M148 264q25-46 52 0" fill="#28343a"/>
            <path d="M154 296l-20 88h92l-22-88z" fill="#356b61"/>
            <path d="M156 316l-54 67m101-63 65 44" fill="none" stroke="#bd8d65" stroke-width="16" stroke-linecap="round"/>
            <path d="M160 383l-24 76m62-76 28 76" fill="none" stroke="#25383a" stroke-width="18" stroke-linecap="round"/>
            <rect x="405" y="319" width="95" height="63" rx="9" fill="#d8d7c8" stroke="#565c58" stroke-width="6"/>
            <circle cx="430" cy="384" r="12" fill="#303a3b"/><circle cx="480" cy="384" r="12" fill="#303a3b"/>
            <path d="M410 336h82" stroke="#a8aa9f" stroke-width="8"/>
            <path d="M405 365c-75 35 18 54-40 86s-40 43-18 66" fill="none" stroke="#202c2d" stroke-width="9"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    section_title: 'Client Testimonials',
    intro_text: 'Hear What Our Clients Have to Say',
    '03_image': '',
    testimonials: [
      {
        title: 'Jane Smith',
        testimonial_highlight: 'Homeowner',
        testimonial_text: '<p>We appreciated the thoughtful communication, careful work, and clear guidance from the first conversation through the finished project.</p>',
      },
      {
        title: 'John Doe',
        testimonial_highlight: 'Project client',
        testimonial_text: '<p>The process felt organized and easy to follow. The team paid close attention to every detail and delivered a result we’re proud of.</p>',
      },
      {
        title: 'Jane Smith',
        testimonial_highlight: 'Homeowner',
        testimonial_text: '<p>From planning to completion, everything was handled with care. We would gladly recommend the team to a friend.</p>',
      },
    ],
  },
};
