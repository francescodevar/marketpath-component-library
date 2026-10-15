import { heroBackgroundFields } from '../shared-fields.js';

export default {
  id: 'hero-01',
  name: 'Background Image Hero',
  category: 'hero',
  prefix: 'hero_01_',
  sharedFieldsId: 'hero_01',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A bold opening with a full-width image, eyebrow, and a clear call to action.',
  tags: ['image', 'dark', 'bootstrap'],
  template: `{%- if entity.hero_01_title.is_valid -%}
<section class="position-relative d-flex align-items-center overflow-hidden bg-dark text-white" style="min-height:620px;">
  {%- if entity.hero_01_image.is_valid -%}
  <img src="{% image_url = entity.hero_01_image | preset:'1200x675-crop webp' %}" srcset="{% image_url = entity.hero_01_image | preset:'800x450-crop webp' %} 800w, {% image_url = entity.hero_01_image | preset:'1200x675-crop webp' %} 1200w, {% image_url = entity.hero_01_image | preset:'1920x1080-crop webp' %} 1920w" sizes="100vw" width="1920" height="1080" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="" loading="eager" fetchpriority="high">
  {%- endif -%}
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" aria-hidden="true"></div>
  <div class="container position-relative py-5">
    <div class="row">
      <div class="col-lg-8 col-xl-7">
        {%- if entity.hero_01_eyebrow.is_valid -%}
        <p class="small fw-bold fst-italic mb-3" style="font-size:18px;">{{ entity.hero_01_eyebrow }}</p>
        {%- endif -%}
        <h1 class="display-3 fw-bold mb-0">{{ entity.hero_01_title }}</h1>
        {%- if entity.hero_01_description.is_valid -%}
        <p class="lead mt-4 mb-0">{{ entity.hero_01_description }}</p>
        {%- endif -%}
        {%- if entity.hero_01_button_text.is_valid and entity.hero_01_button_link.is_valid -%}
        <a class="btn btn-primary mt-4" href="{{ entity.hero_01_button_link.value | escape }}">{{ entity.hero_01_button_text }}</a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: heroBackgroundFields,
  notes: [
    'Create the 800x450-crop, 1200x675-crop, 1920x1080-crop, and webp image presets in Marketpath. A responsive srcset chooses an image size for the viewport. The background image is decorative.',
    'Eyebrow is optional and renders at 18px, bold, italic. One inline size sets its exact font size; another sets the 620px minimum hero height.',
    'The required Title controls section visibility. The button needs both text and a URL.',
  ],
  preview: {
    html: `<section class="position-relative d-flex align-items-center overflow-hidden bg-dark text-white" style="min-height:620px;">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 620'%3E%3Crect width='1200' height='620' fill='%23d8e2e3'/%3E%3Cpath d='M0 470 190 230 385 400 610 170 825 405 1005 250 1200 390v230H0z' fill='%238fa3a5'/%3E%3C/svg%3E" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="">
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" aria-hidden="true"></div>
  <div class="container position-relative py-5">
    <div class="row"><div class="col-lg-8 col-xl-7">
      <p class="small fw-bold fst-italic mb-3" style="font-size:18px;">Thoughtful spaces. Lasting craftsmanship.</p>
      <h1 class="display-3 fw-bold mb-0">Built for the way you live.</h1>
      <p class="lead mt-4 mb-0">Thoughtful spaces. Lasting craftsmanship. Bring your next chapter to life.</p>
      <a class="btn btn-primary mt-4" href="#">Explore our work</a>
    </div></div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'Thoughtful spaces. Lasting craftsmanship.',
    title: 'Built for the way you live.',
    description: 'Thoughtful spaces. Lasting craftsmanship. Bring your next chapter to life.',
    button_text: 'Explore our work',
    button_link: '',
    image: '',
  },
};
