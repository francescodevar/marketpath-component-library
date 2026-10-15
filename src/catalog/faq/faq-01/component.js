import { faqFields, faqSharedFieldIds } from '../shared-fields.js';

export default {
  id: 'faq-01',
  name: 'FAQ Accordion',
  category: 'faq',
  prefix: 'faq_',
  sharedFieldsId: 'faq',
  sharedFieldIds: faqSharedFieldIds,
  datastoreId: 'faqs',
  customCss: false,
  customJs: false,
  bootstrapJs: true,
  description: 'A straightforward Bootstrap accordion populated from the shared FAQs datastore.',
  tags: ['faq', 'accordion', 'datastore'],
  template: `{%- if entity.faqs.is_valid -%}
<section class="py-5 bg-white">
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-9">
        {%- if entity.faq_title.is_valid -%}
        <h2 class="display-6 fw-bold">{{ entity.faq_title }}</h2>
        {%- endif -%}
        {%- if entity.faq_description.is_valid -%}
        <p class="lead text-body-secondary">{{ entity.faq_description }}</p>
        {%- endif -%}
        <div class="accordion mt-4" id="faq_01_accordion">
          {%- for faq in entity.faqs -%}
          {%- if faq.faq_answer.is_valid -%}
          <div class="accordion-item">
            <h3 class="accordion-header" id="faq_01_heading_{{ forloop.index }}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_01_answer_{{ forloop.index }}" aria-expanded="false" aria-controls="faq_01_answer_{{ forloop.index }}">{{ faq.title }}</button>
            </h3>
            <div id="faq_01_answer_{{ forloop.index }}" class="accordion-collapse collapse" aria-labelledby="faq_01_heading_{{ forloop.index }}" data-bs-parent="#faq_01_accordion">
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
  fields: faqFields,
  notes: [
    'Uses the shared FAQs datastore. Replace the DatastoreGUID placeholder in Fields with the FAQ datastore GUID.',
    'The datastore item title is the question and faq_answer is rich HTML rendered as authored.',
    'Requires Bootstrap 5.3 CSS and the Bootstrap bundle for the accordion. No custom CSS or JavaScript is required.',
    'Use this accordion once per page unless you rename its IDs.',
  ],
  preview: {
    html: `<section class="py-5 bg-white">
  <div class="container py-2">
    <div class="row justify-content-center"><div class="col-12 col-lg-9">
      <h2 class="display-6 fw-bold">Frequently Asked Questions</h2>
      <p class="lead text-body-secondary">Helpful answers to common questions.</p>
      <div class="accordion mt-4" id="faq_01_preview_accordion">
        <div class="accordion-item"><h3 class="accordion-header" id="faq_01_preview_heading_1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_01_preview_answer_1" aria-expanded="false" aria-controls="faq_01_preview_answer_1">How do I get started?</button></h3><div id="faq_01_preview_answer_1" class="accordion-collapse collapse" aria-labelledby="faq_01_preview_heading_1" data-bs-parent="#faq_01_preview_accordion"><div class="accordion-body"><p>Contact us to discuss your project, goals, and next steps.</p></div></div></div>
        <div class="accordion-item"><h3 class="accordion-header" id="faq_01_preview_heading_2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_01_preview_answer_2" aria-expanded="false" aria-controls="faq_01_preview_answer_2">Can I choose the project details?</button></h3><div id="faq_01_preview_answer_2" class="accordion-collapse collapse" aria-labelledby="faq_01_preview_heading_2" data-bs-parent="#faq_01_preview_accordion"><div class="accordion-body"><p>We will review the available options with you during planning.</p></div></div></div>
        <div class="accordion-item"><h3 class="accordion-header" id="faq_01_preview_heading_3"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq_01_preview_answer_3" aria-expanded="false" aria-controls="faq_01_preview_answer_3">When will I receive an estimate?</button></h3><div id="faq_01_preview_answer_3" class="accordion-collapse collapse" aria-labelledby="faq_01_preview_heading_3" data-bs-parent="#faq_01_preview_accordion"><div class="accordion-body"><p>After learning about your goals, we will prepare a clear project estimate.</p></div></div></div>
      </div>
    </div></div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Frequently Asked Questions',
    description: 'Helpful answers to common questions.',
    faqs: [],
  },
};
