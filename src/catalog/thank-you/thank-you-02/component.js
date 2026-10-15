import { thankYouFields } from '../shared-fields.js';

export default {
  id: 'thank-you-02',
  name: 'Thank You Next Steps',
  category: 'thank-you',
  prefix: 'thank_you_',
  sharedFieldsId: 'thank_you',
  sharedFieldIds: ['thank_you_eyebrow', 'thank_you_title', 'thank_you_description', 'thank_you_button_text', 'thank_you_button_link'],
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A split confirmation layout that pairs a success message with a short overview of what happens next.',
  tags: ['thank you', 'confirmation', 'next steps', 'split layout'],
  template: `{%- if entity.thank_you_eyebrow.is_valid or entity.thank_you_title.is_valid or entity.thank_you_description.is_valid or entity.thank_you_button_text.is_valid or entity.thank_you_completion_eyebrow.is_valid or entity.thank_you_completion_title.is_valid or entity.thank_you_completion_description.is_valid or entity.thank_you_next_steps_title.is_valid or entity.thank_you_next_step_1.is_valid or entity.thank_you_next_step_2.is_valid or entity.thank_you_next_step_3.is_valid -%}
<section class="thank-you-02 bg-white py-5">
  <div class="container py-2">
    <div class="row g-0 border rounded-4 overflow-hidden shadow-sm">
      <div class="col-12 col-lg-5 bg-primary text-white p-4 p-lg-5 d-flex flex-column justify-content-between">
        <div>
          <div class="thank-you-02-icon d-inline-flex align-items-center justify-content-center border border-white border-opacity-25 rounded-circle flex-shrink-0 mb-4">
            <i class="bi bi-envelope-check fs-2" aria-hidden="true"></i>
          </div>
          {%- if entity.thank_you_completion_eyebrow.is_valid -%}
          <p class="small text-white-50 fw-bold text-uppercase mb-2">{{ entity.thank_you_completion_eyebrow }}</p>
          {%- endif -%}
          {%- if entity.thank_you_completion_title.is_valid -%}
          <h2 class="h3 fw-bold mb-0">{{ entity.thank_you_completion_title }}</h2>
          {%- endif -%}
        </div>
        {%- if entity.thank_you_completion_description.is_valid -%}
        <p class="small text-white-50 mt-5 mb-0">{{ entity.thank_you_completion_description }}</p>
        {%- endif -%}
      </div>

      <div class="col-12 col-lg-7 p-4 p-lg-5">
        {%- if entity.thank_you_eyebrow.is_valid -%}
        <p class="small text-primary fw-bold text-uppercase mb-3">{{ entity.thank_you_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.thank_you_title.is_valid -%}
        <h1 class="display-6 fw-bold text-dark mb-3">{{ entity.thank_you_title }}</h1>
        {%- endif -%}
        {%- if entity.thank_you_description.is_valid -%}
        <p class="lead text-secondary mb-4">{{ entity.thank_you_description }}</p>
        {%- endif -%}

        {%- if entity.thank_you_next_steps_title.is_valid or entity.thank_you_next_step_1.is_valid or entity.thank_you_next_step_2.is_valid or entity.thank_you_next_step_3.is_valid -%}
        <div class="border-top pt-4 mt-4">
          {%- if entity.thank_you_next_steps_title.is_valid -%}
          <h2 class="h6 fw-bold text-dark mb-3">{{ entity.thank_you_next_steps_title }}</h2>
          {%- endif -%}
          <ol class="list-unstyled d-grid gap-3 mb-4">
            {%- if entity.thank_you_next_step_1.is_valid -%}<li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">1</span><span class="text-secondary">{{ entity.thank_you_next_step_1 }}</span></li>{%- endif -%}
            {%- if entity.thank_you_next_step_2.is_valid -%}<li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">2</span><span class="text-secondary">{{ entity.thank_you_next_step_2 }}</span></li>{%- endif -%}
            {%- if entity.thank_you_next_step_3.is_valid -%}<li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">3</span><span class="text-secondary">{{ entity.thank_you_next_step_3 }}</span></li>{%- endif -%}
          </ol>
        </div>
        {%- endif -%}
        {%- if entity.thank_you_button_text.is_valid and entity.thank_you_button_link.is_valid -%}
        <a class="btn btn-outline-primary mt-4" href="{{ entity.thank_you_button_link.value | escape }}">{{ entity.thank_you_button_text }} <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.thank-you-02-icon {
  width: 5rem;
  height: 5rem;
  flex: 0 0 5rem;
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: [
    ...thankYouFields,
    {
      Type: 'group',
      Label: 'Next Steps Copy',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'thank_you_completion_eyebrow',
          Label: 'Confirmation Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Submission complete',
          DefaultValue: 'Submission complete',
        },
        {
          Type: 'text',
          FieldID: 'thank_you_completion_title',
          Label: 'Confirmation Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Your message is in good hands.',
          DefaultValue: 'Your message is in good hands.',
        },
        {
          Type: 'textarea',
          FieldID: 'thank_you_completion_description',
          Label: 'Confirmation Description',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'A short closing message for the confirmation panel.',
          DefaultValue: 'Thank you for taking the time to get in touch.',
        },
        {
          Type: 'text',
          FieldID: 'thank_you_next_steps_title',
          Label: 'Next Steps Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. What happens next',
          DefaultValue: 'What happens next',
        },
        {
          Type: 'text',
          FieldID: 'thank_you_next_step_1',
          Label: 'Next Step 1',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'First follow-up step',
          DefaultValue: 'Our team reviews the details you shared.',
        },
        {
          Type: 'text',
          FieldID: 'thank_you_next_step_2',
          Label: 'Next Step 2',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Second follow-up step',
          DefaultValue: 'We’ll follow up using the contact information you provided.',
        },
        {
          Type: 'text',
          FieldID: 'thank_you_next_step_3',
          Label: 'Next Step 3',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'Final follow-up step',
          DefaultValue: 'Together, we’ll work out a helpful next step.',
        },
      ],
    },
  ],
  notes: [
    'Use this component as the content of the Marketpath page configured as the form Redirect URL, such as /thank-you.',
    'The eyebrow, title, description, and return button share the Page Fields from Thank You Centered. The confirmation panel and all three next-step messages have editable Fields in the Next Steps Copy group.',
    'Set Button Link to a page path or URL. The button only appears when both its text and link are valid.',
    'Bootstrap Icons CSS is needed for the confirmation icon and button arrow.',
  ],
  preview: {
    html: `<section class="thank-you-02 bg-white py-5">
  <style>.thank-you-02-icon{width:5rem;height:5rem;flex:0 0 5rem}</style>
  <div class="container py-2">
    <div class="row g-0 border rounded-4 overflow-hidden shadow-sm">
      <div class="col-12 col-lg-5 bg-primary text-white p-4 p-lg-5 d-flex flex-column justify-content-between"><div><div class="thank-you-02-icon d-inline-flex align-items-center justify-content-center border border-white border-opacity-25 rounded-circle flex-shrink-0 mb-4"><i class="bi bi-envelope-check fs-2" aria-hidden="true"></i></div><p class="small text-white-50 fw-bold text-uppercase mb-2">Submission complete</p><h2 class="h3 fw-bold mb-0">Your message is in good hands.</h2></div><p class="small text-white-50 mt-5 mb-0">Thank you for taking the time to get in touch.</p></div>
      <div class="col-12 col-lg-7 p-4 p-lg-5"><p class="small text-primary fw-bold text-uppercase mb-3">MESSAGE RECEIVED</p><h1 class="display-6 fw-bold text-dark mb-3">Thanks for reaching out.</h1><p class="lead text-secondary mb-4">Your message has been sent. A member of our team will follow up soon.</p><div class="border-top pt-4 mt-4"><h2 class="h6 fw-bold text-dark mb-3">What happens next</h2><ol class="list-unstyled d-grid gap-3 mb-4"><li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">1</span><span class="text-secondary">Our team reviews the details you shared.</span></li><li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">2</span><span class="text-secondary">We’ll follow up using the contact information you provided.</span></li><li class="d-flex align-items-start gap-3"><span class="badge rounded-pill text-bg-light text-primary">3</span><span class="text-secondary">Together, we’ll work out a helpful next step.</span></li></ol><a class="btn btn-outline-primary" href="#">Back to home <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a></div></div>
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
    completion_eyebrow: 'Submission complete',
    completion_title: 'Your message is in good hands.',
    completion_description: 'Thank you for taking the time to get in touch.',
    next_steps_title: 'What happens next',
    next_step_1: 'Our team reviews the details you shared.',
    next_step_2: 'We’ll follow up using the contact information you provided.',
    next_step_3: 'Together, we’ll work out a helpful next step.',
  },
};
