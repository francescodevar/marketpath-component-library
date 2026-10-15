export default {
  id: 'banner-01',
  name: 'Page Banner',
  category: 'banner',
  prefix: 'banner_01_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'Give an interior page a clear title and a little breathing room.',
  tags: ['image', 'page-header', 'bootstrap'],
  template: `{%- if entity.banner_01_title.is_valid -%}
<section class="position-relative overflow-hidden bg-light py-5">
  {%- if entity.banner_01_show_image.on and entity.banner_01_image.is_valid -%}
  {%- if entity.banner_01_image.is_valid -%}
  {%- img entity.banner_01_image preset:"1920x600-crop webp" class:"position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt:"" link:false loading:"eager" -%}
  {%- endif -%}
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75" aria-hidden="true"></div>
  {%- endif -%}
  <div class="container position-relative py-lg-4">
    <h1 class="display-5 fw-bold">{{ entity.banner_01_title }}</h1>
    {%- if entity.banner_01_description.is_valid -%}
    <p class="lead mb-0 text-secondary">{{ entity.banner_01_description }}</p>
    {%- endif -%}
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Page Banner',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'banner_01_title',
          Label: 'Title',
          Condition: null,
          IsRequired: true,
          Validators: [],
          Placeholder: 'Your headline',
        },
        {
          Type: 'textarea',
          FieldID: 'banner_01_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'toggle',
          FieldID: 'banner_01_show_image',
          Label: 'Show background image',
          Condition: null,
          IsRequired: false,
          OnLabel: 'Show',
          OnValue: 'On',
          OnColor: 'success',
          OffLabel: 'Hide',
          OffValue: 'Off',
          OffColor: 'secondary',
          DefaultValue: false,
        },
        {
          Type: 'image',
          FieldID: 'banner_01_image',
          Label: 'Background image',
          Condition: { Type: 'eq', FieldID: 'banner_01_show_image', Value: true },
          IsRequired: false,
          Subtext: 'Create the 1920x600-crop and webp presets. Decorative background.',
        },
      ],
    },
  ],
  notes: [
    'Create the 1920x600-crop and webp presets in Marketpath.',
    'Enable Show background image and select an image to display it. The toggle uses .on, not .value == true.',
    'The required Title controls section visibility. No breadcrumb integration is assumed.',
  ],
  preview: {
    html: `<section class="position-relative overflow-hidden bg-light py-5">
  <div class="container position-relative py-lg-4">
    <h1 class="display-5 fw-bold">Room for something new.</h1>
    <p class="lead mb-0 text-secondary">Explore the possibilities. Find your next inspiration.</p>
  </div>
</section>`,
  },
  mockData: {
    title: 'Room for something new.',
    description: 'Explore the possibilities. Find your next inspiration.',
    show_image: false,
    image: '',
  },
};
