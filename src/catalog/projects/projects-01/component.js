import { projectCardFields } from '../shared-fields.js';

export default {
  id: 'projects-01',
  name: 'Project Cards',
  category: 'projects',
  prefix: 'projects_',
  sharedFieldsId: 'projects',
  datastoreId: 'projects',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'Responsive project cards with a full-card link and a slide-up title and action panel.',
  tags: ['projects', 'cards', 'datastore', 'hover'],
  template: `{%- if entity.projects_items.is_valid -%}
<section class="py-5">
  <div class="container py-2">
    {%- if entity.projects_eyebrow.is_valid or entity.projects_title.is_valid or entity.projects_description.is_valid -%}
    <div class="row mb-5">
      <div class="col-12 col-lg-8 mx-auto text-center">
        {%- if entity.projects_eyebrow.is_valid -%}
        <p class="small text-uppercase text-primary fw-semibold mb-2">{{ entity.projects_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.projects_title.is_valid -%}
        <h2 class="display-5 fw-bold mb-3">{{ entity.projects_title }}</h2>
        {%- endif -%}
        {%- if entity.projects_description.is_valid -%}
        <p class="mb-0">{{ entity.projects_description }}</p>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}

    <div class="row g-4">
      {%- for project in entity.projects_items -%}
      <div class="col-12 col-md-6 col-lg-4">
        <a href="{{ project.full_url | escape }}" class="project-card d-block position-relative overflow-hidden bg-light text-decoration-none" aria-label="View project: {{ project.title | escape }}">
          <div class="ratio ratio-4x3">
            {%- if project.project_image.is_valid -%}
            {%- img project.project_image alt:project.project_image.alt|default:'Project image' preset:'800x450-crop webp' class:'w-100 h-100 object-fit-cover' loading:'lazy' -%}
            {%- elsif project.project_images.is_valid -%}
            <img src="{% image_url = project.project_images.items[0] | preset:"800x450-crop webp" %}" alt="{{ project.project_images.items[0].alt.value | escape }}" class="w-100 h-100 object-fit-cover" loading="lazy">
            {%- endif -%}
          </div>
          <div class="project-card-panel position-absolute start-0 bottom-0 w-100 bg-light text-center">
            <div class="project-card-title d-flex align-items-center justify-content-center p-4">
              <span class="h5 fw-bold mb-0">{{ project.title }}</span>
            </div>
            <div class="project-card-action d-flex align-items-center px-4 pb-4">
              <span class="btn btn-outline-primary w-100">View Project</span>
            </div>
          </div>
        </a>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{%- add_stylesheet inline %}
.project-card {
  min-height: 320px;
  color: inherit;
}

.project-card:focus-visible {
  outline: 3px solid var(--bs-primary);
  outline-offset: 3px;
}

.project-card-panel {
  transform: translateY(calc(100% - 6rem));
  transition: transform .3s ease;
}

.project-card-title { min-height: 6rem; }
.project-card-action { min-height: 4rem; }

@media (hover: hover) {
  .project-card:hover .project-card-panel,
  .project-card:focus-visible .project-card-panel,
  .project-card:focus-within .project-card-panel { transform: translateY(0); }
}

@media (hover: none) {
  .project-card-panel { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-panel { transition: none; }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: projectCardFields,
  notes: [
    'Select project records from the shared Projects datastore. The item’s default title is used as the card title and link label.',
    'The card links to the project item and displays project_image, falling back to the first project_images item.',
    'The slide-up action panel is revealed on hover and keyboard focus; it remains visible on touch devices. Custom CSS is limited to this interaction.',
    'Create the 800x450-crop webp preset in Marketpath if project images are used.',
    'project_summary, project_content, project_overview, project_images, and projects_details remain available in the datastore for project detail templates; cards intentionally show only image, title, and action.',
  ],
  preview: {
    html: `<section class="py-5">
  <style>
    .project-card{min-height:320px;color:inherit}.project-card:focus-visible{outline:3px solid var(--bs-primary);outline-offset:3px}.project-card-panel{transform:translateY(calc(100% - 6rem));transition:transform .3s ease}.project-card-title{min-height:6rem}.project-card-action{min-height:4rem}@media(hover:hover){.project-card:hover .project-card-panel,.project-card:focus-visible .project-card-panel,.project-card:focus-within .project-card-panel{transform:translateY(0)}}@media(hover:none){.project-card-panel{transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.project-card-panel{transition:none}}
  </style>
  <div class="container py-2">
    <div class="row mb-5"><div class="col-12 col-lg-8 mx-auto text-center"><p class="small text-uppercase text-primary fw-semibold mb-2">Selected work</p><h2 class="display-5 fw-bold mb-3">Projects built to last</h2><p class="mb-0">A selection of recent projects and the details that make them unique.</p></div></div>
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="project-card d-block position-relative overflow-hidden bg-light text-decoration-none" aria-label="View project: Coastal window renovation"><div class="ratio ratio-4x3"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23d8e2e3'/%3E%3Cpath d='M60 520V160h680v360z' fill='%23f2f0e9'/%3E%3Cpath d='M120 210h260v250H120zm300 0h260v250H420z' fill='%2393aeb7'/%3E%3C/svg%3E" class="w-100 h-100 object-fit-cover" alt="Example project home"></div><span class="project-card-panel position-absolute start-0 bottom-0 w-100 bg-light text-center"><span class="project-card-title d-flex align-items-center justify-content-center p-4"><span class="h5 fw-bold mb-0">Coastal window renovation</span></span><span class="project-card-action d-flex align-items-center px-4 pb-4"><span class="btn btn-outline-primary w-100">View Project</span></span></span></a></div>
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="project-card d-block position-relative overflow-hidden bg-light text-decoration-none" aria-label="View project: Welcoming entry doors"><div class="ratio ratio-4x3"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23d9ded8'/%3E%3Cpath d='M90 540V100h620v440z' fill='%23eee9de'/%3E%3Cpath d='M285 180h230v360H285z' fill='%2373543f'/%3E%3Ccircle cx='475' cy='360' r='9' fill='%23d3b16d'/%3E%3C/svg%3E" class="w-100 h-100 object-fit-cover" alt="Example entry door project"></div><span class="project-card-panel position-absolute start-0 bottom-0 w-100 bg-light text-center"><span class="project-card-title d-flex align-items-center justify-content-center p-4"><span class="h5 fw-bold mb-0">Welcoming entry doors</span></span><span class="project-card-action d-flex align-items-center px-4 pb-4"><span class="btn btn-outline-primary w-100">View Project</span></span></span></a></div>
      <div class="col-12 col-md-6 col-lg-4"><a href="#" class="project-card d-block position-relative overflow-hidden bg-light text-decoration-none" aria-label="View project: Backyard deck retreat"><div class="ratio ratio-4x3"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23dce6eb'/%3E%3Cpath d='M0 410h800v190H0z' fill='%2394785d'/%3E%3Cpath d='M140 280h520v180H140z' fill='%23bd9b75'/%3E%3Cpath d='M180 460v140m440-140v140' stroke='%236b5846' stroke-width='22'/%3E%3C/svg%3E" class="w-100 h-100 object-fit-cover" alt="Example outdoor project"></div><span class="project-card-panel position-absolute start-0 bottom-0 w-100 bg-light text-center"><span class="project-card-title d-flex align-items-center justify-content-center p-4"><span class="h5 fw-bold mb-0">Backyard deck retreat</span></span><span class="project-card-action d-flex align-items-center px-4 pb-4"><span class="btn btn-outline-primary w-100">View Project</span></span></span></a></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'Selected work',
    title: 'Projects built to last',
    description: 'A selection of recent projects and the details that make them unique.',
    items: [
      { title: 'Coastal window renovation', project_image: '', project_summary: '<p>A brighter, more comfortable coastal home.</p>', full_url: '#' },
      { title: 'Welcoming entry doors', project_image: '', project_summary: '<p>A thoughtful entry with lasting curb appeal.</p>', full_url: '#' },
      { title: 'Backyard deck retreat', project_image: '', project_summary: '<p>An outdoor space designed for gathering.</p>', full_url: '#' },
    ],
  },
};
