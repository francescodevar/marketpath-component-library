export default {
  id: 'content-04',
  name: 'Content Flexible Text and Image Split',
  category: 'content',
  prefix: 'content_04_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A flexible two-column content section with rich HTML and an image that can sit on either side.',
  tags: ['content', 'image', 'two-column', 'about'],
  template: `{%- if entity.content_04_title.is_valid or entity.content_04_body.is_valid or entity.content_04_image.is_valid -%}
<section class="content-04 bg-light py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 {% if entity.content_04_image.is_valid %}col-lg-6{% else %}col-lg-10 mx-auto{% endif %} {% if entity.content_04_image_position.is_valid and entity.content_04_image_position.value == 'left' %}order-2{% else %}order-1{% endif %}">
        {%- if entity.content_04_title.is_valid -%}
        <h2 class="h2 mb-3 fs-1">{{ entity.content_04_title }}</h2>
        {%- endif -%}
        {%- if entity.content_04_body.is_valid -%}
        <div class="text-body">{{ entity.content_04_body }}</div>
        {%- endif -%}
      </div>

      {%- if entity.content_04_image.is_valid -%}
      <div class="col-12 col-lg-6 {% if entity.content_04_image_position.is_valid and entity.content_04_image_position.value == 'left' %}order-1{% else %}order-2{% endif %}">
        {%- if entity.content_04_image_ratio.is_valid and entity.content_04_image_ratio.value == 'landscape' -%}
        <div class="ratio ratio-4x3 overflow-hidden">
          {%- img entity.content_04_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_04_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- elsif entity.content_04_image_ratio.is_valid and entity.content_04_image_ratio.value == 'widescreen' -%}
        <div class="ratio ratio-16x9 overflow-hidden">
          {%- img entity.content_04_image preset:"1920x1080-crop webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_04_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- else -%}
        <div class="ratio ratio-1x1 overflow-hidden">
          {%- img entity.content_04_image preset:"300x300-max webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_04_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- endif -%}
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Text + Image',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'content_04_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Thoughtful work, built around your home',
        },
        {
          Type: 'html',
          FieldID: 'content_04_body',
          Label: 'Content',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'Add formatted paragraphs, lists, and links.',
        },
        {
          Type: 'image',
          FieldID: 'content_04_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
          Subtext: 'Recommended preset: 800x600-crop.',
        },
        {
          Type: 'select',
          FieldID: 'content_04_image_ratio',
          Label: 'Image Ratio',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'square:Square (1:1);landscape:Landscape (4:3);widescreen:Widescreen (16:9)',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'square',
        },
        {
          Type: 'select',
          FieldID: 'content_04_image_position',
          Label: 'Image Position',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'left:Image on left;right:Image on right',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'right',
        },
      ],
    },
  ],
  notes: [
    'The section is constrained by the Bootstrap .container. Image Ratio sets both the frame and matching preset: 300x300-max, 800x600-crop, or 1920x1080-crop.',
    'Choose Image Position to place the image before or after the text on desktop and mobile.',
    'Create the selected image presets in Marketpath. The image uses its CMS alt text when available.',
    'The Title is an h2 with h2 mb-3 fs-1 classes. Content is rich HTML and is rendered as entered.',
  ],
  preview: {
    html: `<section class="content-04 bg-light py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-6 order-1">
        <h2 class="h2 mb-3 fs-1">Thoughtful work, built around your home.</h2>
        <div class="text-body">
          <p class="lead">A team that brings care and skill to every project.</p>
          <p>From the first conversation through the finishing details, we focus on preparation and craftsmanship.</p>
          <ul><li>Clear planning and communication</li><li>Careful attention to the details</li><li>Work designed to last</li></ul>
          <p class="mb-0">We believe a better process makes a better finished space.</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 order-2">
        <div class="ratio ratio-1x1 overflow-hidden" role="img" aria-label="Illustration of a home improvement project">
          <img src="sample-image:home" class="w-100 h-100 object-fit-cover" alt="">
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Thoughtful work, built around your home.',
    body: '<p class="lead">A team that brings care and skill to every project.</p><p>From the first conversation through the finishing details, we focus on preparation and craftsmanship.</p><ul><li>Clear planning and communication</li><li>Careful attention to the details</li><li>Work designed to last</li></ul><p>We believe a better process makes a better finished space.</p>',
    image: '',
    image_ratio: 'square',
    image_position: 'right',
  },
};
