export default {
  id: 'content-01',
  name: 'Text + Image',
  category: 'content',
  prefix: 'content_01_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A balanced two-column layout with a configurable image ratio and side.',
  tags: ['two-column', 'image', 'bootstrap'],
  template: `{%- if entity.content_01_title.is_valid -%}
<section class="py-5 bg-white">
  <div class="container py-lg-5">
    <div class="row g-5 align-items-center{% if entity.content_01_image_on_left.on %} flex-lg-row-reverse{% endif %}">
      <div class="col-lg">
        {%- if entity.content_01_eyebrow.is_valid -%}
        <p class="small text-uppercase text-primary fw-semibold mb-3">{{ entity.content_01_eyebrow }}</p>
        {%- endif -%}
        <h2 class="display-5 fw-bold mb-0">{{ entity.content_01_title }}</h2>
        {%- if entity.content_01_description.is_valid -%}
        <p class="lead text-secondary mt-4 mb-0">{{ entity.content_01_description }}</p>
        {%- endif -%}
        {%- if entity.content_01_button_text.is_valid and entity.content_01_button_link.is_valid -%}
        <a class="btn btn-primary mt-4" href="{{ entity.content_01_button_link.value | escape }}">{{ entity.content_01_button_text }}</a>
        {%- endif -%}
      </div>
      {%- if entity.content_01_image.is_valid -%}
      <div class="col-lg-6">
        {%- if entity.content_01_image_ratio.is_valid and entity.content_01_image_ratio.value == 'square' -%}
        <div class="ratio ratio-1x1">
          {%- img entity.content_01_image preset:"300x300-max webp" class:"w-100 h-100 object-fit-cover rounded" link:false loading:"lazy" -%}
        </div>
        {%- elsif entity.content_01_image_ratio.is_valid and entity.content_01_image_ratio.value == 'widescreen' -%}
        <div class="ratio ratio-16x9">
          {%- img entity.content_01_image preset:"1920x1080-crop webp" class:"w-100 h-100 object-fit-cover rounded" link:false loading:"lazy" -%}
        </div>
        {%- else -%}
        <div class="ratio ratio-4x3">
          {%- img entity.content_01_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover rounded" link:false loading:"lazy" -%}
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
          FieldID: 'content_01_eyebrow',
          Label: 'Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'content_01_title',
          Label: 'Title',
          Condition: null,
          IsRequired: true,
          Validators: [],
          Placeholder: 'Your headline',
        },
        {
          Type: 'textarea',
          FieldID: 'content_01_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'content_01_button_text',
          Label: 'Button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'url',
          FieldID: 'content_01_button_link',
          Label: 'Button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'Use a page link or a trusted HTTPS URL. Both text and link are needed.',
        },
        {
          Type: 'image',
          FieldID: 'content_01_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
          Subtext: 'Choose an image with descriptive alt text.',
        },
        {
          Type: 'select',
          FieldID: 'content_01_image_ratio',
          Label: 'Image Ratio',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'square:Square (1:1);landscape:Landscape (4:3);widescreen:Widescreen (16:9)',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'landscape',
        },
        {
          Type: 'toggle',
          FieldID: 'content_01_image_on_left',
          Label: 'Image on the left',
          Condition: null,
          IsRequired: false,
          OnLabel: 'Left',
          OnValue: 'On',
          OnColor: 'success',
          OffLabel: 'Right',
          OffValue: 'Off',
          OffColor: 'secondary',
          DefaultValue: false,
        },
      ],
    },
  ],
  notes: [
    'The Image Ratio field sets both the display frame and the matching image preset: 300x300-max for square, 800x600-crop for landscape, and 1920x1080-crop for widescreen.',
    'Toggle Image on the left reverses the desktop column order; mobile content stacks naturally.',
    'Create the listed image presets in Marketpath. The image column is omitted when no image is selected.',
  ],
  preview: {
    html: `<section class="py-5 bg-white">
  <div class="container py-lg-5">
    <div class="row g-5 align-items-center">
      <div class="col-lg"><p class="small text-uppercase text-primary fw-semibold mb-3">MADE WITH PURPOSE</p><h2 class="display-5 fw-bold mb-0">A little detail. A big difference.</h2><p class="lead text-secondary mt-4 mb-0">We believe the best spaces bring people together. From the first conversation to the final finish, we make every detail count.</p><a class="btn btn-primary mt-4" href="#">Our approach</a></div>
      <div class="col-lg-6"><div class="ratio ratio-4x3"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDEyMDAgOTAwIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5MDAiIGZpbGw9IiNlNWU5ZWUiLz48Y2lyY2xlIGN4PSI4MjUiIGN5PSIyNzAiIHI9Ijg1IiBmaWxsPSIjZDBkN2UwIi8+PHBhdGggZD0iTTAgOTAwVjc3MEwzNjAgMzkwIDY3MCA3MzAgODU1IDUzNSAxMjAwIDg3NVY5MDAiIGZpbGw9IiNjY2Q0ZGUiLz48cGF0aCBkPSJNMCA5MDBMMzYwIDUxMCA3MDAgOTAwIiBmaWxsPSIjYmRjOGQ1Ii8+PC9zdmc+" class="w-100 h-100 object-fit-cover rounded" alt="Sample image placeholder"></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'MADE WITH PURPOSE',
    title: 'A little detail. A big difference.',
    description: 'We believe the best spaces bring people together. From the first conversation to the final finish, we make every detail count.',
    button_text: 'Our approach',
    button_link: '',
    image: '',
    image_ratio: 'landscape',
    image_on_left: false,
  },
};
