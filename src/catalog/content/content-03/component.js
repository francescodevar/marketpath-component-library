export default {
  id: 'content-03',
  name: 'Craftsmanship + Benefits',
  category: 'content',
  prefix: 'content_03_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'An image-led about section with an experience badge, rich description, checklist, and call to action.',
  tags: ['image', 'about', 'benefits', 'checklist', 'two-column'],
  template: `<section class="py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-center{% if entity.content_03_image.is_valid %} row-cols-1 row-cols-lg-2{% endif %}">
      {%- if entity.content_03_image.is_valid -%}
      <div class="col">
        <div class="ratio ratio-1x1">
          <div class="overflow-hidden">
            {%- img entity.content_03_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" link:false loading:"lazy" -%}
            {%- if entity.content_03_experience_number.is_valid and entity.content_03_experience_label.is_valid -%}
            <div class="card text-bg-primary rounded-0 border-0 position-absolute bottom-0 end-0 w-25 h-25" role="group" aria-label="{{ entity.content_03_experience_number | escape }} {{ entity.content_03_experience_label | escape }}">
              <div class="card-body d-flex flex-column justify-content-center align-items-center p-2 p-sm-3 text-center">
                <span class="fs-1 fw-bold lh-1">{{ entity.content_03_experience_number }}</span>
                <span class="small text-uppercase fw-semibold mt-1">{{ entity.content_03_experience_label }}</span>
              </div>
            </div>
            {%- endif -%}
          </div>
        </div>
      </div>
      {%- endif -%}
      <div class="col d-flex flex-column align-items-start gap-3">
        {%- if entity.content_03_eyebrow.is_valid -%}
        <p class="small text-uppercase fw-semibold text-primary mb-0">{{ entity.content_03_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.content_03_title.is_valid -%}
        <h2 class="display-5 fw-bold text-body-emphasis mb-0">{{ entity.content_03_title }}</h2>
        {%- endif -%}
        {%- if entity.content_03_subtitle.is_valid -%}
        <p class="lead fw-semibold text-body-secondary mb-0">{{ entity.content_03_subtitle }}</p>
        {%- endif -%}
        {%- if entity.content_03_description.is_valid -%}
        <div class="text-body-secondary">{{ entity.content_03_description }}</div>
        {%- endif -%}

        {%- if entity.content_03_bullets.is_valid -%}
        <ul class="row row-cols-1 row-cols-md-2 g-3 list-unstyled mb-0">
          {%- for item in entity.content_03_bullets -%}
          {%- if item.text.is_valid -%}
          <li class="col d-flex align-items-start gap-2 fw-semibold">
            <i class="bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1" aria-hidden="true"></i>
            <span>{{ item.text }}</span>
          </li>
          {%- endif -%}
          {%- endfor -%}
        </ul>
        {%- endif -%}

        {%- if entity.content_03_button_text.is_valid and entity.content_03_button_link.is_valid -%}
        <a class="btn btn-primary py-2" href="{{ entity.content_03_button_link.value | escape }}">{{ entity.content_03_button_text }}</a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>
`,
  fields: [
    {
      Type: 'group',
      Label: 'Image + Benefits',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'image',
          FieldID: 'content_03_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
          Subtext: 'Choose an image with descriptive alt text. See Notes for the image preset.',
        },
        {
          Type: 'text',
          FieldID: 'content_03_experience_number',
          Label: 'Image card number',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. 20+',
        },
        {
          Type: 'text',
          FieldID: 'content_03_experience_label',
          Label: 'Image card label',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Years of experience',
        },
        {
          Type: 'text',
          FieldID: 'content_03_eyebrow',
          Label: 'Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. About us',
        },
        {
          Type: 'text',
          FieldID: 'content_03_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Your headline',
        },
        {
          Type: 'text',
          FieldID: 'content_03_subtitle',
          Label: 'Subtitle',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'A short supporting statement',
        },
        {
          Type: 'html',
          FieldID: 'content_03_description',
          Label: 'Description (rich text)',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'Rich HTML text displayed below the subtitle.',
        },
        {
          Type: 'fieldset',
          FieldID: 'content_03_bullets',
          Label: 'Benefits checklist',
          Condition: null,
          IsRequired: false,
          Validators: [
            {
              Message: 'You may not add more than 4 benefits.',
              Type: 'maxitems',
              Value: 4,
            },
          ],
          Fields: [
            {
              Type: 'text',
              FieldID: 'text',
              Label: 'Benefit',
              Condition: null,
              IsRequired: true,
              Validators: [],
              Placeholder: 'Describe a customer benefit',
            },
          ],
          AllowMultiple: true,
          InitCollapsed: false,
          Noun: 'benefit',
        },
        {
          Type: 'text',
          FieldID: 'content_03_button_text',
          Label: 'Button text',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Contact us',
        },
        {
          Type: 'url',
          FieldID: 'content_03_button_link',
          Label: 'Button link',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Subtext: 'The button appears only when both its text and link are set.',
        },
      ],
    },
  ],
  notes: [
    'Create the 800x600-crop preset in Marketpath. The image uses Bootstrap ratio-1x1 and object-fit-cover utilities.',
    'The number card appears over the lower-right corner of the image when both card fields are set.',
    'Description is a rich HTML field and renders its content as authored. The benefits fieldset allows up to four checked items.',
    'Load Bootstrap Icons CSS for the circular check icons.',
    'The button appears only when both Button text and Button link are set; URL output is escaped.',
    'The image column is omitted if no image is selected. The section stacks on smaller screens and uses Bootstrap utilities without custom CSS.',
  ],
  preview: {
    html: `<section class="py-5">
  <div class="container py-2">
    <div class="row row-cols-1 row-cols-lg-2 g-5 align-items-center">
      <div class="col">
        <div class="ratio ratio-1x1">
          <div class="overflow-hidden">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Crect width='800' height='800' fill='%23d6d3cc'/%3E%3Crect x='90' y='80' width='390' height='650' fill='%23363b3d'/%3E%3Crect x='115' y='105' width='340' height='600' fill='%23212628'/%3E%3Cpath d='M480 0h320v800H500l-20-120z' fill='%23ece9e3'/%3E%3Crect x='530' y='215' width='210' height='20' fill='%23a69a88'/%3E%3Crect x='540' y='480' width='160' height='110' rx='8' fill='%238c7b64'/%3E%3Ccircle cx='630' cy='430' r='62' fill='%234e634d'/%3E%3C/svg%3E" class="w-100 h-100 object-fit-cover" alt="Example renovated interior">
            <div class="card text-bg-primary rounded-0 border-0 position-absolute bottom-0 end-0 w-25 h-25">
              <div class="card-body d-flex flex-column justify-content-center align-items-center p-2 p-sm-3 text-center"><span class="fs-1 fw-bold lh-1">20+</span><span class="small text-uppercase fw-semibold mt-1">Years of experience</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col d-flex flex-column align-items-start gap-3">
        <p class="small text-uppercase fw-semibold text-primary mb-0">About us</p>
        <h2 class="display-5 fw-bold text-body-emphasis mb-0">Crafted for everyday living</h2>
        <p class="lead fw-semibold text-body-secondary mb-0">Thoughtful improvements, made to last.</p>
        <div class="text-body-secondary"><p>We bring careful planning and skilled craftsmanship to the spaces people use every day.</p><p>From the first conversation through the final details, our focus stays on quality work and a smooth experience.</p></div>
        <ul class="row row-cols-1 row-cols-md-2 g-3 list-unstyled mb-0"><li class="col d-flex align-items-start gap-2 fw-semibold"><i class="bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1" aria-hidden="true"></i><span>Clear project planning from start to finish</span></li><li class="col d-flex align-items-start gap-2 fw-semibold"><i class="bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1" aria-hidden="true"></i><span>Careful attention to every detail</span></li><li class="col d-flex align-items-start gap-2 fw-semibold"><i class="bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1" aria-hidden="true"></i><span>Respectful, tidy work areas</span></li><li class="col d-flex align-items-start gap-2 fw-semibold"><i class="bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1" aria-hidden="true"></i><span>Materials chosen for lasting performance</span></li></ul>
        <a class="btn btn-primary py-2" href="#">Explore our work</a>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    image: '',
    experience_number: '20+',
    experience_label: 'Years of experience',
    eyebrow: 'About us',
    title: 'Crafted for everyday living',
    subtitle: 'Thoughtful improvements, made to last.',
    description: '<p>We bring careful planning and skilled craftsmanship to the spaces people use every day.</p><p>From the first conversation through the final details, our focus stays on quality work and a smooth experience.</p>',
    bullets: [
      { text: 'Clear project planning from start to finish' },
      { text: 'Careful attention to every detail' },
      { text: 'Respectful, tidy work areas' },
      { text: 'Materials chosen for lasting performance' },
    ],
    button_text: 'Explore our work',
    button_link: '',
  },
};
