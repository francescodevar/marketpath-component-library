export default {
  id: 'project-detail-01',
  name: 'Projects Detail Page',
  category: 'inside-projects',
  prefix: 'project_detail_01_',
  datastoreIds: ['projects'],
  entityDatastoreId: 'projects',
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  description: 'A project detail layout with an image carousel, datastore details, overview, and optional calls to action.',
  tags: ['generic page', 'project detail', 'swiper', 'datastore'],
  template: `{%- add_stylesheet "/marketpath/swiperjs/css/swiper.css" -%}
{%- add_javascript "/marketpath/swiperjs/js/swiper.js" position:'body' -%}
<section class="py-5">
  <div class="container py-2">
    <h1 class="text-primary mb-4 mb-lg-5">{{ entity.title }}</h1>

    <div class="row g-5">
      <div class="col-12 col-lg-8 order-1">
        {%- if entity.project_images.is_valid -%}
        <div class="project-detail-swiper swiper rounded overflow-hidden mb-3">
          <div class="swiper-wrapper">
            {%- for image in entity.project_images -%}
            <div class="swiper-slide">
              <div class="ratio ratio-16x9 bg-light">
                <img src="{% image_url = image | preset:"700x394-crop webp" %}" alt="{{ entity.title | escape }}" class="w-100 h-100 object-fit-cover" loading="{% if forloop.first %}eager{% else %}lazy{% endif %}">
              </div>
            </div>
            {%- endfor -%}
          </div>
        </div>
        <div class="project-detail-pagination swiper-pagination" aria-label="Project image slides"></div>
        {%- endif -%}
      </div>

      <aside class="col-12 col-lg-4 order-3 order-lg-2">
        {%- if entity.projects_details.is_valid -%}
        <div class="card border-0 bg-light mb-4">
          <div class="card-body p-4">
            <h2 class="text-primary fw-bold fs-5 mb-3">Project Details</h2>
            {%- for detail in entity.projects_details -%}
              {%- if detail.title_details.is_valid or detail.detail_details.is_valid -%}
              <p class="mb-2">
                {%- if detail.title_details.is_valid -%}<strong>{{ detail.title_details }}:</strong>{%- endif -%}
                {%- if detail.detail_details.is_valid %} {{ detail.detail_details }}{% endif -%}
              </p>
              {%- endif -%}
            {%- endfor -%}
          </div>
        </div>
        {%- endif -%}

        {%- if entity.project_detail_01_button_1_text.is_valid and entity.project_detail_01_button_1_link.is_valid -%}
        <div class="mb-3">
          <a href="{{ entity.project_detail_01_button_1_link.value | escape }}" class="btn btn-primary w-100 fw-semibold text-uppercase py-3">{{ entity.project_detail_01_button_1_text }}</a>
        </div>
        {%- endif -%}
        {%- if entity.project_detail_01_button_2_text.is_valid and entity.project_detail_01_button_2_link.is_valid -%}
        <div class="mb-3">
          <a href="{{ entity.project_detail_01_button_2_link.value | escape }}" class="btn btn-outline-primary w-100 fw-semibold text-uppercase py-3">{{ entity.project_detail_01_button_2_text }}</a>
        </div>
        {%- endif -%}
      </aside>

      <div class="col-12 order-2 order-lg-3">
        {%- if entity.project_overview.is_valid -%}
        <h2 class="text-primary fw-semibold mb-3">Project Overview</h2>
        <div class="fs-5 lh-lg">{{ entity.project_overview }}</div>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{%- add_stylesheet inline -%}
.project-detail-swiper { overflow: hidden; }
.project-detail-swiper .swiper-slide { width: 100%; }
.project-detail-pagination {
  position: static;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: .5rem;
  margin-top: 1rem;
}
.project-detail-pagination .swiper-pagination-bullet {
  width: .625rem;
  height: .625rem;
  margin: 0;
  background: var(--bs-secondary-color);
  opacity: .4;
}
.project-detail-pagination .swiper-pagination-bullet-active {
  background: var(--bs-primary);
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .project-detail-swiper .swiper-wrapper { transition-duration: 0ms !important; }
}
{%- end_stylesheet -%}

{%- add_javascript inline position:'body' -%}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.project-detail-swiper').forEach(function(slider) {
    if (!window.Swiper || slider.dataset.initialized === 'true') return;
    slider.dataset.initialized = 'true';
    const pagination = slider.parentElement.querySelector('.project-detail-pagination');
    new Swiper(slider, {
      speed: 600,
      loop: slider.querySelectorAll('.swiper-slide').length > 1,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 1,
      spaceBetween: 0,
      pagination: { el: pagination, type: 'bullets', clickable: true },
    });
  });
});
{%- end_javascript -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Project Detail Actions',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'project_detail_01_button_1_text',
          Label: 'Primary button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'url',
          FieldID: 'project_detail_01_button_1_link',
          Label: 'Primary button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'project_detail_01_button_2_text',
          Label: 'Secondary button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'url',
          FieldID: 'project_detail_01_button_2_link',
          Label: 'Secondary button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
      ],
    },
  ],
  notes: [
    'The root entity is a Projects datastore item. project_images, projects_details, and project_overview come directly from the shared Projects datastore; only the two optional CTA pairs are Page Custom Fields.',
    'Create the 700x394-crop webp image preset in Marketpath for the Swiper gallery.',
    'Swiper CSS and JavaScript load from /marketpath/swiperjs; pagination bullets are rendered beneath the image carousel.',
    'The page requires the Swiper assets and the 1200x675-crop webp preset for Project Cards separately.',
  ],
  preview: {
    html: `<section class="py-5"><div class="container py-2"><h1 class="text-primary mb-4 mb-lg-5">Coastal window renovation</h1><div class="row g-5"><div class="col-12 col-lg-8 order-1"><div class="project-detail-preview ratio ratio-16x9 rounded overflow-hidden bg-light"><img src="sample-image:home" class="w-100 h-100 object-fit-cover" alt="Example project image"></div><div class="project-detail-preview-pagination d-flex justify-content-center gap-2 mt-3" aria-hidden="true"><span class="rounded-circle bg-primary" style="width:10px;height:10px"></span><span class="rounded-circle bg-secondary opacity-50" style="width:10px;height:10px"></span><span class="rounded-circle bg-secondary opacity-50" style="width:10px;height:10px"></span></div></div><aside class="col-12 col-lg-4 order-3 order-lg-2"><div class="card border-0 bg-light mb-4"><div class="card-body p-4"><h2 class="text-primary fw-bold fs-5 mb-3">Project Details</h2><p class="mb-2"><strong>Project Type:</strong> Window renovation</p><p class="mb-2"><strong>Location:</strong> Example City</p><p class="mb-0"><strong>Services:</strong> Planning and installation</p></div></div><div class="mb-3"><a href="#" class="btn btn-primary w-100 fw-semibold text-uppercase py-3">Request a Quote</a></div><div class="mb-3"><a href="#" class="btn btn-outline-primary w-100 fw-semibold text-uppercase py-3">Contact Us</a></div></aside><div class="col-12 order-2 order-lg-3"><h2 class="text-primary fw-semibold mb-3">Project Overview</h2><div class="fs-5 lh-lg"><p>A considered renovation shaped around comfort, light, and everyday use.</p></div></div></div></div></section>`,
  },
  mockData: {
    button_1_text: 'Request a Quote',
    button_1_link: '',
    button_2_text: 'Contact Us',
    button_2_link: '',
  },
};
