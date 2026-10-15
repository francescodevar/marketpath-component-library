import { faqFields, faqSharedFieldIds } from '../shared-fields.js';

export default {
  id: 'faq-02',
  name: 'FAQ Main',
  category: 'faq',
  prefix: 'faq_',
  sharedFieldsId: 'faq',
  sharedFieldIds: faqSharedFieldIds,
  datastoreId: 'faqs',
  customCss: false,
  customJs: false,
  bootstrapJs: true,
  description: 'A main FAQ section with eyebrow, title, description, and datastore-powered accordion questions.',
  tags: ['faq', 'main section', 'accordion', 'datastore'],
  template: `{%- if entity.faqs.is_valid -%}
<section class="py-5">
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-9 text-center">
        {%- if entity.faq_eyebrow.is_valid -%}
        <p class="small text-uppercase fw-semibold text-primary mb-2">{{ entity.faq_eyebrow }}</p>
        {%- endif -%}
        {%- if entity.faq_title.is_valid -%}
        <h2 class="display-5 fw-bold mb-0">{{ entity.faq_title }}</h2>
        {%- endif -%}
        {%- if entity.faq_description.is_valid -%}
        <p class="lead text-body-secondary mt-3 mb-0">{{ entity.faq_description }}</p>
        {%- endif -%}
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-12 col-lg-9">
        <div class="accordion accordion-flush" id="faq_02_accordion">
          {%- for faq in entity.faqs -%}
          {%- if faq.faq_answer.is_valid -%}
          <div class="accordion-item">
            <h3 class="accordion-header" id="faq_02_heading_{{ forloop.index }}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_02_answer_{{ forloop.index }}" aria-expanded="false" aria-controls="faq_02_answer_{{ forloop.index }}">{{ faq.title }}</button>
            </h3>
            <div id="faq_02_answer_{{ forloop.index }}" class="accordion-collapse collapse" aria-labelledby="faq_02_heading_{{ forloop.index }}" data-bs-parent="#faq_02_accordion">
              <div class="accordion-body">{{ faq.faq_answer }}</div>
            </div>
          </div>
          {%- endif -%}
          {%- endfor -%}
        </div>
      </div>
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'FAQ Main',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'faq_eyebrow',
          Label: 'Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Need to know',
        },
        ...faqFields[0].Fields,
      ],
    },
  ],
  notes: [
    'Shares the title, description, FAQ list, and FAQs datastore with FAQ 01; the main layout adds only its optional eyebrow.',
    'The datastore item title is the question and faq_answer is rich HTML rendered as authored.',
    'Load Bootstrap 5.3 CSS and the Bootstrap bundle for accordion interaction. No custom CSS or JavaScript is required.',
    'Use this component once per page unless you rename its accordion and collapse IDs.',
  ],
  preview: {
    html: `<section class="py-5">
  <div class="container py-2">
    <div class="row justify-content-center"><div class="col-12 col-lg-9 text-center">
      <p class="small text-uppercase fw-semibold text-primary mb-2">Need to know</p>
      <h2 class="display-5 fw-bold mb-0">Frequently Asked Questions</h2>
      <p class="lead text-body-secondary mt-3 mb-0">Helpful answers to common questions.</p>
    </div></div>
    <div class="row justify-content-center mt-4"><div class="col-12 col-lg-9">
      <div class="accordion accordion-flush" id="faq_02_preview_accordion">
        <div class="accordion-item"><h3 class="accordion-header" id="faq_02_preview_heading_1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_02_preview_answer_1" aria-expanded="false" aria-controls="faq_02_preview_answer_1">How do I get started?</button></h3><div id="faq_02_preview_answer_1" class="accordion-collapse collapse" aria-labelledby="faq_02_preview_heading_1" data-bs-parent="#faq_02_preview_accordion"><div class="accordion-body"><p>Contact us to discuss your project, goals, and next steps.</p></div></div></div>
        <div class="accordion-item"><h3 class="accordion-header" id="faq_02_preview_heading_2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_02_preview_answer_2" aria-expanded="false" aria-controls="faq_02_preview_answer_2">Can I choose the project details?</button></h3><div id="faq_02_preview_answer_2" class="accordion-collapse collapse" aria-labelledby="faq_02_preview_heading_2" data-bs-parent="#faq_02_preview_accordion"><div class="accordion-body"><p>We will review the available options with you during planning.</p></div></div></div>
        <div class="accordion-item"><h3 class="accordion-header" id="faq_02_preview_heading_3"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_02_preview_answer_3" aria-expanded="false" aria-controls="faq_02_preview_answer_3">When will I receive an estimate?</button></h3><div id="faq_02_preview_answer_3" class="accordion-collapse collapse" aria-labelledby="faq_02_preview_heading_3" data-bs-parent="#faq_02_preview_accordion"><div class="accordion-body"><p>After learning about your goals, we will prepare a clear project estimate.</p></div></div></div>
      </div>
    </div></div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'Need to know',
    title: 'Frequently Asked Questions',
    description: 'Helpful answers to common questions.',
    faqs: [],
  },
};
