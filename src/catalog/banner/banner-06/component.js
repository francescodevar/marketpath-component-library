export default {
  id: 'banner-06',
  name: 'Full-Width Image Title Banner',
  category: 'banner',
  prefix: 'banner_06_',
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A full-bleed background image banner with a dark overlay, centered title, description, and selectable height.',
  tags: ['banner', 'full-width', 'background image', 'overlay', 'responsive'],
  template: `{%- if entity.banner_06_title.is_valid or entity.banner_06_description.is_valid or entity.banner_06_background_image.is_valid -%}
<section class="banner-06 position-relative {% if entity.banner_06_height.is_valid %}banner-06--{{ entity.banner_06_height.value | classname }}{% else %}banner-06--standard{% endif %}">
  <div class="banner-06-frame position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center text-center">
    {%- if entity.banner_06_background_image.is_valid -%}
    {%- img entity.banner_06_background_image preset:"1920x600-crop webp" class:"position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt:"" link:false loading:"eager" -%}
    {%- endif -%}
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" aria-hidden="true"></div>
    <div class="container position-relative py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          {%- if entity.banner_06_title.is_valid -%}
          <h1 class="display-5 fw-semibold text-white mb-3">{{ entity.banner_06_title }}</h1>
          {%- endif -%}
          {%- if entity.banner_06_description.is_valid -%}
          <p class="lead text-white mb-0">{{ entity.banner_06_description }}</p>
          {%- endif -%}
        </div>
      </div>
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.banner-06-frame {
  height: 42vh;
  min-height: 20rem;
  max-height: 32rem;
}

.banner-06--slim .banner-06-frame {
  height: 30vh;
  min-height: 14rem;
  max-height: 18rem;
}

.banner-06--large .banner-06-frame {
  height: 62vh;
  min-height: 28rem;
  max-height: 42rem;
}

@media (max-width: 767.98px) {
  .banner-06-frame {
    height: 42vh;
    min-height: 18rem;
    max-height: 28rem;
  }

  .banner-06--slim .banner-06-frame {
    height: 32vh;
    min-height: 14rem;
    max-height: 18rem;
  }

  .banner-06--large .banner-06-frame {
    height: 54vh;
    min-height: 23rem;
    max-height: 34rem;
  }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Full-Width Image Banner',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'banner_06_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. A home that feels just right.',
        },
        {
          Type: 'textarea',
          FieldID: 'banner_06_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Add a short line to support the title.',
        },
        {
          Type: 'image',
          FieldID: 'banner_06_background_image',
          Label: 'Background Image',
          Subtext: 'Recommended preset: 1920x600-crop. A dark overlay is added automatically.',
          Condition: null,
          IsRequired: false,
        },
        {
          Type: 'select',
          FieldID: 'banner_06_height',
          Label: 'Banner Height',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'slim:Slim;standard:Standard;large:Large',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'standard',
        },
      ],
    },
  ],
  notes: [
    'This banner is full width; only its text content is constrained to the Bootstrap .container.',
    'Choose Slim, Standard, or Large to set the responsive height. Each size has a max-height to keep the banner from growing too tall.',
    'Create the 1920x600-crop image preset in Marketpath. The image is decorative and receives a dark overlay for contrast.',
  ],
  preview: {
    html: `<section class="banner-06 position-relative banner-06--standard">
  <style>
    .banner-06-frame { height:42vh; min-height:20rem; max-height:32rem; }
    @media(max-width:767.98px){.banner-06-frame{height:42vh;min-height:18rem;max-height:28rem}}
  </style>
  <div class="banner-06-frame position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center text-center">
    <svg class="position-absolute top-0 start-0 w-100 h-100" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="1920" height="600" fill="#829a9d"/><path d="M0 380 410 90h620l330 290v220H0z" fill="#887d68"/><path d="M410 90h620l-310-75z" fill="#364550"/><path d="M1030 200 1370 60l550 140v400h-890z" fill="#c3b89f"/><path d="M1030 200 1370 60l550 140" fill="none" stroke="#3a464c" stroke-width="38"/><path d="M90 250h220v220H90zm360-60h160v190H450zm210 0h160v190H660zm420 110h140v190h-140zm190 0h140v190h-140zm190 0h140v190h-140z" fill="#b9d0d2" stroke="#eee8d8" stroke-width="16"/><path d="M200 250v220m-110-110h220m440-250v190m-80-95h160m-290-95v190m-80-95h160m540 270v190m-70-95h140m120-95v190m-70-95h140" stroke="#eee8d8" stroke-width="10"/><path d="M0 515h1920v85H0z" fill="#6f634d"/><path d="M0 545h1920M0 580h1920" stroke="#a98a65" stroke-width="10"/><path d="M0 460q130-190 300-80v135H0m1420-45q170-150 320-15v145h-320" fill="#486447"/><path d="M545 600V425q95-85 190 0v175" fill="#293940"/><path d="M545 425q95-85 190 0" fill="none" stroke="#e6dfce" stroke-width="18"/>
    </svg>
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" aria-hidden="true"></div>
    <div class="container position-relative py-5"><div class="row justify-content-center"><div class="col-12 col-lg-10"><h1 class="display-5 fw-semibold text-white mb-3">A home that feels just right.</h1><p class="lead text-white mb-0">Thoughtful work. Clear communication. A better home.</p></div></div></div>
  </div>
</section>`,
  },
  mockData: {
    title: 'A home that feels just right.',
    description: 'Thoughtful work. Clear communication. A better home.',
    background_image: '',
    height: 'standard',
  },
};
