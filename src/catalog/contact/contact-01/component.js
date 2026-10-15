import { contactFields } from '../shared-fields.js';

export default {
  id: 'contact-01',
  name: 'Contact Page',
  category: 'contact',
  prefix: 'contact_01_',
  sharedFieldsId: 'contact_01',
  sharedFieldIds: ['contact_01_title', 'contact_01_description', 'contact_01_form', 'contact_01_google_maps_embed_url'],
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  description: 'A complete contact layout with Page Settings details, an optional CMS form, social links, and an optional map.',
  tags: ['contact', 'form', 'map', 'social media', 'settings'],
  template: `{%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid or entity.contact_01_form.is_valid or settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid or entity.contact_01_google_maps_embed_url.is_valid -%}
<section class="contact-01 bg-white py-5">
  <div class="container py-2">
    {%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid -%}
    <div class="row justify-content-center text-center mb-4 mb-lg-5">
      <div class="col-12 col-lg-8">
        {%- if entity.contact_01_title.is_valid -%}
        <h1 class="display-6 fw-bold text-primary mb-3">{{ entity.contact_01_title }}</h1>
        {%- endif -%}
        {%- if entity.contact_01_description.is_valid -%}
        <p class="lead text-secondary mb-0">{{ entity.contact_01_description }}</p>
        {%- endif -%}
      </div>
    </div>
    {%- endif -%}

    {%- assign contact_has_details = false -%}
    {%- if settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid or entity.contact_01_google_maps_embed_url.is_valid -%}
    {%- assign contact_has_details = true -%}
    {%- endif -%}
    <div class="row g-4 g-lg-5 align-items-stretch">
      {%- if contact_has_details -%}
      <div class="col-12 {% if entity.contact_01_form.is_valid %}col-lg-6{% endif %} order-2 order-lg-1 d-flex flex-column">
        {%- if settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid -%}
        <div class="contact-01-info bg-light rounded-4 p-4 p-lg-5 mb-4">
          <div class="mb-4">
            <h2 class="h3 text-primary fw-bold mb-2">Contact Information</h2>
            <p class="text-secondary mb-0">Reach out to our team and we’ll be happy to help.</p>
          </div>

          {%- if settings.company_address.is_valid -%}
          <div class="d-flex align-items-start mb-4">
            <i class="bi bi-geo-alt-fill fs-4 text-primary me-3" aria-hidden="true"></i>
            <div>
              <h3 class="h6 text-primary fw-bold mb-1">Location</h3>
              <p class="mb-0 text-secondary">{{ settings.company_address }}</p>
            </div>
          </div>
          {%- endif -%}

          {%- if settings.company_email.is_valid -%}
          <div class="d-flex align-items-start mb-4">
            <i class="bi bi-envelope-fill fs-4 text-primary me-3" aria-hidden="true"></i>
            <div>
              <h3 class="h6 text-primary fw-bold mb-1">Email</h3>
              <a class="text-secondary text-break text-decoration-none" href="mailto:{{ settings.company_email.value | escape }}">{{ settings.company_email }}</a>
            </div>
          </div>
          {%- endif -%}

          {%- if settings.company_phone.is_valid -%}
          {%- assign contact_phone_href = settings.company_phone.value | remove: " " | remove: "(" | remove: ")" | remove: "-" | remove: "." -%}
          <div class="d-flex align-items-start mb-4">
            <i class="bi bi-telephone-fill fs-4 text-primary me-3" aria-hidden="true"></i>
            <div>
              <h3 class="h6 text-primary fw-bold mb-1">Phone</h3>
              <a class="text-secondary text-decoration-none" href="tel:{{ contact_phone_href | escape }}">{{ settings.company_phone }}</a>
            </div>
          </div>
          {%- endif -%}

          {%- if settings.company_hours.is_valid -%}
          <div class="d-flex align-items-start mb-4">
            <i class="bi bi-clock-fill fs-4 text-primary me-3" aria-hidden="true"></i>
            <div>
              <h3 class="h6 text-primary fw-bold mb-1">Hours</h3>
              <p class="mb-0 text-secondary">{{ settings.company_hours }}</p>
            </div>
          </div>
          {%- endif -%}

          {%- if settings.company_social_media.is_valid -%}
          <div class="pt-3 border-top">
            <h3 class="h6 text-primary fw-bold mb-3">Follow Us</h3>
            <div class="d-flex flex-wrap gap-2">
              {%- for social in settings.company_social_media -%}
                {%- if social.social_media_link.is_valid -%}
                <a class="btn btn-outline-primary btn-sm rounded-pill" href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.social_media_platform.value | escape }}">
                  {%- case social.social_media_platform.value -%}
                    {%- when "Facebook" -%}<i class="bi bi-facebook me-1" aria-hidden="true"></i>
                    {%- when "Instagram" -%}<i class="bi bi-instagram me-1" aria-hidden="true"></i>
                    {%- when "YouTube" -%}<i class="bi bi-youtube me-1" aria-hidden="true"></i>
                    {%- when "LinkedIn" -%}<i class="bi bi-linkedin me-1" aria-hidden="true"></i>
                    {%- when "X" -%}<i class="bi bi-twitter-x me-1" aria-hidden="true"></i>
                    {%- when "TikTok" -%}<i class="bi bi-tiktok me-1" aria-hidden="true"></i>
                  {%- endcase -%}
                  {{ social.social_media_platform.value }}
                </a>
                {%- endif -%}
              {%- endfor -%}
            </div>
          </div>
          {%- endif -%}
        </div>
        {%- endif -%}

        {%- if entity.contact_01_google_maps_embed_url.is_valid -%}
        <div class="contact-01-map d-flex flex-column flex-grow-1">
          <h2 class="h5 text-primary fw-bold mb-3">Find Us</h2>
          <div class="contact-01-map-frame rounded-4 overflow-hidden shadow-sm flex-grow-1">
            <iframe class="border-0 w-100 h-100" src="{{ entity.contact_01_google_maps_embed_url.value | escape }}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map showing our location"></iframe>
          </div>
        </div>
        {%- endif -%}
      </div>
      {%- endif -%}

      {%- if entity.contact_01_form.is_valid -%}
      <div class="col-12 {% if contact_has_details %}col-lg-6{% endif %} order-1 order-lg-2">
        <div class="contact-01-form-card h-100 bg-white border rounded-4 shadow-sm p-4 p-lg-5">
          <div class="mb-4">
            <h2 class="h3 text-primary fw-bold mb-2">Drop Us a Line</h2>
            <p class="text-secondary mb-0">Fill out the form and our team will get back to you soon.</p>
          </div>
          <div class="contact-form">{{ entity.contact_01_form }}</div>
        </div>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- add_stylesheet inline -%}
.contact-form form {
  display: grid;
  gap: 1rem;
}

.contact-form form > div {
  margin: 0;
}

.contact-form .label,
.contact-form label {
  display: block;
  color: var(--bs-primary);
  font-weight: 700;
  margin-bottom: .35rem;
}

.contact-form .required::after {
  content: "*";
  color: var(--bs-secondary);
  margin-left: .25rem;
}

.contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),
.contact-form textarea,
.contact-form select {
  width: 100%;
  border: 1px solid rgba(var(--bs-primary-rgb), .18);
  border-radius: var(--bs-border-radius-lg);
  padding: .85rem 1rem;
  color: var(--bs-primary);
  background-color: var(--bs-light);
  outline: none;
}

.contact-form input:focus,
.contact-form textarea:focus,
.contact-form select:focus {
  border-color: var(--bs-secondary);
  box-shadow: 0 0 0 .25rem rgba(var(--bs-secondary-rgb), .16);
  background-color: #fff;
}

.contact-form textarea {
  min-height: 140px;
  resize: vertical;
}

.contact-form button[type="submit"],
.contact-form input[type="submit"] {
  width: 100%;
  border: 0;
  border-radius: var(--bs-border-radius-lg);
  padding: .85rem 1.25rem;
  color: #fff;
  background-color: var(--bs-secondary);
  font-weight: 700;
}

.contact-form button[type="submit"]:hover,
.contact-form button[type="submit"]:focus,
.contact-form input[type="submit"]:hover,
.contact-form input[type="submit"]:focus {
  background-color: var(--bs-primary);
}

.contact-form .mp-formfield-validation-message {
  display: block;
  color: var(--bs-danger);
  font-size: .875rem;
  margin-top: .35rem;
}

.contact-form .mp-form-message {
  display: block;
  margin-top: 1rem;
  color: var(--bs-primary);
  font-weight: 600;
}

.contact-form .g-recaptcha {
  margin-top: .5rem;
}

.contact-01-map-frame {
  min-height: 250px;
}

.contact-01-map-frame iframe {
  min-height: 250px;
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: contactFields,
  notes: [
    'Company address, email, phone, business hours, and social media links come from the shared Page Settings datastore.',
    'Set the selected Marketpath Form Redirect URL to /thank-you. Rendering the Form entity directly preserves Marketpath’s native validation and redirect behavior; without a Redirect URL, Marketpath displays its configured success message.',
    'The scoped inline stylesheet styles the generated form labels, controls, submit button, validation messages, and reCAPTCHA block.',
    'Paste only the Google Maps embed src URL to show the optional map. The map is not loaded in the static preview.',
    'The shared header must load the Page Settings datastore and assign the global settings object before this component renders. Bootstrap Icons CSS is needed for the contact and social icons.',
  ],
  preview: {
    html: `<section class="contact-01 bg-white py-5">
  <style>
    .contact-01-map-preview { background-color: #e8edf0; background-image: linear-gradient(35deg, transparent 46%, #fff 47%, #fff 50%, transparent 51%), linear-gradient(145deg, transparent 42%, #d1dbe0 43%, #d1dbe0 47%, transparent 48%), repeating-linear-gradient(0deg, transparent 0 38px, rgba(255,255,255,.85) 39px 43px); background-size: 170px 130px, 210px 160px, auto; }
    .contact-01 .contact-form form { display:grid; gap:1rem; }
    .contact-01 .contact-form form > div { margin:0; }
    .contact-01 .contact-form .label, .contact-01 .contact-form label { display:block; color:var(--bs-primary); font-weight:700; margin-bottom:.35rem; }
    .contact-01 .contact-form .required::after { content:"*"; color:var(--bs-secondary); margin-left:.25rem; }
    .contact-01 .contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), .contact-01 .contact-form textarea, .contact-01 .contact-form select { width:100%; border:1px solid rgba(var(--bs-primary-rgb),.18); border-radius:var(--bs-border-radius-lg); padding:.85rem 1rem; color:var(--bs-primary); background-color:var(--bs-light); outline:none; }
    .contact-01 .contact-form input:focus, .contact-01 .contact-form textarea:focus, .contact-01 .contact-form select:focus { border-color:var(--bs-secondary); box-shadow:0 0 0 .25rem rgba(var(--bs-secondary-rgb),.16); background-color:#fff; }
    .contact-01 .contact-form textarea { min-height:100px; resize:vertical; }
    .contact-01 .contact-form button[type="submit"], .contact-01 .contact-form input[type="submit"] { width:100%; border:0; border-radius:var(--bs-border-radius-lg); padding:.85rem 1.25rem; color:#fff; background-color:var(--bs-secondary); font-weight:700; }
    .contact-01 .contact-form .mp-formfield-validation-message { display:block; color:var(--bs-danger); font-size:.875rem; margin-top:.35rem; }
    .contact-01 .contact-form .mp-form-message { display:block; margin-top:1rem; color:var(--bs-primary); font-weight:600; }
    .contact-01 .contact-form .g-recaptcha { margin-top:.5rem; }
  </style>
  <div class="container py-2">
    <div class="row justify-content-center text-center mb-4 mb-lg-5"><div class="col-12 col-lg-8"><h1 class="display-6 fw-bold text-primary mb-3">Let’s talk about your next project.</h1><p class="lead text-secondary mb-0">Send us a note or stop by. Our team is ready to help you plan the next step.</p></div></div>
    <div class="row g-4 g-lg-5 align-items-stretch">
      <div class="col-12 col-lg-6 order-2 order-lg-1 d-flex flex-column">
        <div class="contact-01-info bg-light rounded-4 p-4 p-lg-5 mb-4">
          <div class="mb-4"><h2 class="h3 text-primary fw-bold mb-2">Contact Information</h2><p class="text-secondary mb-0">Reach out to our team and we’ll be happy to help.</p></div>
          <div class="d-flex align-items-start mb-4"><i class="bi bi-geo-alt-fill fs-4 text-primary me-3" aria-hidden="true"></i><div><h3 class="h6 text-primary fw-bold mb-1">Location</h3><p class="mb-0 text-secondary">123 Example Street, Anytown</p></div></div>
          <div class="d-flex align-items-start mb-4"><i class="bi bi-envelope-fill fs-4 text-primary me-3" aria-hidden="true"></i><div><h3 class="h6 text-primary fw-bold mb-1">Email</h3><a class="text-secondary text-decoration-none" href="mailto:hello@example.com">hello@example.com</a></div></div>
          <div class="d-flex align-items-start mb-4"><i class="bi bi-telephone-fill fs-4 text-primary me-3" aria-hidden="true"></i><div><h3 class="h6 text-primary fw-bold mb-1">Phone</h3><a class="text-secondary text-decoration-none" href="tel:+15550102020">(555) 010-2020</a></div></div>
          <div class="d-flex align-items-start mb-4"><i class="bi bi-clock-fill fs-4 text-primary me-3" aria-hidden="true"></i><div><h3 class="h6 text-primary fw-bold mb-1">Hours</h3><p class="mb-0 text-secondary">Monday–Friday, 8:00 a.m.–5:00 p.m.</p></div></div>
          <div class="pt-3 border-top"><h3 class="h6 text-primary fw-bold mb-3">Follow Us</h3><div class="d-flex flex-wrap gap-2"><a class="btn btn-outline-primary btn-sm rounded-pill" href="#" aria-label="Instagram"><i class="bi bi-instagram me-1" aria-hidden="true"></i>Instagram</a><a class="btn btn-outline-primary btn-sm rounded-pill" href="#" aria-label="Facebook"><i class="bi bi-facebook me-1" aria-hidden="true"></i>Facebook</a><a class="btn btn-outline-primary btn-sm rounded-pill" href="#" aria-label="LinkedIn"><i class="bi bi-linkedin me-1" aria-hidden="true"></i>LinkedIn</a></div></div>
        </div>
        <div class="contact-01-map d-flex flex-column flex-grow-1"><h2 class="h5 text-primary fw-bold mb-3">Find Us</h2><div class="contact-01-map-frame contact-01-map-preview rounded-4 overflow-hidden shadow-sm flex-grow-1 d-flex align-items-center justify-content-center" style="min-height:250px;"><span class="badge rounded-pill text-bg-white text-primary shadow-sm px-3 py-2"><i class="bi bi-geo-alt-fill me-2" aria-hidden="true"></i>Map embed preview</span></div></div>
      </div>
      <div class="col-12 col-lg-6 order-1 order-lg-2"><div class="contact-01-form-card h-100 bg-white border rounded-4 shadow-sm p-4 p-lg-5"><div class="mb-4"><h2 class="h3 text-primary fw-bold mb-2">Drop Us a Line</h2><p class="text-secondary mb-0">Fill out the form and our team will get back to you soon.</p></div><div class="contact-form"><form><div><label class="label required" for="contactPreviewName">Name</label><input id="contactPreviewName" type="text" placeholder="Your name"></div><div><label class="label required" for="contactPreviewEmail">Email</label><input id="contactPreviewEmail" type="email" placeholder="you@example.com"></div><div><label class="label" for="contactPreviewMessage">How can we help?</label><textarea id="contactPreviewMessage" placeholder="Tell us a little about your project"></textarea></div><button type="submit">Send message</button></form></div></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Let’s talk about your next project.',
    description: 'Send us a note or stop by. Our team is ready to help you plan the next step.',
    form: '',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.86532738521!2d-86.0088088!3d39.9667636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8814ad53b86ad1ed%3A0x82fc68614c4bcce0!2sMarketpath%2C%20Inc.!5e0!3m2!1sen!2sec!4v1791993682062!5m2!1sen!2sec',
  },
};
