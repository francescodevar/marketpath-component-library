import {
  pageTitleBreadcrumbField,
  pageTitleCustomTitleField,
  pageTitleSharedFieldIds,
  pageTitleTitleSourceField,
} from '../shared-fields.js';

export default {
  id: 'page-title-02',
  name: 'Page Title with Image',
  category: 'page-title',
  prefix: 'page_title_01_',
  sharedFieldsId: 'page_title_01',
  sharedFieldIds: pageTitleSharedFieldIds,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'An image-backed page title with a dark Bootstrap overlay and an optional right-aligned breadcrumb.',
  tags: ['page title', 'background image', 'breadcrumbs'],
  template: `{%- if entity.page_title_01_background_image.is_valid -%}
<section class="py-5 position-relative overflow-hidden bg-dark text-white">
  {%- img entity.page_title_01_background_image preset:"1920x600-crop webp" class:"position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt:"" link:false loading:"eager" -%}
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" aria-hidden="true"></div>
  <div class="container py-2 position-relative">
    <div class="row align-items-center">
      <div class="col-12 col-md">
        {%- if entity.page_title_01_title_source.is_valid -%}
          {%- if entity.page_title_01_title_source.value == 'page' -%}
          <h1 class="h2 mb-0">{{ entity.title }}</h1>
          {%- elsif entity.page_title_01_title_source.value == 'custom' -%}
            {%- if entity.page_title_01_custom_title.is_valid -%}
            <h1 class="h2 mb-0">{{ entity.page_title_01_custom_title }}</h1>
            {%- endif -%}
          {%- endif -%}
        {%- endif -%}
      </div>
      {%- if entity.page_title_01_show_breadcrumbs.is_valid and entity.page_title_01_show_breadcrumbs.on -%}
      <div class="col-12 col-md-auto ms-md-auto d-flex justify-content-start justify-content-md-end mt-3 mt-md-0">
        <nav aria-label="Breadcrumb">
          <ol class="breadcrumb mb-0">
            {%- assign url_parts = entity.url.value | split:'/' -%}
            {%- assign breadcrumb_path = '' -%}
            {%- assign last_segment_index = 0 -%}
            {%- for part in url_parts -%}
              {%- unless part == '' -%}
                {%- assign last_segment_index = forloop.index -%}
              {%- endunless -%}
            {%- endfor -%}
            <li class="breadcrumb-item"><a class="link-light" href="/">Home</a></li>
            {%- for part in url_parts -%}
              {%- unless part == '' -%}
                {%- capture breadcrumb_path -%}{{ breadcrumb_path }}/{{ part }}{%- endcapture -%}
                {%- if forloop.index == last_segment_index -%}
                <li class="breadcrumb-item active text-white" aria-current="page">{{ entity.title }}</li>
                {%- else -%}
                <li class="breadcrumb-item"><a class="link-light" href="{{ breadcrumb_path | strip | escape }}">{{ part | replace:'-',' ' | capitalize | escape }}</a></li>
                {%- endif -%}
              {%- endunless -%}
            {%- endfor -%}
          </ol>
        </nav>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Page Title',
      Condition: null,
      Collapsible: true,
      Fields: [
        pageTitleTitleSourceField,
        pageTitleCustomTitleField,
        {
          Type: 'image',
          FieldID: 'page_title_01_background_image',
          Label: 'Background image',
          Condition: null,
          IsRequired: true,
          Subtext: 'Choose a wide image. See Notes for the image preset.',
        },
        pageTitleBreadcrumbField,
      ],
    },
  ],
  notes: [
    'This image-only variant uses Page Custom Fields and does not use a datastore. Its title source, custom title, and breadcrumb Fields are shared with Page Title 01; only the background field differs.',
    'Create the 1920x600-crop preset in Marketpath. The background image is decorative beneath a Bootstrap dark overlay.',
    'When enabled, the self-contained breadcrumb builds Home and each intermediate link from entity.url.value; slug segments are humanized and the final crumb uses entity.title.',
    'The image section uses Bootstrap 5.3 ratio, positioning, and overlay utilities without custom CSS or JavaScript.',
  ],
  preview: {
    html: `<section class="py-5 position-relative overflow-hidden bg-dark text-white">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Crect width='1200' height='400' fill='%23cbd4d8'/%3E%3Cpath d='M0 310 250 120l210 150 210-190 260 220 270-150v250H0z' fill='%237f9398'/%3E%3C/svg%3E" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="">
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" aria-hidden="true"></div>
  <div class="container py-2 position-relative">
    <div class="row align-items-center">
      <div class="col-12 col-md"><h1 class="h2 mb-0">About Us</h1></div>
      <div class="col-12 col-md-auto ms-md-auto d-flex justify-content-start justify-content-md-end mt-3 mt-md-0"><nav aria-label="Breadcrumb"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a class="link-light" href="#">Home</a></li><li class="breadcrumb-item active text-white" aria-current="page">About Us</li></ol></nav></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title_source: 'page',
    custom_title: 'About Us',
    background_image: '',
    show_breadcrumbs: true,
  },
};
