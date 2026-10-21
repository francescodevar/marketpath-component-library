export default {
  id: 'content-06',
  name: 'Content Image with Benefits List',
  category: 'content',
  prefix: 'content_06_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'An eyebrow, title, repeatable promise list, and large closing line beside a top-aligned image.',
  tags: ['content', 'eyebrow', 'bullets', 'image', 'two-column'],
  template: `{%- if entity.content_06_eyebrow.is_valid or entity.content_06_title.is_valid or entity.content_06_bullets.is_valid or entity.content_06_closing_text.is_valid or entity.content_06_image.is_valid -%}
<section class="content-06 bg-light py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-6">
        {%- if entity.content_06_eyebrow.is_valid -%}
        <p class="h5 mb-0 fw-bolder">{{ entity.content_06_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.content_06_title.is_valid -%}
        <h2 class="fs-2 fw-bold text-primary mb-4">{{ entity.content_06_title }}</h2>
        {%- endif -%}
        {%- if entity.content_06_bullets.is_valid -%}
        <ul class="list-unstyled d-grid gap-2 mb-0">
          {%- for item in entity.content_06_bullets -%}
            {%- if item.text.is_valid -%}
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-arrow-right-circle-fill fs-5 text-dark flex-shrink-0 align-self-start" aria-hidden="true"></i>
              <span class="h5 align-self-start">{{ item.text }}</span>
            </li>
            {%- endif -%}
          {%- endfor -%}
        </ul>
        {%- endif -%}
        {%- if entity.content_06_closing_text.is_valid -%}
        <p class="fs-3 fst-italic text-dark mt-4 mb-0">{{ entity.content_06_closing_text | newline_to_br }}</p>
        {%- endif -%}
      </div>

      {%- if entity.content_06_image.is_valid -%}
      <div class="col-12 col-lg-6">
        {%- if entity.content_06_image_ratio.is_valid and entity.content_06_image_ratio.value == 'square' -%}
        <div class="ratio ratio-1x1 overflow-hidden">
          {%- img entity.content_06_image preset:"300x300-max webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_06_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- elsif entity.content_06_image_ratio.is_valid and entity.content_06_image_ratio.value == 'landscape' -%}
        <div class="ratio ratio-4x3 overflow-hidden">
          {%- img entity.content_06_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_06_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- elsif entity.content_06_image_ratio.is_valid and entity.content_06_image_ratio.value == 'widescreen' -%}
        <div class="ratio ratio-16x9 overflow-hidden">
          {%- img entity.content_06_image preset:"1920x1080-crop webp" class:"w-100 h-100 object-fit-cover" alt:entity.content_06_image.alt|default:'' link:false loading:"lazy" -%}
        </div>
        {%- else -%}
        {%- img entity.content_06_image preset:"webp" class:"img-fluid w-100" alt:entity.content_06_image.alt|default:'' link:false loading:"lazy" -%}
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
      Label: 'Content Left + Image',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'content_06_eyebrow',
          Label: 'Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Our promise',
          DefaultValue: 'OUR PROMISE',
        },
        {
          Type: 'text',
          FieldID: 'content_06_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Installed right. Finished right.',
          DefaultValue: 'Installed right. Finished right.',
        },
        {
          Type: 'fieldset',
          FieldID: 'content_06_bullets',
          Label: 'Bullets',
          Subtext: 'Add one item for each promise or key point.',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Fields: [
            {
              Type: 'text',
              FieldID: 'text',
              Label: 'Text',
              Condition: null,
              IsRequired: false,
              Validators: [],
              Placeholder: 'Add a short point',
            },
          ],
          AllowMultiple: true,
        },
        {
          Type: 'textarea',
          FieldID: 'content_06_closing_text',
          Label: 'Large Closing Text',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'A large closing statement; line breaks are preserved.',
          DefaultValue: 'Thoughtful work, from the first inspection to the final detail.\nA finished space that feels right.',
        },
        {
          Type: 'image',
          FieldID: 'content_06_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
          Subtext: 'Displayed at the top of the right column. Transparent images work well for logos.',
        },
        {
          Type: 'select',
          FieldID: 'content_06_image_ratio',
          Label: 'Image Ratio',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'natural:Original ratio;square:Square (1:1);landscape:Landscape (4:3);widescreen:Widescreen (16:9)',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'natural',
        },
      ],
    },
  ],
  notes: [
    'The left column contains an optional eyebrow, title, repeatable bullet list, and large closing text. The right image aligns to the top of the row.',
    'The closing text is plain textarea content; line breaks are preserved in the output.',
    'Image Ratio selects a matching frame and preset: 300x300-max, 800x600-crop, or 1920x1080-crop. Original ratio keeps logos and transparent artwork uncropped.',
    'The image uses its CMS alt text and stays aligned to the top of the right column.',
    'Bootstrap Icons CSS is needed for the bullet arrow icons.',
  ],
  preview: {
    html: `<section class="content-06 bg-light py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-6">
        <p class="h5 mb-0 fw-bolder">OUR PROMISE</p>
        <h2 class="fs-2 fw-bold text-primary mb-3">Installed right. Finished right.</h2>
        <ul class="list-unstyled d-grid gap-2 mb-0">
          <li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-circle-fill fs-5 text-dark flex-shrink-0 align-self-start" aria-hidden="true"></i><span class="h5 align-self-start">We believe every project deserves careful preparation.</span></li>
          <li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-circle-fill fs-5 text-dark flex-shrink-0 align-self-start" aria-hidden="true"></i><span class="h5 align-self-start">We don’t believe in covering up problems.</span></li>
          <li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-circle-fill fs-5 text-dark flex-shrink-0 align-self-start" aria-hidden="true"></i><span class="h5 align-self-start">We finish the surrounding work with the same care as the installation.</span></li>
          <li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-circle-fill fs-5 text-dark flex-shrink-0 align-self-start" aria-hidden="true"></i><span class="h5 align-self-start">From the first inspection to the final detail, we take pride in doing the job properly.</span></li>
        </ul>
        <p class="fs-3 fst-italic text-dark mt-4 mb-0">Thoughtful work, from the first inspection to the final detail.<br>A finished space that feels right.</p>
      </div>
      <div class="col-12 col-lg-6">
        <div class="bg-white p-4 p-md-5">
          <svg class="w-100" viewBox="0 0 700 280" role="img" aria-label="Example home and design logo" xmlns="http://www.w3.org/2000/svg">
            <rect width="700" height="280" fill="#fff"/>
            <g fill="none" stroke="#124777" stroke-width="12"><path d="M28 207V93q0-52 58-66 59 14 59 66v114M12 207h148M46 207V103q0-34 40-45 41 11 41 45v104M86 99v108m-40-57h80"/><path d="M174 76h70v131h-70zM188 91h18v25h-18zm31 0h18v25h-18zm-31 43h18v25h-18zm31 0h18v25h-18z"/></g>
            <text x="265" y="145" fill="#124777" font-family="Georgia,serif" font-size="76" font-weight="600">Example</text>
            <text x="272" y="205" fill="#7b8085" font-family="Arial,sans-serif" font-size="27" letter-spacing="12">HOME &amp; DESIGN</text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'OUR PROMISE',
    title: 'Installed right. Finished right.',
    bullets: [
      { text: 'We believe every project deserves careful preparation.' },
      { text: 'We don’t believe in covering up problems.' },
      { text: 'We finish the surrounding work with the same care as the installation.' },
      { text: 'From the first inspection to the final detail, we take pride in doing the job properly.' },
    ],
    closing_text: 'Thoughtful work, from the first inspection to the final detail.\nA finished space that feels right.',
    image: '',
    image_ratio: 'natural',
  },
};
