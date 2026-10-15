import { contactFields } from '../shared-fields.js';

export default {
  id: 'contact-02',
  name: 'Contact Map & Form',
  category: 'contact',
  prefix: 'contact_01_',
  sharedFieldsId: 'contact_01',
  sharedFieldIds: ['contact_01_title', 'contact_01_description', 'contact_01_form', 'contact_01_google_maps_embed_url'],
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  description: 'A map-led contact page with the project introduction and Page Settings details beside the selected CMS form.',
  tags: ['contact', 'map', 'form', 'two-column', 'settings'],
  template: `{%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid or entity.contact_01_form.is_valid or entity.contact_01_google_maps_embed_url.is_valid or settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid -%}
<section class="contact-02 bg-white py-5">
  <div class="container py-2">
    {%- if entity.contact_01_google_maps_embed_url.is_valid -%}
    <div class="contact-02-map rounded-3 overflow-hidden shadow-sm mb-5">
      <iframe class="w-100 border-0" src="{{ entity.contact_01_google_maps_embed_url.value | escape }}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map showing our location"></iframe>
    </div>
    {%- endif -%}

    <div class="row g-5 align-items-start">
      <div class="col-12 {% if entity.contact_01_form.is_valid %}col-lg-4{% endif %} order-2 order-lg-1">
        {%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid -%}
        <div class="mb-4">
          <p class="small text-primary fw-bold text-uppercase mb-2">Talk About Your Project</p>
          {%- if entity.contact_01_title.is_valid -%}
          <h1 class="h2 fw-bold text-primary mb-3">{{ entity.contact_01_title }}</h1>
          {%- endif -%}
          {%- if entity.contact_01_description.is_valid -%}
          <p class="text-secondary mb-0">{{ entity.contact_01_description }}</p>
          {%- endif -%}
        </div>
        {%- endif -%}

        {%- if settings.company_address.is_valid or settings.company_email.is_valid or settings.company_phone.is_valid or settings.company_hours.is_valid -%}
        <div class="contact-02-details mt-4">
          <h2 class="h6 text-primary text-uppercase fw-bold mb-3">Contact Info</h2>
          <ul class="list-unstyled d-grid gap-3 mb-0">
            {%- if settings.company_address.is_valid -%}
            <li class="d-flex align-items-start gap-2"><i class="bi bi-geo-alt-fill text-primary mt-1" aria-hidden="true"></i><span class="text-secondary">{{ settings.company_address }}</span></li>
            {%- endif -%}
            {%- if settings.company_email.is_valid -%}
            <li class="d-flex align-items-start gap-2"><i class="bi bi-envelope-fill text-primary mt-1" aria-hidden="true"></i><a class="text-secondary text-break text-decoration-none" href="mailto:{{ settings.company_email.value | escape }}">{{ settings.company_email }}</a></li>
            {%- endif -%}
            {%- if settings.company_phone.is_valid -%}
            {%- assign contact_phone_href = settings.company_phone.value | remove: " " | remove: "(" | remove: ")" | remove: "-" | remove: "." -%}
            <li class="d-flex align-items-start gap-2"><i class="bi bi-telephone-fill text-primary mt-1" aria-hidden="true"></i><a class="text-secondary text-decoration-none" href="tel:{{ contact_phone_href | escape }}">{{ settings.company_phone }}</a></li>
            {%- endif -%}
            {%- if settings.company_hours.is_valid -%}
            <li class="d-flex align-items-start gap-2"><i class="bi bi-clock-fill text-primary mt-1" aria-hidden="true"></i><span class="text-secondary">{{ settings.company_hours }}</span></li>
            {%- endif -%}
          </ul>
        </div>
        {%- endif -%}

        {%- if settings.company_social_media.is_valid -%}
        <div class="contact-02-social mt-4 pt-3 border-top">
          <h2 class="h6 text-primary text-uppercase fw-bold mb-3">Follow Us</h2>
          <div class="d-flex flex-wrap gap-3">
            {%- for social in settings.company_social_media -%}
              {%- if social.social_media_link.is_valid -%}
              <a class="text-primary fs-5" href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.social_media_platform.value | escape }}">
                {%- case social.social_media_platform.value -%}
                  {%- when "Facebook" -%}<i class="bi bi-facebook" aria-hidden="true"></i>
                  {%- when "Instagram" -%}<i class="bi bi-instagram" aria-hidden="true"></i>
                  {%- when "YouTube" -%}<i class="bi bi-youtube" aria-hidden="true"></i>
                  {%- when "LinkedIn" -%}<i class="bi bi-linkedin" aria-hidden="true"></i>
                  {%- when "X" -%}<i class="bi bi-twitter-x" aria-hidden="true"></i>
                  {%- when "TikTok" -%}<i class="bi bi-tiktok" aria-hidden="true"></i>
                {%- endcase -%}
              </a>
              {%- endif -%}
            {%- endfor -%}
          </div>
        </div>
        {%- endif -%}
      </div>

      {%- if entity.contact_01_form.is_valid -%}
      <div class="col-12 col-lg-8 order-1 order-lg-2">
        <div class="contact-02-form-card">
          {%- if entity.contact_01_form_eyebrow.is_valid or entity.contact_01_form_title.is_valid -%}
          <div class="mb-4">
            {%- if entity.contact_01_form_eyebrow.is_valid -%}
            <p class="small text-secondary text-uppercase fw-bold mb-2">{{ entity.contact_01_form_eyebrow }}</p>
            {%- endif -%}
            {%- if entity.contact_01_form_title.is_valid -%}
            <h2 class="h3 text-primary fw-bold mb-0">{{ entity.contact_01_form_title }}</h2>
            {%- endif -%}
          </div>
          {%- endif -%}
          <div class="contact-form">{{ entity.contact_01_form }}</div>
        </div>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.contact-02-map iframe {
  display: block;
  height: 270px;
}

.contact-02-form-card {
  border-left: 1px solid var(--bs-border-color);
  padding-left: 3rem;
}

.contact-02 .contact-form form {
  display: grid;
  gap: .8rem;
}

.contact-02 .contact-form form > div {
  margin: 0;
}

.contact-02 .contact-form .label,
.contact-02 .contact-form label {
  display: block;
  color: var(--bs-secondary-color);
  font-size: .875rem;
  font-weight: 600;
  margin-bottom: .4rem;
}

.contact-02 .contact-form .required::after {
  content: "*";
  color: var(--bs-danger);
  margin-left: .25rem;
}

.contact-02 .contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),
.contact-02 .contact-form textarea,
.contact-02 .contact-form select {
  width: 100%;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  padding: .8rem .95rem;
  color: var(--bs-body-color);
  background-color: var(--bs-white);
  outline: none;
}

.contact-02 .contact-form input:focus,
.contact-02 .contact-form textarea:focus,
.contact-02 .contact-form select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 .2rem rgba(var(--bs-primary-rgb), .12);
}

.contact-02 .contact-form textarea {
  min-height: 150px;
  resize: vertical;
}

.contact-02 .contact-form button[type="submit"],
.contact-02 .contact-form input[type="submit"] {
  justify-self: start;
  min-width: 9rem;
  border: 0;
  border-radius: var(--bs-border-radius);
  padding: .75rem 1.25rem;
  color: var(--bs-white);
  background: var(--bs-primary);
  font-weight: 700;
}

.contact-02 .contact-form button[type="submit"]:hover,
.contact-02 .contact-form input[type="submit"]:hover {
  background: var(--bs-primary-text-emphasis);
}

.contact-02 .contact-form .mp-formfield-validation-message {
  display: block;
  color: var(--bs-danger);
  font-size: .875rem;
  margin-top: .35rem;
}

.contact-02 .contact-form .mp-form-message {
  display: block;
  margin-top: 1rem;
  color: var(--bs-primary);
  font-weight: 600;
}

.contact-02 .contact-form .g-recaptcha {
  margin-top: .5rem;
}

@media (max-width: 991.98px) {
  .contact-02-form-card {
    border-left: 0;
    border-top: 1px solid var(--bs-border-color);
    padding-top: 2rem;
    padding-left: 0;
  }

  .contact-02-map iframe {
    height: 230px;
  }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: [
    ...contactFields,
    {
      Type: 'group',
      Label: 'Contact Form Heading',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'contact_01_form_eyebrow',
          Label: 'Form Eyebrow',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. We’re ready when you are',
          DefaultValue: 'We’re ready when you are',
        },
        {
          Type: 'text',
          FieldID: 'contact_01_form_title',
          Label: 'Form Title',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Project Contact Form',
          DefaultValue: 'Project Contact Form',
        },
      ],
    },
  ],
  notes: [
    'This layout uses the same four Page Fields as Contact 01. Choose either visual variant without recreating the field schema.',
    'Edit the form eyebrow and title in the Contact Form Heading group.',
    'The address, phone, email, hours, and social media links come from the shared Page Settings datastore.',
    'Set the selected Marketpath Form Redirect URL to /thank-you. Rendering the Form entity directly preserves Marketpath’s native validation and redirect behavior; without a Redirect URL, Marketpath displays its configured success message.',
    'The static preview uses a local map illustration; the copied template embeds the Google Maps URL stored in the page field.',
    'Bootstrap Icons CSS must be available for the contact and social icons.',
  ],
  preview: {
    html: `<section class="contact-02 bg-white py-5">
  <style>
    .contact-02-map-art { position:relative; height:270px; overflow:hidden; background-color:#e9efed; background-image:linear-gradient(28deg,transparent 44%,#fff 45%,#fff 49%,transparent 50%),linear-gradient(148deg,transparent 40%,#fff 41%,#fff 45%,transparent 46%),linear-gradient(90deg,transparent 63%,#d9eee2 63%),repeating-linear-gradient(0deg,transparent 0 52px,rgba(255,255,255,.75) 53px 57px); background-size:220px 170px,260px 190px,auto,auto; }
    .contact-02-map-art::before { content:""; position:absolute; width:28px; height:28px; top:44%; left:53%; border:8px solid #dc3545; border-radius:50% 50% 50% 0; background:#fff; transform:rotate(-45deg); box-shadow:0 2px 8px #0003; }
    .contact-02-map-art::after { content:"Example location · Map preview"; position:absolute; left:1rem; top:1rem; padding:.5rem .75rem; border-radius:.35rem; background:#fff; color:#39434d; font:600 12px system-ui,sans-serif; box-shadow:0 2px 10px #0002; }
    .contact-02 .contact-form form { display:grid; gap:.8rem; }
    .contact-02 .contact-form form > div { margin:0; }
    .contact-02 .contact-form .label, .contact-02 .contact-form label { display:block; color:var(--bs-secondary-color); font-size:.875rem; font-weight:600; margin-bottom:.4rem; }
    .contact-02 .contact-form .required::after { content:"*"; color:var(--bs-danger); margin-left:.25rem; }
    .contact-02 .contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), .contact-02 .contact-form textarea, .contact-02 .contact-form select { width:100%; border:1px solid var(--bs-border-color); border-radius:var(--bs-border-radius); padding:.8rem .95rem; color:var(--bs-body-color); background-color:var(--bs-white); outline:none; }
    .contact-02 .contact-form input:focus, .contact-02 .contact-form textarea:focus, .contact-02 .contact-form select:focus { border-color:var(--bs-primary); box-shadow:0 0 0 .2rem rgba(var(--bs-primary-rgb),.12); }
    .contact-02 .contact-form textarea { min-height:115px; resize:vertical; }
    .contact-02 .contact-form button[type="submit"], .contact-02 .contact-form input[type="submit"] { border:0; border-radius:var(--bs-border-radius); padding:.7rem 1.2rem; color:#fff; background:var(--bs-primary); font-weight:700; }
    .contact-02 .contact-form .mp-formfield-validation-message { display:block; color:var(--bs-danger); font-size:.875rem; margin-top:.35rem; }
    .contact-02 .contact-form .mp-form-message { display:block; margin-top:1rem; color:var(--bs-primary); font-weight:600; }
    .contact-02 .contact-form .g-recaptcha { margin-top:.5rem; }
    @media(max-width:991.98px){.contact-02-map-art{height:220px}}
  </style>
  <div class="container py-2">
    <div class="contact-02-map-art rounded-3 overflow-hidden shadow-sm mb-5" role="img" aria-label="Illustrated map preview"></div>
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-4 order-2 order-lg-1">
        <div class="mb-4"><p class="small text-primary fw-bold text-uppercase mb-2">Talk About Your Project</p><h1 class="h2 fw-bold text-primary mb-3">Let’s make your next project feel simple.</h1><p class="text-secondary mb-0">Tell us what you have in mind. We’ll help you find a clear, comfortable next step.</p></div>
        <div class="contact-02-details mt-4"><h2 class="h6 text-primary text-uppercase fw-bold mb-3">Contact Info</h2><ul class="list-unstyled d-grid gap-3 mb-0"><li class="d-flex align-items-start gap-2"><i class="bi bi-geo-alt-fill text-primary mt-1" aria-hidden="true"></i><span class="text-secondary">123 Example Street, Anytown</span></li><li class="d-flex align-items-start gap-2"><i class="bi bi-envelope-fill text-primary mt-1" aria-hidden="true"></i><a class="text-secondary text-decoration-none" href="mailto:hello@example.com">hello@example.com</a></li><li class="d-flex align-items-start gap-2"><i class="bi bi-telephone-fill text-primary mt-1" aria-hidden="true"></i><a class="text-secondary text-decoration-none" href="tel:+15550102020">(555) 010-2020</a></li><li class="d-flex align-items-start gap-2"><i class="bi bi-clock-fill text-primary mt-1" aria-hidden="true"></i><span class="text-secondary">Monday–Friday, 8:00 a.m.–5:00 p.m.</span></li></ul></div>
        <div class="contact-02-social mt-4 pt-3 border-top"><h2 class="h6 text-primary text-uppercase fw-bold mb-3">Follow Us</h2><div class="d-flex flex-wrap gap-3"><a class="text-primary fs-5" href="#" aria-label="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a><a class="text-primary fs-5" href="#" aria-label="Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a><a class="text-primary fs-5" href="#" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a></div></div>
      </div>
      <div class="col-12 col-lg-8 order-1 order-lg-2"><div class="contact-02-form-card"><div class="mb-4"><p class="small text-secondary text-uppercase fw-bold mb-2">We’re ready when you are</p><h2 class="h3 text-primary fw-bold mb-0">Project Contact Form</h2></div><div class="contact-form"><form><div><label class="label required" for="contact02PreviewFirstName">First Name</label><input id="contact02PreviewFirstName" type="text" placeholder="First Name"></div><div><label class="label required" for="contact02PreviewEmail">Email</label><input id="contact02PreviewEmail" type="email" placeholder="Email"></div><div><label class="label" for="contact02PreviewProject">Project Type</label><select id="contact02PreviewProject"><option>Select a project type</option><option>Windows</option><option>Doors</option><option>Other</option></select></div><div><label class="label" for="contact02PreviewMessage">Comments / Message</label><textarea id="contact02PreviewMessage" placeholder="Tell us a little about your project"></textarea></div><button type="submit">Send message</button></form></div></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Let’s make your next project feel simple.',
    description: 'Tell us what you have in mind. We’ll help you find a clear, comfortable next step.',
    form: '',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.86532738521!2d-86.0088088!3d39.9667636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8814ad53b86ad1ed%3A0x82fc68614c4bcce0!2sMarketpath%2C%20Inc.!5e0!3m2!1sen!2sec!4v1791993682062!5m2!1sen!2sec',
    form_eyebrow: 'We’re ready when you are',
    form_title: 'Project Contact Form',
  },
};
