export default {
  id: 'banner-05',
  name: 'Hero Title with Background Image',
  category: 'hero',
  prefix: 'banner_05_',
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A centered title and description over a darkened background image inside a Bootstrap container.',
  tags: ['banner', 'background image', 'title', 'overlay'],
  template: `{%- if entity.banner_05_title.is_valid or entity.banner_05_description.is_valid or entity.banner_05_background_image.is_valid -%}
<section class="banner-05 py-5 bg-white">
  <div class="container py-2">
    <div class="banner-05-frame position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center text-center">
      {%- if entity.banner_05_background_image.is_valid -%}
      {%- img entity.banner_05_background_image preset:"1920x600-crop webp" class:"position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt:"" link:false loading:"eager" -%}
      {%- endif -%}
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" aria-hidden="true"></div>
      <div class="position-relative w-100 px-3 py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            {%- if entity.banner_05_title.is_valid -%}
            <h1 class="display-5 fw-semibold text-white mb-3">{{ entity.banner_05_title }}</h1>
            {%- endif -%}
            {%- if entity.banner_05_description.is_valid -%}
            <p class="lead text-white mb-0">{{ entity.banner_05_description }}</p>
            {%- endif -%}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.banner-05-frame {
  min-height: 29.5rem;
}

@media (max-width: 767.98px) {
  .banner-05-frame {
    min-height: 23rem;
  }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Title Background Banner',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'banner_05_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Thoughtful spaces, lasting value',
        },
        {
          Type: 'textarea',
          FieldID: 'banner_05_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Add a short supporting line below the title.',
        },
        {
          Type: 'image',
          FieldID: 'banner_05_background_image',
          Label: 'Background Image',
          Subtext: 'Recommended preset: 1920x600-crop. A dark overlay is applied for text contrast.',
          Condition: null,
          IsRequired: false,
        },
      ],
    },
  ],
  notes: [
    'The banner is contained within the Bootstrap .container and centered in the available width.',
    'Create the 1920x600-crop image preset in Marketpath. The image is decorative; the dark overlay keeps the title and description legible.',
    'Title and description are optional. The image can be omitted to use the dark background fallback.',
  ],
  preview: {
    html: `<section class="banner-05 py-5 bg-white">
  <style>.banner-05-frame{min-height:29.5rem}@media(max-width:767.98px){.banner-05-frame{min-height:23rem}}</style>
  <div class="container py-2">
    <div class="banner-05-frame position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center text-center">
      <img src="sample-image:modern" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="">
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" aria-hidden="true"></div>
      <div class="position-relative w-100 px-3 py-5"><div class="row justify-content-center"><div class="col-12 col-lg-10"><h1 class="display-5 fw-semibold text-white mb-3">Crafted for the way you live.</h1><p class="lead text-white mb-0">Thoughtful work. Clear communication. A better home.</p></div></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Crafted for the way you live.',
    description: 'Thoughtful work. Clear communication. A better home.',
    background_image: '',
  },
};
