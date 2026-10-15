import { thankYouFields } from '../shared-fields.js';

export default {
  id: 'thank-you-01',
  name: 'Thank You Centered',
  category: 'thank-you',
  prefix: 'thank_you_',
  sharedFieldsId: 'thank_you',
  sharedFieldIds: ['thank_you_eyebrow', 'thank_you_title', 'thank_you_description', 'thank_you_button_text', 'thank_you_button_link'],
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A calm, centered confirmation with a clear return link after a form submission.',
  tags: ['thank you', 'confirmation', 'form success', 'centered'],
  template: `{%- if entity.thank_you_eyebrow.is_valid or entity.thank_you_title.is_valid or entity.thank_you_description.is_valid or entity.thank_you_button_text.is_valid -%}
<section class="thank-you-01 d-flex align-items-center bg-light py-5">
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7">
        <div class="thank-you-01-card bg-white border rounded-4 shadow-sm text-center p-4 p-md-5">
          <div class="thank-you-01-icon d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle flex-shrink-0 mb-4">
            <i class="bi bi-check-lg fs-2" aria-hidden="true"></i>
          </div>
          {%- if entity.thank_you_eyebrow.is_valid -%}
          <p class="small text-success fw-bold text-uppercase mb-3">{{ entity.thank_you_eyebrow }}</p>
          {%- endif -%}
          {%- if entity.thank_you_title.is_valid -%}
          <h1 class="display-6 fw-bold text-dark mb-3">{{ entity.thank_you_title }}</h1>
          {%- endif -%}
          {%- if entity.thank_you_description.is_valid -%}
          <p class="lead text-secondary mb-4">{{ entity.thank_you_description }}</p>
          {%- endif -%}
          {%- if entity.thank_you_button_text.is_valid and entity.thank_you_button_link.is_valid -%}
          <a class="btn btn-primary px-4" href="{{ entity.thank_you_button_link.value | escape }}">{{ entity.thank_you_button_text }} <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a>
          {%- endif -%}
        </div>
      </div>
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.thank-you-01-icon {
  width: 4.5rem;
  height: 4.5rem;
  flex: 0 0 4.5rem;
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: thankYouFields,
  notes: [
    'Use this component as the content of the Marketpath page configured as the form Redirect URL, such as /thank-you.',
    'The Page Fields let you customize the confirmation message and optional return button.',
    'Set Button Link to a page path or URL. The button only appears when both its text and link are valid.',
    'Bootstrap Icons CSS is needed for the success mark and button arrow.',
  ],
  preview: {
    html: `<section class="thank-you-01 d-flex align-items-center bg-light py-5">
  <style>.thank-you-01-icon{width:4.5rem;height:4.5rem;flex:0 0 4.5rem}</style>
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7">
        <div class="thank-you-01-card bg-white border rounded-4 shadow-sm text-center p-4 p-md-5">
          <div class="thank-you-01-icon d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle flex-shrink-0 mb-4"><i class="bi bi-check-lg fs-2" aria-hidden="true"></i></div>
          <p class="small text-success fw-bold text-uppercase mb-3">MESSAGE RECEIVED</p>
          <h1 class="display-6 fw-bold text-dark mb-3">Thanks for reaching out.</h1>
          <p class="lead text-secondary mb-4">Your message has been sent. A member of our team will follow up soon.</p>
          <a class="btn btn-primary px-4" href="#">Back to home <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'MESSAGE RECEIVED',
    title: 'Thanks for reaching out.',
    description: 'Your message has been sent. A member of our team will follow up soon.',
    button_text: 'Back to home',
    button_link: '/',
  },
};
