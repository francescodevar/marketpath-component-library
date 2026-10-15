import { testimonialFields } from '../shared-fields.js';

export default {
  id: 'testimonials-01',
  name: 'Testimonial Card Swiper',
  category: 'testimonials',
  prefix: 'testimonials_',
  sharedFieldsId: 'testimonials',
  sharedFieldIds: ['testimonials_section_title', 'testimonials_intro_text', 'testimonials_section_items'],
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  datastoreId: 'testimonials',
  description: 'A one-at-a-time testimonial slider with datastore titles, optional highlights, and five-star ratings.',
  tags: ['testimonial', 'swiper', 'carousel', 'reviews'],
  template: `{%- if entity.testimonials_section_items.is_valid -%}
{%- add_stylesheet "/marketpath/swiperjs/css/swiper.css" -%}
{%- add_javascript "/marketpath/swiperjs/js/swiper.js" position:'body' -%}

<section class="testimonials-section py-5">
  <div class="container py-2">
    {%- if entity.testimonials_section_title.is_valid -%}
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto text-center">
        <h2 class="display-4 mb-3">
          {{ entity.testimonials_section_title }}
        </h2>
        {%- if entity.testimonials_intro_text.is_valid -%}
        <div class="mb-5">
          {{ entity.testimonials_intro_text }}
        </div>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}
    <div class="swiper testimonials-swiper">
      <div class="swiper-wrapper">
        {%- for testimonial in entity.testimonials_section_items -%}
        <div class="swiper-slide">
          <div class="row">
            <div class="col-12 col-lg-10 mx-auto text-center py-4">
              <h3 class="h4 fw-normal mb-1">{{ testimonial.title }}</h3>
              {%- if testimonial.testimonial_highlight.is_valid -%}
              <p class="small text-body-secondary mb-3">{{ testimonial.testimonial_highlight }}</p>
              {%- endif -%}
              <div class="mb-4 fs-4" style="color:#ffb03b;">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
              {%- if testimonial.testimonial_text.is_valid -%}
              <div class="d-flex align-items-start justify-content-center">
                <i class="bi bi-quote fs-2 flex-shrink-0 me-2"></i>
                <div class="mb-0 lh-lg">{{ testimonial.testimonial_text }}</div>
                <i class="bi bi-quote fs-2 flex-shrink-0 ms-2" style="transform:rotate(180deg);"></i>
              </div>
              {%- endif -%}
            </div>
          </div>
        </div>
        {%- endfor -%}
      </div>
      <div class="swiper-pagination position-relative pt-5"></div>
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.testimonials-swiper .swiper-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
}

.testimonials-swiper .swiper-pagination .swiper-pagination-bullet {
  display: inline-flex;
  width: 48px;
  height: 48px;
  margin: 0 !important;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  opacity: 1;
}

.testimonials-swiper .swiper-pagination .swiper-pagination-bullet-active {
  background: var(--bs-primary) !important;
}

.testimonials-swiper .swiper-pagination .swiper-pagination-bullet::before {
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: var(--bs-secondary);
  content: "";
}

.testimonials-swiper .swiper-pagination .swiper-pagination-bullet-active::before {
  background: var(--bs-white);
}

.testimonials-swiper .swiper-pagination .swiper-pagination-bullet:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
{% end_stylesheet %}

{%- add_javascript inline position:'body' defer:true -%}
new Swiper('.testimonials-swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: '.testimonials-swiper .swiper-pagination',
    clickable: true
  }
});
{%- end_javascript -%}
{%- endif -%}`,
  fields: testimonialFields,
  notes: [
    'Page Fields are shared with Google Review Cards: copy this Fields JSON once, then reuse it and add only the other template markup.',
    'This template also shares the Testimonials datastore. Item title provides the customer name, testimonial_text is rich HTML, and testimonial_highlight is an optional short label.',
    'Replace the DatastoreGUID placeholder with the GUID of that Testimonials datastore.',
    'The Marketpath page must provide /marketpath/swiperjs/css/swiper.css and /marketpath/swiperjs/js/swiper.js.',
    'Swiper pagination gives each bullet a 48×48px touch target with 8px spacing. The active target uses the primary background and a contrasting center dot.',
    'Load Bootstrap Icons CSS on the Marketpath page for the five stars and quote icons.',
  ],
  preview: {
    html: `<section class="testimonials-section py-5">
  <div class="container py-2">
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto text-center">
        <h2 class="display-4 mb-3">What customers say</h2>
        <div class="mb-5">A few words from people we have worked with.</div>
      </div>
    </div>
    <div class="swiper testimonials-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="row">
            <div class="col-12 col-lg-10 mx-auto text-center py-4">
              <h3 class="h4 fw-normal mb-1">Jane Smith</h3>
              <p class="small text-body-secondary mb-3">Homeowner</p>
              <div class="mb-4 fs-4" style="color:#ffb03b;">
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
              </div>
              <div class="d-flex align-items-start justify-content-center">
                <i class="bi bi-quote fs-2 flex-shrink-0 me-2"></i>
                <div class="mb-0 lh-lg"><p>The team made the whole process clear and straightforward. The finished work looks wonderful.</p></div>
                <i class="bi bi-quote fs-2 flex-shrink-0 ms-2" style="transform:rotate(180deg);"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination position-relative pt-5 d-flex justify-content-center gap-2" aria-label="Slide pagination">
        <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary" style="width:48px;height:48px;"><i class="rounded-circle bg-white" style="width:8px;height:8px;"></i></span>
        <span class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width:48px;height:48px;"><i class="rounded-circle bg-secondary" style="width:8px;height:8px;"></i></span>
        <span class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width:48px;height:48px;"><i class="rounded-circle bg-secondary" style="width:8px;height:8px;"></i></span>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'What customers say',
    intro_text: 'A few words from people we have worked with.',
    testimonials: [
      {
        title: 'Jane Smith',
        testimonial_highlight: 'Homeowner',
        testimonial_text: '<p>The team made the whole process clear and straightforward. The finished work looks wonderful.</p>',
      },
    ],
  },
};
