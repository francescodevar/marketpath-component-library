export default {
  id: 'banner-04',
  name: 'Banner Logo Carousel',
  category: 'banner',
  prefix: 'banner_04_',
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  description: 'A responsive logo carousel with customizable section backgrounds and optional autoplay.',
  tags: ['logos', 'carousel', 'swiper', 'trust'],
  template: `{%- if entity.banner_04_logos.is_valid -%}
{%- add_stylesheet "/marketpath/swiperjs/css/swiper.css" -%}
{%- add_javascript "/marketpath/swiperjs/js/swiper.js" position:'body' -%}

<section class="logo-carousel py-5
  {%- if entity.banner_04_background_type.is_valid -%}
    {%- case entity.banner_04_background_type.value -%}
      {%- when 'primary' -%} text-bg-primary
      {%- when 'secondary' -%} text-bg-secondary
      {%- when 'light' -%} text-bg-light
      {%- when 'dark' -%} text-bg-dark
      {%- when 'image' -%} logo-carousel--custom-image text-light
      {%- when 'color' -%} logo-carousel--custom-color
    {%- endcase -%}
  {%- endif -%}"
  {%- if entity.banner_04_background_type.is_valid and entity.banner_04_background_type.value == 'image' -%}
    {%- if entity.banner_04_background_image.is_valid -%}
      logo-carousel--image-{{ entity.banner_04_background_image.value | classname }} text-light
    {%- endif -%}
  {%- endif -%}
  {%- if entity.banner_04_background_type.is_valid and entity.banner_04_background_type.value == 'color' -%}
    {%- if entity.banner_04_background_color.is_valid and entity.banner_04_text_color.is_valid -%}
      logo-carousel--background-{{ entity.banner_04_background_color.value | classname }} logo-carousel--text-{{ entity.banner_04_text_color.value | classname }}
    {%- endif -%}
  {%- endif -%}">
  <div class="container py-2">
    {%- if entity.banner_04_title.is_valid -%}
    <h2 class="h3 text-center mb-3">{{ entity.banner_04_title }}</h2>
    {%- endif -%}
    {%- if entity.banner_04_description.is_valid -%}
    <div class="text-center mb-4">{{ entity.banner_04_description }}</div>
    {%- endif -%}
    <div class="logo-carousel__slider swiper px-5">
      <div class="swiper-wrapper align-items-center">
        {%- for item in entity.banner_04_logos -%}
        <div class="swiper-slide d-flex justify-content-center align-items-center px-3 py-2">
          {%- if item.logo_image.is_valid -%}
          <img src="{% image_url = item.logo_image | preset: "300x300-max webp" %}" class="logo-carousel__image img-fluid" alt="{{ item.logo_image.alt.value | escape }}" loading="lazy">
          {%- endif -%}
        </div>
        {%- endfor -%}
      </div>
      {%- if entity.banner_04_show_controls.on -%}
      <button class="swiper-button-prev" type="button" aria-label="Previous logos"></button>
      <button class="swiper-button-next" type="button" aria-label="Next logos"></button>
      {%- endif -%}
    </div>
  </div>
</section>

{%- add_javascript inline position:'body' defer:true -%}
document.querySelectorAll('.logo-carousel__slider').forEach((slider) => {
  new Swiper(slider, {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      {%- if entity.banner_04_slides_per_view.is_valid -%}
      768: { slidesPerView: {{ entity.banner_04_slides_per_view.value }}, spaceBetween: 20 }
      {%- else -%}
      768: { slidesPerView: 4, spaceBetween: 20 }
      {%- endif -%}
    },
    {%- if entity.banner_04_show_controls.on -%}
    navigation: {
      nextEl: slider.querySelector('.swiper-button-next'),
      prevEl: slider.querySelector('.swiper-button-prev')
    },
    {%- endif -%}
    {%- if entity.banner_04_autoplay.on and entity.banner_04_autoplay_interval.is_valid -%}
    autoplay: {
      delay: {{ entity.banner_04_autoplay_interval.value }},
      disableOnInteraction: false
    }
    {%- endif -%}
  });
});
{%- end_javascript -%}

{%- add_stylesheet inline -%}
.logo-carousel__image {
  width: auto;
  max-height: 90px;
  filter: grayscale(1);
}
.logo-carousel--custom-image {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  box-shadow: inset 0 0 0 50vw rgba(5, 5, 5, .72);
}
{%- if entity.banner_04_background_type.is_valid and entity.banner_04_background_type.value == 'image' -%}
  {%- if entity.banner_04_background_image.is_valid -%}
.logo-carousel--image-{{ entity.banner_04_background_image.value | classname }} {
  background-image: url('{% image_url = entity.banner_04_background_image | preset: "webp" %}');
}
  {%- endif -%}
{%- endif -%}
{%- if entity.banner_04_background_type.is_valid and entity.banner_04_background_type.value == 'color' -%}
  {%- if entity.banner_04_background_color.is_valid -%}
.logo-carousel--background-{{ entity.banner_04_background_color.value | classname }} {
  background-color: {{ entity.banner_04_background_color.value | escape }};
}
  {%- endif -%}
  {%- if entity.banner_04_text_color.is_valid -%}
.logo-carousel--text-{{ entity.banner_04_text_color.value | classname }} {
  color: {{ entity.banner_04_text_color.value | escape }};
}
  {%- endif -%}
{%- endif -%}
{%- end_stylesheet -%}
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Logo Carousel',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'banner_04_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'html',
          FieldID: 'banner_04_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'fieldset',
          FieldID: 'banner_04_logos',
          Label: 'Logos',
          Condition: null,
          IsRequired: true,
          RequiredMessage: 'Add at least one logo.',
          AllowMultiple: true,
          Fields: [
            {
              Type: 'image',
              FieldID: 'logo_image',
              Label: 'Logo Image',
              Condition: null,
              IsRequired: true,
              RequiredMessage: 'Choose a logo image.',
            },
          ],
        },
        {
          Type: 'select',
          FieldID: 'banner_04_background_type',
          Label: 'Background Style',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Options: 'none:None;primary:Solid Primary Color;secondary:Solid Secondary Color;light:Solid Light Color;dark:Solid Dark Color;image:Custom Image;color:Custom Color',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: 'none',
        },
        {
          Type: 'image',
          FieldID: 'banner_04_background_image',
          Label: 'Background Image',
          Condition: {
            FieldID: 'banner_04_background_type',
            Type: 'eq',
            Value: 'image',
          },
          IsRequired: true,
          RequiredMessage: 'Choose a background image.',
        },
        {
          Type: 'text',
          FieldID: 'banner_04_background_color',
          Label: 'Background Color (Hex)',
          Condition: {
            FieldID: 'banner_04_background_type',
            Type: 'eq',
            Value: 'color',
          },
          IsRequired: true,
          RequiredMessage: 'Enter a hex color such as #243447.',
          Validators: [{ Type: 'regex', Value: '^#[0-9A-Fa-f]{6}$' }],
          Placeholder: '#243447',
        },
        {
          Type: 'text',
          FieldID: 'banner_04_text_color',
          Label: 'Text Color (Hex)',
          Condition: {
            FieldID: 'banner_04_background_type',
            Type: 'eq',
            Value: 'color',
          },
          IsRequired: true,
          RequiredMessage: 'Enter a hex color such as #ffffff.',
          Validators: [{ Type: 'regex', Value: '^#[0-9A-Fa-f]{6}$' }],
          Placeholder: '#ffffff',
        },
        {
          Type: 'select',
          FieldID: 'banner_04_slides_per_view',
          Label: 'Slides in View',
          Condition: null,
          IsRequired: true,
          Validators: [],
          Options: '2:2;3:3;4:4',
          Delimiter: ';',
          ValueDelimiter: ':',
          DefaultValue: '4',
        },
        {
          Type: 'toggle',
          FieldID: 'banner_04_show_controls',
          Label: 'Show Navigation Controls',
          Condition: null,
          OnLabel: 'On',
          OnValue: 'On',
          OnColor: 'success',
          OffLabel: 'Off',
          OffValue: 'Off',
          OffColor: 'secondary',
          DefaultValue: false,
        },
        {
          Type: 'toggle',
          FieldID: 'banner_04_autoplay',
          Label: 'Autoplay',
          Condition: null,
          OnLabel: 'On',
          OnValue: 'On',
          OnColor: 'success',
          OffLabel: 'Off',
          OffValue: 'Off',
          OffColor: 'secondary',
          DefaultValue: true,
        },
        {
          Type: 'text',
          FieldID: 'banner_04_autoplay_interval',
          Label: 'Autoplay Interval (ms)',
          Condition: {
            FieldID: 'banner_04_autoplay',
            Type: 'eq',
            Value: 'On',
          },
          IsRequired: true,
          RequiredMessage: 'Enter an autoplay interval.',
          Validators: [{ Type: 'number' }, { Type: 'gte', Value: '500' }],
          DefaultValue: '3500',
        },
      ],
    },
  ],
  notes: [
    'Create the 300x300-max image preset in your Marketpath site. Upload one logo image per repeatable Logos item; logos render in grayscale.',
    'Solid backgrounds use Bootstrap classes. Custom Image uses the selected image with a dark overlay; Custom Color accepts six-digit hex values for both background and text.',
    'This component uses the site Swiper assets at /marketpath/swiperjs/css/swiper.css and /marketpath/swiperjs/js/swiper.js.',
    'Slides in View controls the desktop count. The carousel shows one logo on small screens and two on narrow tablets.',
    'Autoplay is enabled by default and can be turned off; navigation arrows are hidden by default and can be enabled.',
  ],
  preview: {
    html: `<section class="logo-carousel py-5 border-top border-bottom">
  <div class="container py-2">
    <h2 class="h3 text-center mb-3">Chosen by thoughtful teams</h2>
    <p class="text-center text-secondary mb-4">A few examples of the organizations we work with.</p>
    <div class="row g-4 align-items-center text-center">
      <div class="col-6 col-md-3"><span class="fw-bold fs-4 text-secondary">EXAMPLE</span></div>
      <div class="col-6 col-md-3"><span class="fw-semibold fs-4 text-secondary">Example Co.</span></div>
      <div class="col-6 col-md-3"><span class="fw-bold fs-4 text-secondary">EXAMPLE&nbsp;STUDIO</span></div>
      <div class="col-6 col-md-3"><span class="fw-semibold fs-4 text-secondary">Example Works</span></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Chosen by thoughtful teams',
    description: 'A few examples of the organizations we work with.',
    logos: [{ logo_image: '' }, { logo_image: '' }, { logo_image: '' }, { logo_image: '' }],
    background_type: 'none',
    background_image: '',
    background_color: '#243447',
    text_color: '#ffffff',
    slides_per_view: '4',
    show_controls: false,
    autoplay: true,
    autoplay_interval: '3500',
  },
};
