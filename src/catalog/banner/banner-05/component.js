export default {
  id: 'banner-05',
  name: 'Title Background Banner',
  category: 'banner',
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
      <svg class="position-absolute top-0 start-0 w-100 h-100" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="1400" height="600" fill="#8ca6aa"/><path d="M0 376 425 155l420 221v224H0z" fill="#637a73"/><path d="m425 155 210-100 210 100v445H425z" fill="#71857e"/><path d="m845 190 270-120 285 120v410H845z" fill="#8b9388"/><path d="M470 212h125v145H470zM657 212h125v145H657zM906 236h140v156H906zM1100 236h140v156h-140z" fill="#c6d5d1" stroke="#eee9dc" stroke-width="14"/><path d="M533 212v145m-63-73h125m186-72v145m-124-73h125m123 29v156m-140-78h140m194-78v156m-140-78h140" stroke="#eee9dc" stroke-width="8"/><path d="M0 510h1400v90H0z" fill="#75624d"/><path d="M0 540h1400M0 575h1400" stroke="#a88a68" stroke-width="8"/><path d="M0 450q170-130 355-50v110H0m1045-20q150-170 355-120v130h-355" fill="#526a50"/><path d="M0 444q180-170 370-80m680 108q170-180 350-130" fill="none" stroke="#6f8c5e" stroke-width="38"/>
      </svg>
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
