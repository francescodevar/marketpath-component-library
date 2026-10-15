import { testimonialFields } from '../shared-fields.js';

export default {
  id: 'testimonials-02',
  name: 'Google Review Cards',
  category: 'testimonials',
  prefix: 'testimonials_',
  sharedFieldsId: 'testimonials',
  sharedFieldIds: ['testimonials_section_title', 'testimonials_intro_text', 'testimonials_section_items'],
  bootstrap: true,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  datastoreId: 'testimonials',
  description: 'A responsive grid of Google-style review cards powered by the shared Testimonials datastore.',
  tags: ['google', 'testimonial', 'reviews', 'cards'],
  template: `{%- if entity.testimonials_section_items.is_valid -%}
<section class="py-5 bg-light">
  <div class="container py-2">
    {%- if entity.testimonials_section_title.is_valid -%}
    <div class="row mb-4">
      <div class="col-12 col-lg-8 mx-auto text-center">
        <h2 class="display-5 fw-bold mb-0">
          {{ entity.testimonials_section_title }}
        </h2>
        {%- if entity.testimonials_intro_text.is_valid -%}
        <p class="lead text-secondary mt-3 mb-0">{{ entity.testimonials_intro_text }}</p>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}
    <div class="row g-4">
      {%- for testimonial in entity.testimonials_section_items -%}
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-google fs-4 text-primary" aria-hidden="true"></i>
                <span class="fw-semibold">Google review</span>
              </div>
              <div class="text-warning" aria-label="5 out of 5 stars">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
            </div>
            {%- if testimonial.testimonial_text.is_valid -%}
            <blockquote class="mb-4 flex-grow-1">
              <div class="text-secondary mb-0 lh-lg">{{ testimonial.testimonial_text }}</div>
            </blockquote>
            {%- endif -%}
            <div class="border-top pt-3 mt-auto">
              <div class="fw-semibold">{{ testimonial.title }}</div>
              {%- if testimonial.testimonial_highlight.is_valid -%}
              <div class="small text-secondary">{{ testimonial.testimonial_highlight }}</div>
              {%- endif -%}
            </div>
          </div>
        </article>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: testimonialFields,
  notes: [
    'Uses the same page Fields schema and Testimonials datastore as Testimonial Card Swiper. Copy the Fields JSON once; this template only needs its own markup.',
    'Each datastore item uses its default title as the reviewer name, testimonial_text as rich HTML, and testimonial_highlight as an optional label.',
    'The star rating and Google review label are fixed display elements; no Google API connection is required.',
    'Load Bootstrap Icons CSS on the Marketpath page for the Google and star icons.',
  ],
  preview: {
    html: `<section class="py-5 bg-light">
  <div class="container py-2">
    <div class="row mb-4">
      <div class="col-12 col-lg-8 mx-auto text-center">
        <h2 class="display-5 fw-bold mb-0">What our customers say</h2>
        <p class="lead text-secondary mt-3 mb-0">A few words from people we have worked with.</p>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-2"><i class="bi bi-google fs-4 text-primary" aria-hidden="true"></i><span class="fw-semibold">Google review</span></div>
              <div class="text-warning" aria-label="5 out of 5 stars"><i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i></div>
            </div>
            <blockquote class="mb-4 flex-grow-1"><p class="text-secondary mb-0 lh-lg">The team was helpful, clear, and attentive from start to finish. The finished work looks wonderful.</p></blockquote>
            <div class="border-top pt-3 mt-auto"><div class="fw-semibold">Jane Smith</div><div class="small text-secondary">Homeowner</div></div>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-2"><i class="bi bi-google fs-4 text-primary" aria-hidden="true"></i><span class="fw-semibold">Google review</span></div>
              <div class="text-warning" aria-label="5 out of 5 stars"><i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i></div>
            </div>
            <blockquote class="mb-4 flex-grow-1"><p class="text-secondary mb-0 lh-lg">Everything was handled smoothly, and the result is exactly what we hoped for.</p></blockquote>
            <div class="border-top pt-3 mt-auto"><div class="fw-semibold">John Doe</div><div class="small text-secondary">Project client</div></div>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-2"><i class="bi bi-google fs-4 text-primary" aria-hidden="true"></i><span class="fw-semibold">Google review</span></div>
              <div class="text-warning" aria-label="5 out of 5 stars"><i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i> <i class="bi bi-star-fill"></i></div>
            </div>
            <blockquote class="mb-4 flex-grow-1"><p class="text-secondary mb-0 lh-lg">A great experience with thoughtful communication and quality work throughout.</p></blockquote>
            <div class="border-top pt-3 mt-auto"><div class="fw-semibold">Jane Smith</div><div class="small text-secondary">Homeowner</div></div>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    section_title: 'What our customers say',
    intro_text: 'A few words from people we have worked with.',
    testimonials: [
      {
        title: 'Jane Smith',
        testimonial_highlight: 'Homeowner',
        testimonial_text: '<p>The team was helpful, clear, and attentive from start to finish. The finished work looks wonderful.</p>',
      },
      {
        title: 'John Doe',
        testimonial_highlight: 'Project client',
        testimonial_text: '<p>Everything was handled smoothly, and the result is exactly what we hoped for.</p>',
      },
      {
        title: 'Jane Smith',
        testimonial_highlight: 'Homeowner',
        testimonial_text: '<p>A great experience with thoughtful communication and quality work throughout.</p>',
      },
    ],
  },
};
