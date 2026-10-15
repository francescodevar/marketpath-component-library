import { contactFields } from '../shared-fields.js';

export default {
  id: 'contact-main',
  name: 'Contact Main',
  category: 'contact',
  prefix: 'contact_01_',
  sharedFieldsId: 'contact_01',
  sharedFieldIds: ['contact_01_title', 'contact_01_description', 'contact_01_form', 'contact_01_google_maps_embed_url'],
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  description: 'A bold contact destination pairing a deep-toned information panel with a clean, focused CMS form.',
  tags: ['contact', 'form', 'dark panel', 'map', 'settings'],
  template: `{%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid or entity.contact_01_form.is_valid or entity.contact_01_google_maps_embed_url.is_valid or settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid -%}
<section class="contact-main bg-light py-5">
  <div class="container py-2">
    {%- assign contact_main_has_info = false -%}
    {%- if entity.contact_01_title.is_valid or entity.contact_01_description.is_valid or settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid or settings.company_social_media.is_valid -%}
    {%- assign contact_main_has_info = true -%}
    {%- endif -%}

    <div class="contact-main-frame row g-0">
      {%- if contact_main_has_info -%}
      <div class="col-12 {% if entity.contact_01_form.is_valid %}col-lg-5{% endif %} contact-main-info text-white p-4 p-lg-5">
        <p class="contact-main-kicker small text-uppercase fw-bold text-white-50 mb-4">A good place to start</p>
        {%- if entity.contact_01_title.is_valid -%}
        <h1 class="display-5 fw-bold mb-4">{{ entity.contact_01_title }}</h1>
        {%- endif -%}
        {%- if entity.contact_01_description.is_valid -%}
        <p class="lead text-white-50 mb-5">{{ entity.contact_01_description }}</p>
        {%- endif -%}

        {%- if settings.company_address.is_valid or settings.company_email.is_valid or settings.company_phone.is_valid or settings.company_hours.is_valid -%}
        <div class="contact-main-details pt-4 border-top border-white border-opacity-25">
          <h2 class="h6 text-uppercase fw-bold mb-4">Contact Information</h2>
          <ul class="list-unstyled d-grid gap-4 mb-0">
            {%- if settings.company_address.is_valid -%}
            <li class="d-flex align-items-start gap-3"><i class="bi bi-geo-alt fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Visit</span><span>{{ settings.company_address }}</span></div></li>
            {%- endif -%}
            {%- if settings.company_email.is_valid -%}
            <li class="d-flex align-items-start gap-3"><i class="bi bi-envelope fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Email</span><a class="text-white text-break text-decoration-none" href="mailto:{{ settings.company_email.value | escape }}">{{ settings.company_email }}</a></div></li>
            {%- endif -%}
            {%- if settings.company_phone.is_valid -%}
            {%- assign contact_phone_href = settings.company_phone.value | remove: " " | remove: "(" | remove: ")" | remove: "-" | remove: "." -%}
            <li class="d-flex align-items-start gap-3"><i class="bi bi-telephone fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Call</span><a class="text-white text-decoration-none" href="tel:{{ contact_phone_href | escape }}">{{ settings.company_phone }}</a></div></li>
            {%- endif -%}
            {%- if settings.company_hours.is_valid -%}
            <li class="d-flex align-items-start gap-3"><i class="bi bi-clock fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Hours</span><span>{{ settings.company_hours }}</span></div></li>
            {%- endif -%}
          </ul>
        </div>
        {%- endif -%}

        {%- if settings.company_social_media.is_valid -%}
        <div class="contact-main-social d-flex flex-wrap gap-3 mt-4 pt-4 border-top border-white border-opacity-25">
          {%- for social in settings.company_social_media -%}
            {%- if social.social_media_link.is_valid -%}
            <a class="text-white fs-5" href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.social_media_platform.value | escape }}">
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
        {%- endif -%}

        {%- if entity.contact_01_google_maps_embed_url.is_valid -%}
        <div class="contact-main-map mt-4 rounded-3 overflow-hidden shadow-sm">
          <iframe class="w-100 border-0" src="{{ entity.contact_01_google_maps_embed_url.value | escape }}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map showing our location"></iframe>
        </div>
        {%- endif -%}
      </div>
      {%- endif -%}

      {%- if entity.contact_01_form.is_valid -%}
      <div class="col-12 {% if contact_main_has_info %}col-lg-7{% endif %} contact-main-form bg-white p-4 p-lg-5">
        <div class="contact-main-form-heading d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p class="small text-primary text-uppercase fw-bold mb-2">Tell us a little about it</p>
            <h2 class="h2 fw-bold text-dark mb-0">Let’s talk.</h2>
          </div>
          <span class="contact-main-index text-secondary" aria-hidden="true">01 <i class="bi bi-arrow-down-right"></i></span>
        </div>
        <p class="text-secondary mb-4">Share a few details and we’ll follow up with a helpful next step.</p>
        <div class="contact-form">{{ entity.contact_01_form }}</div>
      </div>
      {%- endif -%}
    </div>

  </div>
</section>
{%- add_stylesheet inline -%}
.contact-main-frame {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1.25rem 3rem rgba(20, 35, 45, .12);
}

.contact-main-info {
  position: relative;
  isolation: isolate;
  background: #172d32;
}

.contact-main-info::after {
  position: absolute;
  z-index: -1;
  right: -6rem;
  bottom: -8rem;
  width: 19rem;
  height: 19rem;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 50%;
  box-shadow: 0 0 0 2rem rgba(255, 255, 255, .025), 0 0 0 4rem rgba(255, 255, 255, .02);
  content: "";
  pointer-events: none;
}

.contact-main-kicker {
  letter-spacing: .16em;
}

.contact-main-info h1,
.contact-main-details,
.contact-main-social {
  position: relative;
  z-index: 1;
}

.contact-main-info a:hover {
  color: var(--bs-info) !important;
}

.contact-main-label {
  letter-spacing: .08em;
  text-transform: uppercase;
}

.contact-main-form {
  min-width: 0;
}

.contact-main-index {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-size: .8rem;
  letter-spacing: .1em;
  white-space: nowrap;
}

.contact-main .contact-form form {
  display: grid;
  gap: 1rem;
}

.contact-main .contact-form form > div {
  margin: 0;
}

.contact-main .contact-form .label,
.contact-main .contact-form label {
  display: block;
  color: var(--bs-body-color);
  font-size: .9rem;
  font-weight: 600;
  margin-bottom: .4rem;
}

.contact-main .contact-form .required::after {
  content: "*";
  color: var(--bs-danger);
  margin-left: .25rem;
}

.contact-main .contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),
.contact-main .contact-form textarea,
.contact-main .contact-form select {
  width: 100%;
  border: 1px solid #d9e0e3;
  border-radius: .5rem;
  padding: .9rem 1rem;
  color: var(--bs-body-color);
  background-color: #fbfcfc;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
}

.contact-main .contact-form input:focus,
.contact-main .contact-form textarea:focus,
.contact-main .contact-form select:focus {
  border-color: var(--bs-primary);
  background-color: #fff;
  box-shadow: 0 0 0 .22rem rgba(var(--bs-primary-rgb), .13);
}

.contact-main .contact-form textarea {
  min-height: 140px;
  resize: vertical;
}

.contact-main .contact-form button[type="submit"],
.contact-main .contact-form input[type="submit"] {
  justify-self: start;
  min-width: 10rem;
  border: 0;
  border-radius: 50rem;
  padding: .85rem 1.5rem;
  color: #fff;
  background-color: #172d32;
  font-weight: 700;
}

.contact-main .contact-form button[type="submit"]:hover,
.contact-main .contact-form input[type="submit"]:hover {
  background-color: var(--bs-primary);
}

.contact-main .contact-form .mp-formfield-validation-message {
  display: block;
  color: var(--bs-danger);
  font-size: .875rem;
  margin-top: .35rem;
}

.contact-main .contact-form .mp-form-message {
  display: block;
  margin-top: 1rem;
  color: var(--bs-primary);
  font-weight: 600;
}

.contact-main .contact-form .g-recaptcha {
  margin-top: .5rem;
}

.contact-main-map iframe {
  display: block;
  height: 180px;
}

@media (max-width: 991.98px) {
  .contact-main-map iframe {
    height: 200px;
  }
}
{% end_stylesheet %}
{%- endif -%}`,
  fields: contactFields,
  notes: [
    'Uses the same Page Fields as Contact 01 and Contact 02, with the shared address, phone, email, hours, and social media from Page Settings.',
    'Set the selected Marketpath Form Redirect URL to /thank-you. Rendering the Form entity directly preserves Marketpath’s native validation and redirect behavior; without a Redirect URL, Marketpath displays its configured success message.',
    'The optional map appears beneath the social links in the information panel. The static preview uses a local illustration; the copied template embeds the page Google Maps URL.',
    'Bootstrap Icons CSS must be available for the contact and social icons.',
  ],
  preview: {
    html: `<section class="contact-main bg-light py-5">
  <style>
    .contact-main-frame { overflow:hidden; border-radius:1rem; box-shadow:0 1.25rem 3rem rgba(20,35,45,.12); }
    .contact-main-info { position:relative; isolation:isolate; background:#172d32; }
    .contact-main-info::after { position:absolute; z-index:-1; right:-6rem; bottom:-8rem; width:19rem; height:19rem; border:1px solid rgba(255,255,255,.1); border-radius:50%; box-shadow:0 0 0 2rem rgba(255,255,255,.025),0 0 0 4rem rgba(255,255,255,.02); content:""; pointer-events:none; }
    .contact-main-kicker { letter-spacing:.16em; }
    .contact-main-info h1,.contact-main-details,.contact-main-social { position:relative; z-index:1; }
    .contact-main-label { letter-spacing:.08em; text-transform:uppercase; }
    .contact-main-index { display:inline-flex; align-items:center; gap:.5rem; font-size:.8rem; letter-spacing:.1em; white-space:nowrap; }
    .contact-main .contact-form form { display:grid; gap:1rem; }
    .contact-main .contact-form form > div { margin:0; }
    .contact-main .contact-form .label,.contact-main .contact-form label { display:block; color:var(--bs-body-color); font-size:.9rem; font-weight:600; margin-bottom:.4rem; }
    .contact-main .contact-form .required::after { content:"*"; color:var(--bs-danger); margin-left:.25rem; }
    .contact-main .contact-form input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),.contact-main .contact-form textarea,.contact-main .contact-form select { width:100%; border:1px solid #d9e0e3; border-radius:.5rem; padding:.9rem 1rem; color:var(--bs-body-color); background-color:#fbfcfc; outline:none; }
    .contact-main .contact-form input:focus,.contact-main .contact-form textarea:focus,.contact-main .contact-form select:focus { border-color:var(--bs-primary); background-color:#fff; box-shadow:0 0 0 .22rem rgba(var(--bs-primary-rgb),.13); }
    .contact-main .contact-form textarea { min-height:120px; resize:vertical; }
    .contact-main .contact-form button[type="submit"],.contact-main .contact-form input[type="submit"] { border:0; border-radius:50rem; padding:.8rem 1.4rem; color:#fff; background-color:#172d32; font-weight:700; }
    .contact-main .contact-form .mp-formfield-validation-message { display:block; color:var(--bs-danger); font-size:.875rem; margin-top:.35rem; }
    .contact-main .contact-form .mp-form-message { display:block; margin-top:1rem; color:var(--bs-primary); font-weight:600; }
    .contact-main .contact-form .g-recaptcha { margin-top:.5rem; }
    .contact-main-map-art { position:relative; height:170px; background-color:#e8eeeb; background-image:linear-gradient(25deg,transparent 46%,#fff 47%,#fff 51%,transparent 52%),linear-gradient(155deg,transparent 40%,#fff 41%,#fff 45%,transparent 46%),linear-gradient(90deg,transparent 70%,#d2ecdf 70%),repeating-linear-gradient(0deg,transparent 0 48px,rgba(255,255,255,.65) 49px 53px); }
    .contact-main-map-art::before { content:""; position:absolute; top:42%; left:58%; width:24px; height:24px; border:7px solid #dc3545; border-radius:50% 50% 50% 0; background:#fff; transform:rotate(-45deg); }
  </style>
  <div class="container py-2">
    <div class="contact-main-frame row g-0">
      <div class="col-12 col-lg-5 contact-main-info text-white p-4 p-lg-5"><p class="contact-main-kicker small text-uppercase fw-bold text-white-50 mb-4">A good place to start</p><h1 class="display-5 fw-bold mb-4">Let’s build something meaningful.</h1><p class="lead text-white-50 mb-5">Have a question, an idea, or a project in mind? We’re here to listen and help you plan a clear next step.</p><div class="contact-main-details pt-4 border-top border-white border-opacity-25"><h2 class="h6 text-uppercase fw-bold mb-4">Contact Information</h2><ul class="list-unstyled d-grid gap-4 mb-0"><li class="d-flex align-items-start gap-3"><i class="bi bi-geo-alt fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Visit</span><span>123 Example Street, Anytown</span></div></li><li class="d-flex align-items-start gap-3"><i class="bi bi-envelope fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Email</span><a class="text-white text-decoration-none" href="mailto:hello@example.com">hello@example.com</a></div></li><li class="d-flex align-items-start gap-3"><i class="bi bi-telephone fs-5 text-info" aria-hidden="true"></i><div><span class="contact-main-label d-block small text-white-50 mb-1">Call</span><a class="text-white text-decoration-none" href="tel:+15550102020">(555) 010-2020</a></div></li></ul></div><div class="contact-main-social d-flex flex-wrap gap-3 mt-4 pt-4 border-top border-white border-opacity-25"><a class="text-white fs-5" href="#" aria-label="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a><a class="text-white fs-5" href="#" aria-label="Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a><a class="text-white fs-5" href="#" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a></div><div class="contact-main-map-art rounded-3 overflow-hidden shadow-sm mt-4" role="img" aria-label="Illustrated map preview"></div></div>
      <div class="col-12 col-lg-7 contact-main-form bg-white p-4 p-lg-5"><div class="contact-main-form-heading d-flex justify-content-between align-items-start gap-3 mb-4"><div><p class="small text-primary text-uppercase fw-bold mb-2">Tell us a little about it</p><h2 class="h2 fw-bold text-dark mb-0">Let’s talk.</h2></div><span class="contact-main-index text-secondary" aria-hidden="true">01 <i class="bi bi-arrow-down-right"></i></span></div><p class="text-secondary mb-4">Share a few details and we’ll follow up with a helpful next step.</p><div class="contact-form"><form><div><label class="label required" for="contactMainPreviewName">Your name</label><input id="contactMainPreviewName" type="text" placeholder="Your name"></div><div><label class="label required" for="contactMainPreviewEmail">Email address</label><input id="contactMainPreviewEmail" type="email" placeholder="you@example.com"></div><div><label class="label" for="contactMainPreviewMessage">What can we help with?</label><textarea id="contactMainPreviewMessage" placeholder="A few details about your project"></textarea></div><button type="submit">Send an inquiry <i class="bi bi-arrow-up-right ms-2" aria-hidden="true"></i></button></form></div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    title: 'Let’s build something meaningful.',
    description: 'Have a question, an idea, or a project in mind? We’re here to listen and help you plan a clear next step.',
    form: '',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.86532738521!2d-86.0088088!3d39.9667636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8814ad53b86ad1ed%3A0x82fc68614c4bcce0!2sMarketpath%2C%20Inc.!5e0!3m2!1sen!2sec!4v1791993682062!5m2!1sen!2sec',
  },
};
