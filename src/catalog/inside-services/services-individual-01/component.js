export default {
  id: 'services-individual-01',
  name: 'Service Detail Page',
  category: 'inside-services',
  prefix: 'services_individual_01_',
  entityDatastoreId: 'services',
  datastoreIds: ['services', 'faqs'],
  customCss: false,
  customJs: false,
  bootstrapJs: true,
  description: 'A service detail page with a services sidebar, working hours, rich content, and FAQ accordion.',
  tags: ['generic page', 'service detail', 'sidebar', 'working hours', 'faq'],
  template: `<section class="py-5">
  <div class="container py-2">
    <div class="row g-5">
      <aside class="col-12 col-lg-3">
        {%- if entity.services_individual_01_links.is_valid -%}
        <div class="d-grid gap-2 mb-4">
          {%- for service in entity.services_individual_01_links -%}
          <a href="{{ service.full_url | escape }}" class="btn btn-outline-primary text-center">{{ service.title }}</a>
          {%- endfor -%}
        </div>
        {%- endif -%}

        {%- if entity.services_individual_01_hours_title.is_valid -%}
        <h2 class="h5 text-uppercase mb-3">{{ entity.services_individual_01_hours_title }}</h2>
        {%- endif -%}
        {%- if entity.services_individual_01_hours_description.is_valid -%}
        <p class="small text-body-secondary">{{ entity.services_individual_01_hours_description }}</p>
        {%- endif -%}
        {%- if entity.services_individual_01_hours_html.is_valid -%}
        <div class="small">{{ entity.services_individual_01_hours_html }}</div>
        {%- endif -%}
      </aside>

      <div class="col-12 col-lg-9">
        {%- if entity.services_image.is_valid -%}
        <div class="ratio ratio-16x9 mb-4 overflow-hidden">
          {%- img entity.services_image preset:"1200x675-crop webp" class:"w-100 h-100 object-fit-cover" alt:"" link:false loading:"eager" -%}
        </div>
        {%- endif -%}

        {%- if entity.services_summary.is_valid -%}
        <div class="lead mb-4">{{ entity.services_summary }}</div>
        {%- endif -%}
        {%- if entity.services_content.is_valid -%}
        <div class="mb-5">{{ entity.services_content }}</div>
        {%- endif -%}

        {%- if entity.services_individual_01_faqs.is_valid -%}
        <section class="pt-4" aria-labelledby="servicesIndividualFaqTitle">
          {%- if entity.services_individual_01_faq_title.is_valid -%}
          <h2 id="servicesIndividualFaqTitle" class="display-6 text-center mb-3">{{ entity.services_individual_01_faq_title }}</h2>
          {%- endif -%}
          {%- if entity.services_individual_01_faq_description.is_valid -%}
          <p class="text-center text-body-secondary mb-5">{{ entity.services_individual_01_faq_description }}</p>
          {%- endif -%}
          <div class="accordion accordion-flush" id="servicesIndividualFaqs">
            {%- for faq in entity.services_individual_01_faqs -%}
            {%- if faq.faq_answer.is_valid -%}
            <div class="accordion-item">
              <h3 class="accordion-header" id="servicesIndividualFaqHeading{{ forloop.index }}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#servicesIndividualFaqAnswer{{ forloop.index }}" aria-expanded="false" aria-controls="servicesIndividualFaqAnswer{{ forloop.index }}">{{ faq.title }}</button>
              </h3>
              <div id="servicesIndividualFaqAnswer{{ forloop.index }}" class="accordion-collapse collapse" aria-labelledby="servicesIndividualFaqHeading{{ forloop.index }}" data-bs-parent="#servicesIndividualFaqs">
                <div class="accordion-body">{{ faq.faq_answer }}</div>
              </div>
            </div>
            {%- endif -%}
            {%- endfor -%}
          </div>
        </section>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>`,
  fields: [
    {
      Type: 'group',
      Label: 'Service Page Details',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'datastoreitemlist',
          FieldID: 'services_individual_01_links',
          Label: 'Services sidebar links',
          Subtext: 'Choose services from the shared Services datastore.',
          Condition: null,
          IsRequired: false,
          Validators: [],
          DatastoreGUID: 'WRITE HERE YOUR SERVICES GUID',
        },
        {
          Type: 'text',
          FieldID: 'services_individual_01_hours_title',
          Label: 'Working hours title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          DefaultValue: 'Working Hours',
        },
        {
          Type: 'textarea',
          FieldID: 'services_individual_01_hours_description',
          Label: 'Working hours description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'html',
          FieldID: 'services_individual_01_hours_html',
          Label: 'Working hours content',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'services_individual_01_faq_title',
          Label: 'FAQ title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          DefaultValue: 'Frequently Asked Questions',
        },
        {
          Type: 'textarea',
          FieldID: 'services_individual_01_faq_description',
          Label: 'FAQ description',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'datastoreitemlist',
          FieldID: 'services_individual_01_faqs',
          Label: 'FAQs',
          Subtext: 'Choose questions from the shared FAQs datastore.',
          Condition: null,
          IsRequired: false,
          Validators: [],
          DatastoreGUID: 'WRITE HERE YOUR FAQ GUID',
        },
      ],
    },
  ],
  notes: [
    'This generic page template renders a Services datastore item as the current entity; services_image, services_summary, and services_content come from that datastore item, not from duplicate Page Fields.',
    'Page Fields select sidebar links from Services and FAQ records from the FAQs datastore. Replace both DatastoreGUID placeholders with the matching GUIDs from View Datastore.',
    'The FAQ datastore item title is the question and faq_answer is rich HTML rendered as authored. The Bootstrap accordion requires the Bootstrap bundle once on the page.',
    'Create the 1200x675-crop webp preset in Marketpath if the service image is used.',
    'The sidebar links, working hours, service content, and FAQ list are optional and render only when their fields or datastore values are valid.',
  ],
  preview: {
    html: `<section class="py-5">
  <div class="container py-2">
    <div class="row g-5">
      <aside class="col-12 col-lg-3">
        <div class="d-grid gap-2 mb-4"><a href="#" class="btn btn-outline-primary text-center">Window Installation</a><a href="#" class="btn btn-outline-primary text-center">Decks and Outdoor Living</a><a href="#" class="btn btn-outline-primary text-center">Wood Restoration</a></div>
        <h2 class="h5 text-uppercase mb-3">Working Hours</h2>
        <p class="small text-body-secondary">Our team is available during regular business hours.</p>
        <div class="small"><ul class="mb-0"><li>Monday–Friday: 8:00 a.m.–5:00 p.m.</li><li>Saturday: By appointment</li><li>Sunday: Closed</li></ul></div>
      </aside>
      <div class="col-12 col-lg-9">
        <div class="ratio ratio-16x9 mb-4 overflow-hidden"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23cbd4d8'/%3E%3Cpath d='M0 520 250 220l220 230 230-330 250 310 250-170v415H0z' fill='%237f9398'/%3E%3C/svg%3E" class="w-100 h-100 object-fit-cover" alt="Example service project"></div>
        <div class="lead mb-4"><p>A clear overview of the service and what to expect.</p></div>
        <div class="mb-5"><h2>Service Overview</h2><p>Thoughtful planning, skilled work, and careful attention to the details help make each project straightforward.</p><h2>Our Process</h2><p>We review your goals, explain the options, and keep you informed as the work moves forward.</p></div>
        <section class="pt-4" aria-labelledby="servicesIndividualFaqTitlePreview">
          <h2 id="servicesIndividualFaqTitlePreview" class="display-6 text-center mb-3">Frequently Asked Questions</h2>
          <p class="text-center text-body-secondary mb-5">Helpful answers about planning and completing your project.</p>
          <div class="accordion accordion-flush" id="servicesIndividualFaqsPreview">
            <div class="accordion-item"><h3 class="accordion-header" id="servicesIndividualFaqPreviewHeading1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#servicesIndividualFaqPreviewAnswer1" aria-expanded="false" aria-controls="servicesIndividualFaqPreviewAnswer1">How do I get started?</button></h3><div id="servicesIndividualFaqPreviewAnswer1" class="accordion-collapse collapse" aria-labelledby="servicesIndividualFaqPreviewHeading1" data-bs-parent="#servicesIndividualFaqsPreview"><div class="accordion-body">Contact us to discuss your project, goals, and next steps.</div></div></div>
            <div class="accordion-item"><h3 class="accordion-header" id="servicesIndividualFaqPreviewHeading2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#servicesIndividualFaqPreviewAnswer2" aria-expanded="false" aria-controls="servicesIndividualFaqPreviewAnswer2">Can I choose the project details?</button></h3><div id="servicesIndividualFaqPreviewAnswer2" class="accordion-collapse collapse" aria-labelledby="servicesIndividualFaqPreviewHeading2" data-bs-parent="#servicesIndividualFaqsPreview"><div class="accordion-body">We will review the available options with you during planning.</div></div></div>
          </div>
        </section>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    links: [],
    hours_title: 'Working Hours',
    hours_description: 'Our team is available during regular business hours.',
    hours_html: '<ul><li>Monday–Friday: 8:00 a.m.–5:00 p.m.</li><li>Saturday: By appointment</li><li>Sunday: Closed</li></ul>',
    faq_title: 'Frequently Asked Questions',
    faq_description: 'Helpful answers about planning and completing your project.',
    faqs: [],
  },
};
