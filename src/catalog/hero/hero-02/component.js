export default {
  id: 'hero-02',
  name: 'Split Hero',
  category: 'hero',
  prefix: 'hero_02_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A balanced two-column layout that stacks naturally on mobile.',
  tags: ['two-column', 'image', 'bootstrap'],
  template: `{%- if entity.hero_02_title.is_valid -%}
<section class="py-5 bg-white">
  <div class="container py-lg-5">
    <div class="row g-5 align-items-center">
      <div class="col-lg">
        <h1 class="display-5 fw-bold mb-0">{{ entity.hero_02_title }}</h1>
        {%- if entity.hero_02_description.is_valid -%}
        <p class="lead text-secondary mt-4 mb-0">{{ entity.hero_02_description }}</p>
        {%- endif -%}
        {%- if entity.hero_02_button_text.is_valid and entity.hero_02_button_link.is_valid -%}
        <a class="btn btn-primary mt-4" href="{{ entity.hero_02_button_link.value | escape }}">{{ entity.hero_02_button_text }}</a>
        {%- endif -%}
      </div>
      {%- if entity.hero_02_image.is_valid -%}
      <div class="col-lg-6">
        <div class="ratio ratio-4x3">
          {%- img entity.hero_02_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover rounded" alt:entity.hero_02_image.alt|default:'' link:false loading:"eager" -%}
        </div>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Split Hero',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'hero_02_title',
          Label: 'Title',
          Condition: null,
          IsRequired: true,
          Validators: [],
          Placeholder: 'Your headline',
        },
        {
          Type: 'textarea',
          FieldID: 'hero_02_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'hero_02_button_text',
          Label: 'Button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'url',
          FieldID: 'hero_02_button_link',
          Label: 'Button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'Use a page link or a trusted HTTPS URL. Both text and link are needed.',
        },
        {
          Type: 'image',
          FieldID: 'hero_02_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
          Subtext: 'Create the 800x600-crop and webp presets. The CMS image alt text is used.',
        },
      ],
    },
  ],
  notes: [
    'Create the 800x600-crop and webp image presets in Marketpath. Content images use their CMS alt text.',
    'The required Title controls section visibility. The image column is omitted when no image is selected.',
  ],
  preview: {
    html: `<section class="py-5 bg-white">
  <div class="container py-lg-5">
    <div class="row g-5 align-items-center">
      <div class="col-lg"><h1 class="display-5 fw-bold mb-0">Good things start with a better space.</h1><p class="lead text-secondary mt-4 mb-0">Windows, doors, and decks made for the moments that matter. Discover what is possible.</p><a class="btn btn-primary mt-4" href="#">Find your inspiration</a></div>
      <div class="col-lg-6"><div class="ratio ratio-4x3"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDEyMDAgOTAwIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5MDAiIGZpbGw9IiNlNWU5ZWUiLz48Y2lyY2xlIGN4PSI4MjUiIGN5PSIyNzAiIHI9Ijg1IiBmaWxsPSIjZDBkN2UwIi8+PHBhdGggZD0iTTAgOTAwVjc3MEwzNjAgMzkwIDY3MCA3MzAgODU1IDUzNSAxMjAwIDg3NVY5MDAiIGZpbGw9IiNjY2Q0ZGUiLz48cGF0aCBkPSJNMCA5MDBMMzYwIDUxMCA3MDAgOTAwIiBmaWxsPSIjYmRjOGQ1Ii8+PC9zdmc+" class="w-100 h-100 object-fit-cover rounded" alt="Sample image placeholder"></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Good things start with a better space.',
    description: 'Windows, doors, and decks made for the moments that matter. Discover what is possible.',
    button_text: 'Find your inspiration',
    button_link: '',
    image: '',
  },
};
