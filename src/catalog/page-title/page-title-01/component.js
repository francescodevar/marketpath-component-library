import {
  pageTitleBreadcrumbField,
  pageTitleCustomTitleField,
  pageTitleSharedFieldIds,
  pageTitleTitleSourceField,
} from '../shared-fields.js';

export default {
  id: 'page-title-01',
  name: 'Page Title Banner',
  category: 'page-title',
  prefix: 'page_title_01_',
  sharedFieldsId: 'page_title_01',
  sharedFieldIds: pageTitleSharedFieldIds,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A solid-color page title banner with a built-in or custom title and an optional parent breadcrumb.',
  tags: ['page title', 'solid color', 'breadcrumbs'],
  template: `<section class="py-4{% if entity.page_title_01_background_color.is_valid %} bg-{{ entity.page_title_01_background_color.value | escape }}{% else %} bg-light{% endif %}{% if entity.page_title_01_background_color.is_valid and entity.page_title_01_background_color.value != 'light' %} text-white{% else %} text-body{% endif %}">
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
            <li class="breadcrumb-item"><a class="{% if entity.page_title_01_background_color.is_valid and entity.page_title_01_background_color.value != 'light' %}link-light{% else %}link-secondary{% endif %}" href="/">Home</a></li>
            {%- for part in url_parts -%}
              {%- unless part == '' -%}
                {%- capture breadcrumb_path -%}{{ breadcrumb_path }}/{{ part }}{%- endcapture -%}
                {%- if forloop.index == last_segment_index -%}
                <li class="breadcrumb-item active{% if entity.page_title_01_background_color.is_valid and entity.page_title_01_background_color.value != 'light' %} text-white{% endif %}" aria-current="page">{{ entity.title }}</li>
                {%- else -%}
                <li class="breadcrumb-item"><a class="{% if entity.page_title_01_background_color.is_valid and entity.page_title_01_background_color.value != 'light' %}link-light{% else %}link-secondary{% endif %}" href="{{ breadcrumb_path | strip | escape }}">{{ part | replace:'-',' ' | capitalize | escape }}</a></li>
                {%- endif -%}
              {%- endunless -%}
            {%- endfor -%}
          </ol>
        </nav>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>`,
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
          Type: 'select',
          FieldID: 'page_title_01_background_color',
          Label: 'Background color',
          Condition: null,
          IsRequired: true,
          Options: 'primary:Primary;secondary:Secondary;dark:Dark;light:Light',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'light',
        },
        pageTitleBreadcrumbField,
      ],
    },
  ],
  notes: [
    'This is a Page Custom Fields component and does not use a datastore.',
    'Title source is a radio field. Custom title appears only when selected. This solid-color variant lets you choose Bootstrap primary, secondary, dark, or light directly.',
    'When enabled, the self-contained breadcrumb builds Home and each intermediate link from entity.url.value; slug segments are humanized and the final crumb uses entity.title. It aligns at the right of the title row on wider screens and stacks under the title on mobile.',
    'The banner and breadcrumb use Bootstrap 5.3 classes without custom CSS or JavaScript.',
  ],
  preview: {
    html: `<section class="py-4 bg-light text-body">
  <div class="container py-2 position-relative">
    <div class="row align-items-center">
      <div class="col-12 col-md"><h1 class="h2 mb-0">About Us</h1></div>
      <div class="col-12 col-md-auto ms-md-auto d-flex justify-content-start justify-content-md-end mt-3 mt-md-0">
        <nav aria-label="Breadcrumb"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a class="link-secondary" href="#">Home</a></li><li class="breadcrumb-item active" aria-current="page">About Us</li></ol></nav>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title_source: 'page',
    custom_title: 'Page title example',
    background_color: 'light',
    show_breadcrumbs: true,
  },
};
