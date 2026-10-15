export default {
  id: 'error-404',
  name: 'Error 404 Page',
  category: 'error-404',
  prefix: 'error_404_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A clear, friendly not-found section with customizable copy and a return-home action.',
  tags: ['404', 'error page', 'not found', 'navigation'],
  template: `{%- if entity.error_404_title.is_valid or entity.error_404_description.is_valid or entity.error_404_button_text.is_valid -%}
<section class="error-404 d-flex align-items-center bg-light py-5">
  <div class="container py-2">
    <div class="row align-items-center justify-content-between g-5">
      <div class="col-12 col-lg-7">
        <p class="small text-primary text-uppercase fw-bold mb-3">Error 404 · Page not found</p>
        {%- if entity.error_404_title.is_valid -%}
        <h1 class="display-4 fw-bold text-dark mb-3">{{ entity.error_404_title }}</h1>
        {%- endif -%}
        {%- if entity.error_404_description.is_valid -%}
        <p class="lead text-secondary mb-4">{{ entity.error_404_description }}</p>
        {%- endif -%}
        {%- if entity.error_404_button_text.is_valid and entity.error_404_button_link.is_valid -%}
        <a class="btn btn-primary px-4" href="{{ entity.error_404_button_link.value | escape }}">{{ entity.error_404_button_text }} <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a>
        {%- endif -%}
      </div>
      <div class="col-12 col-lg-4 text-center" aria-hidden="true">
        <div class="position-relative d-inline-flex align-items-center justify-content-center">
          <span class="display-1 fw-bold text-primary opacity-25">404</span>
          <i class="bi bi-signpost-split-fill position-absolute top-50 start-50 translate-middle display-5 text-primary"></i>
        </div>
        <p class="small text-secondary text-uppercase fw-semibold mt-3 mb-0">Looks like a wrong turn</p>
      </div>
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Error 404 Page',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'error_404_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. We can’t find that page.',
          DefaultValue: 'We can’t find that page.',
        },
        {
          Type: 'textarea',
          FieldID: 'error_404_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Let visitors know what they can do next.',
          DefaultValue: 'The link may be old or the page may have moved. Let’s get you back on track.',
        },
        {
          Type: 'text',
          FieldID: 'error_404_button_text',
          Label: 'Button Text',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Back to home',
          DefaultValue: 'Back to home',
        },
        {
          Type: 'url',
          FieldID: 'error_404_button_link',
          Label: 'Button Link',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: '/',
        },
      ],
    },
  ],
  notes: [
    'Use this section in the site’s Marketpath 404/not-found page template.',
    'The return button appears when both Button Text and Button Link are valid. Set Button Link to the site home page or another helpful destination.',
    'Bootstrap Icons CSS is needed for the directional sign icon and button arrow.',
  ],
  preview: {
    html: `<section class="error-404 d-flex align-items-center bg-light py-5">
  <div class="container py-2">
    <div class="row align-items-center justify-content-between g-5">
      <div class="col-12 col-lg-7"><p class="small text-primary text-uppercase fw-bold mb-3">Error 404 · Page not found</p><h1 class="display-4 fw-bold text-dark mb-3">We can’t find that page.</h1><p class="lead text-secondary mb-4">The link may be old or the page may have moved. Let’s get you back on track.</p><a class="btn btn-primary px-4" href="#">Back to home <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a></div>
      <div class="col-12 col-lg-4 text-center" aria-hidden="true"><div class="position-relative d-inline-flex align-items-center justify-content-center"><span class="display-1 fw-bold text-primary opacity-25">404</span><i class="bi bi-signpost-split-fill position-absolute top-50 start-50 translate-middle display-5 text-primary"></i></div><p class="small text-secondary text-uppercase fw-semibold mt-3 mb-0">Looks like a wrong turn</p></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'We can’t find that page.',
    description: 'The link may be old or the page may have moved. Let’s get you back on track.',
    button_text: 'Back to home',
    button_link: '/',
  },
};
