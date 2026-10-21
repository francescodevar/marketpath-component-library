export default {
  id: 'content-02',
  name: 'Content Title Text with Two Columns',
  category: 'content',
  prefix: 'content_02_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A centered title above a rich-text and image split with independently selectable image ratio and side.',
  tags: ['two-column', 'image', 'rich-text'],
  template: `{%- if entity.content_02_title.is_valid -%}
<section class="py-5">
  <div class="container py-2">
    <div class="row">
      <div class="col-12 col-lg-9 mx-auto text-center">
        <h2 class="pb-5 lh-1 display-3 text-center">
          {%- if entity.content_02_title_highlight.is_valid -%}
          <span class="text-primary">{{ entity.content_02_title_highlight }} </span>
          {%- endif -%}
          {{ entity.content_02_title }}
        </h2>
      </div>
    </div>

    <div class="row align-items-start g-5{% if entity.content_02_image_on_right.on %} flex-lg-row-reverse{% endif %}">
      {%- if entity.content_02_image.is_valid -%}
      <div class="col-12 col-lg-6">
        {%- if entity.content_02_image_ratio.is_valid and entity.content_02_image_ratio.value == 'square' -%}
        <div class="ratio ratio-1x1 shadow-sm overflow-hidden">
          {%- img entity.content_02_image preset:"300x300-max webp" class:"w-100 h-100 object-fit-cover" link:false loading:"lazy" -%}
        </div>
        {%- elsif entity.content_02_image_ratio.is_valid and entity.content_02_image_ratio.value == 'widescreen' -%}
        <div class="ratio ratio-16x9 shadow-sm overflow-hidden">
          {%- img entity.content_02_image preset:"1920x1080-crop webp" class:"w-100 h-100 object-fit-cover" link:false loading:"lazy" -%}
        </div>
        {%- else -%}
        <div class="ratio ratio-4x3 shadow-sm overflow-hidden">
          {%- img entity.content_02_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" link:false loading:"lazy" -%}
        </div>
        {%- endif -%}
      </div>
      {%- endif -%}

      {%- if entity.content_02_content.is_valid or entity.content_02_button_text.is_valid -%}
      <div class="col-12 col-lg-6">
        {%- if entity.content_02_content.is_valid -%}
        <div>{{ entity.content_02_content }}</div>
        {%- endif -%}
        {%- if entity.content_02_button_text.is_valid and entity.content_02_button_link.is_valid -%}
        <a class="btn btn-primary mt-4" href="{{ entity.content_02_button_link.value | escape }}">{{ entity.content_02_button_text }}</a>
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
      Label: 'Text + Rich HTML',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'content_02_title',
          Label: 'Title',
          Condition: null,
          IsRequired: true,
          Validators: [],
          Placeholder: 'e.g. Window & Door',
        },
        {
          Type: 'text',
          FieldID: 'content_02_title_highlight',
          Label: 'Title highlight',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Example',
        },
        {
          Type: 'image',
          FieldID: 'content_02_image',
          Label: 'Image',
          Subtext: 'Choose an image. Select its crop ratio below.',
          Condition: null,
          IsRequired: false,
        },
        {
          Type: 'select',
          FieldID: 'content_02_image_ratio',
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
          FieldID: 'content_02_image_on_right',
          Label: 'Image on the right',
          Condition: null,
          OnLabel: 'Right',
          OnValue: 'On',
          OnColor: 'success',
          OffLabel: 'Left',
          OffValue: 'Off',
          OffColor: 'secondary',
          DefaultValue: false,
        },
        {
          Type: 'html',
          FieldID: 'content_02_content',
          Label: 'Content (rich text)',
          Subtext: 'Headings, paragraphs, and inline formatting are allowed.',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'content_02_button_text',
          Label: 'Button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'url',
          FieldID: 'content_02_button_link',
          Label: 'Button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'Use a page link or a trusted HTTPS URL. Both text and link are needed.',
        },
      ],
    },
  ],
  notes: [
    'Content is a rich-text (html) field, so editors can add headings, paragraphs, and inline formatting; it renders raw at output.',
    'The Image Ratio field sets both the display frame and its image preset: 300x300-max for square, 800x600-crop for landscape, and 1920x1080-crop for widescreen.',
    'The Image on the right toggle reverses the columns on desktop. The image column stacks first on mobile.',
    'Button appears only when both Button text and Button link are set.',
    'Create the selected image presets in Marketpath.',
  ],
  preview: {
    html: `<section class="py-5">
  <div class="container py-2">
    <div class="row"><div class="col-12 col-lg-9 mx-auto text-center"><h2 class="pb-5 lh-1 display-3 text-center"><span class="text-primary">Example </span> Window &amp; Door</h2></div></div>
    <div class="row align-items-start g-5">
      <div class="col-12 col-lg-6"><div class="ratio ratio-4x3 shadow-sm overflow-hidden"><img src="sample-image:home" class="w-100 h-100 object-fit-cover" alt="Sample image placeholder" loading="lazy"></div></div>
      <div class="col-12 col-lg-6"><h3>Windows. Doors. Decks. Finished Right.</h3><p>At Example, replacing a window or door means more than removing the old and installing the new.</p><p>We look carefully at the surrounding work and take time to complete every detail.</p><a class="btn btn-primary mt-4" href="#">Learn more</a></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Window & Door',
    title_highlight: 'Example',
    content: '<h3>Windows. Doors. Decks. Finished Right.</h3><p>We look carefully at the surrounding work and take time to complete every detail.</p>',
    image: '',
    image_ratio: 'landscape',
    image_on_right: false,
    button_text: 'Learn more',
    button_link: '',
  },
};
