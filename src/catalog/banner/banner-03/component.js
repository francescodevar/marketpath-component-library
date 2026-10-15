export default {
  id: 'banner-03',
  name: 'Stats Banner',
  category: 'banner',
  prefix: 'banner_03_',
  bootstrap: true,
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A responsive row of up to four proof points with Bootstrap Icons.',
  tags: ['stats', 'icons', 'four-column', 'banner'],
  template: `{%- if entity.banner_03_stats_banner_items.is_valid -%}
<section class="bg-light py-5">
  <div class="container py-2">
    <div class="row g-4">
      {%- for item in entity.banner_03_stats_banner_items -%}
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="d-flex align-items-center h-100">
          {%- if item.icon.is_valid -%}
          <div class="flex-shrink-0 me-3">
            <i class="{{ item.icon.value | escape }} fs-1 text-dark"></i>
          </div>
          {%- endif -%}
          <div>
            {%- if item.title.is_valid -%}
            <div class="fs-2 fw-bold lh-1 text-primary mb-1">
              {{ item.title }}
            </div>
            {%- endif -%}
            {%- if item.description.is_valid -%}
            <div class="text-uppercase lh-sm">
              {{ item.description }}
            </div>
            {%- endif -%}
          </div>
        </div>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Stats Banner',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'fieldset',
          FieldID: 'banner_03_stats_banner_items',
          Label: 'Items',
          Condition: null,
          IsRequired: false,
          Validators: [
            {
              Message: 'You may not add more than 4 items.',
              Type: 'maxitems',
              Value: 4,
            },
          ],
          Fields: [
            {
              Type: 'select',
              FieldID: 'icon',
              Label: 'Icon',
              Condition: null,
              IsRequired: true,
              Validators: [],
              Options: 'bi bi-person-check:Person Check;bi bi-house:House;bi bi-emoji-smile:Smile;bi bi-graph-up-arrow:Growth;bi bi-award:Award;bi bi-star:Star;bi bi-check-circle:Check Circle;bi bi-people:People;bi bi-briefcase:Briefcase;bi bi-tools:Tools',
              Delimiter: ';',
              ValueDelimiter: ':',
            },
            {
              Type: 'text',
              FieldID: 'title',
              Label: 'Title',
              Condition: null,
              IsRequired: true,
              Validators: [],
              Placeholder: 'e.g. 10+',
            },
            {
              Type: 'text',
              FieldID: 'description',
              Label: 'Description',
              Condition: null,
              IsRequired: true,
              Validators: [],
              Placeholder: 'e.g. Years of Experience',
            },
          ],
          AllowMultiple: true,
          InitCollapsed: false,
          Noun: 'item',
        },
      ],
    },
  ],
  notes: [
    'The repeatable fieldset supports up to four items; each item has an icon, title, and description.',
    'Load the Bootstrap Icons stylesheet on the Marketpath page for the selected icons to display.',
    'The section and container use the gallery spacing convention: py-5 and container py-2.',
  ],
  preview: {
    html: `<section class="bg-light py-5">
  <div class="container py-2">
    <div class="row g-4">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="d-flex align-items-center h-100">
          <div class="flex-shrink-0 me-3"><i class="bi bi-person-check fs-1 text-dark"></i></div>
          <div>
            <div class="fs-2 fw-bold lh-1 text-primary mb-1">10+</div>
            <div class="text-uppercase lh-sm">Years of experience</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="d-flex align-items-center h-100">
          <div class="flex-shrink-0 me-3"><i class="bi bi-house fs-1 text-dark"></i></div>
          <div>
            <div class="fs-2 fw-bold lh-1 text-primary mb-1">500+</div>
            <div class="text-uppercase lh-sm">Projects completed</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="d-flex align-items-center h-100">
          <div class="flex-shrink-0 me-3"><i class="bi bi-emoji-smile fs-1 text-dark"></i></div>
          <div>
            <div class="fs-2 fw-bold lh-1 text-primary mb-1">98%</div>
            <div class="text-uppercase lh-sm">Happy clients</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="d-flex align-items-center h-100">
          <div class="flex-shrink-0 me-3"><i class="bi bi-graph-up-arrow fs-1 text-dark"></i></div>
          <div>
            <div class="fs-2 fw-bold lh-1 text-primary mb-1">Our promise</div>
            <div class="text-uppercase lh-sm">Quality, built to last</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    items: [
      { icon: 'bi bi-person-check', title: '10+', description: 'Years of experience' },
      { icon: 'bi bi-house', title: '500+', description: 'Projects completed' },
      { icon: 'bi bi-emoji-smile', title: '98%', description: 'Happy clients' },
      { icon: 'bi bi-graph-up-arrow', title: 'Our promise', description: 'Quality, built to last' },
    ],
  },
};
