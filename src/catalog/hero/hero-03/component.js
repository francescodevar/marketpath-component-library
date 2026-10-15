import { heroBackgroundFields } from '../shared-fields.js';

export default {
  id: 'hero-03',
  name: 'Diagonal Overlay Hero',
  category: 'hero',
  prefix: 'hero_01_',
  sharedFieldsId: 'hero_01',
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A full-width background image hero with a diagonal dark overlay on desktop and a solid overlay on mobile.',
  tags: ['hero', 'background image', 'diagonal overlay', 'responsive'],
  template: `{%- if entity.hero_01_title.is_valid -%}
<section class="position-relative d-flex align-items-center overflow-hidden bg-dark text-white py-5" style="min-height:620px;">
  {%- if entity.hero_01_image.is_valid -%}
  <img src="{% image_url = entity.hero_01_image | preset:'1200x675-crop webp' %}" srcset="{% image_url = entity.hero_01_image | preset:'800x450-crop webp' %} 800w, {% image_url = entity.hero_01_image | preset:'1200x675-crop webp' %} 1200w, {% image_url = entity.hero_01_image | preset:'1920x1080-crop webp' %} 1920w" sizes="100vw" width="1920" height="1080" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="" loading="eager" fetchpriority="high">
  {%- endif -%}
  <div class="position-absolute top-0 start-0 w-100 h-100 hero-03-diagonal-overlay" aria-hidden="true"></div>
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
{%- add_stylesheet inline %}
.hero-03-diagonal-overlay {
  background: linear-gradient(130deg, rgba(10, 10, 10, .68) 0%, rgba(10, 10, 10, .68) 65%, rgba(10, 10, 10, .38) 65%);
}

@media (max-width: 767.98px) {
  .hero-03-diagonal-overlay { background: rgba(10, 10, 10, .68); }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: heroBackgroundFields,
  notes: [
    'Uses the same Page Custom Fields as Hero 01 so the eyebrow, title, description, button, and background image can be configured once for either layout.',
    'Create the 800x450-crop, 1200x675-crop, 1920x1080-crop, and webp image presets in Marketpath. A responsive srcset chooses an image size for the viewport. The background image is decorative.',
    'The desktop-only diagonal overlay uses a small inline stylesheet; below 768px it switches to a solid dark overlay for clear mobile contrast.',
    'The 620px minimum hero height uses one inline style. The button requires both text and a URL.',
  ],
  preview: {
    html: `<section class="position-relative d-flex align-items-center overflow-hidden bg-dark text-white py-5" style="min-height:620px;">
  <style>.hero-03-preview-overlay{background:linear-gradient(130deg,rgba(10,10,10,.68) 0%,rgba(10,10,10,.68) 65%,rgba(10,10,10,.38) 65%)}@media(max-width:767.98px){.hero-03-preview-overlay{background:rgba(10,10,10,.68)}}</style>
  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDEyMDAgOTAwIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5MDAiIGZpbGw9IiNlNWU5ZWUiLz48Y2lyY2xlIGN4PSI4MjUiIGN5PSIyNzAiIHI9Ijg1IiBmaWxsPSIjZDBkN2UwIi8+PHBhdGggZD0iTTAgOTAwVjc3MEwzNjAgMzkwIDY3MCA3MzAgODU1IDUzNSAxMjAwIDg3NVY5MDAiIGZpbGw9IiNjY2Q0ZGUiLz48cGF0aCBkPSJNMCA5MDBMMzYwIDUxMCA3MDAgOTAwIiBmaWxsPSIjYmRjOGQ1Ii8+PC9zdmc+" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="">
  <div class="position-absolute top-0 start-0 w-100 h-100 hero-03-preview-overlay" aria-hidden="true"></div>
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
