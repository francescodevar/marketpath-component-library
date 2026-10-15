import { createFooterTheme } from '../../../lib/footer-theme.js';

export default {
  id: 'footer-01',
  name: 'Simple Settings Footer',
  category: 'footer',
  prefix: 'footer_01_',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  theme: createFooterTheme('light', 'bg-dark'),
  description: 'A simple light footer that shares its logo, about text, links, and contact details from Page Settings.',
  tags: ['navigation', 'contact', 'settings'],
  template: `</main>
<footer data-footer-theme="light" data-footer-theme-role="root" class="bg-light text-dark">
  <div class="py-5">
    <div class="container">
    <div class="row justify-content-between g-4">
      <div class="col-12 col-lg-4">
        {%- if settings.footer_logo.is_valid -%}
        {%- img settings.footer_logo preset:"300x300-max webp" alt:settings.footer_logo.alt|default:'Company Logo' class:"img-fluid mb-3" style:"max-height:90px;max-width:260px;width:auto;object-fit:contain;" link:false -%}
        {%- else -%}
        <h2 class="h3 fw-bold">{{ site.name }}</h2>
        {%- endif -%}
        {%- if settings.footer_about.is_valid -%}
        <p class="text-secondary mt-3" data-footer-theme-role="muted">{{ settings.footer_about }}</p>
        {%- endif -%}
      </div>

      {%- if settings.footer_menu_1.is_valid -%}
      <div class="col-6 col-lg-auto">
        <h3 class="h6 fw-semibold mb-3">Explore</h3>
        <ul class="list-unstyled mb-0">
          {%- for footerLink in settings.footer_menu_1 -%}
          <li class="mb-2">
            <a class="link-dark text-decoration-none" data-footer-theme-role="link" href="{{ footerLink.href }}"{% if footerLink.open_in_new_tab %} target="_blank" rel="noopener"{% endif %}>{{ footerLink.name }}</a>
          </li>
          {%- endfor -%}
        </ul>
      </div>
      {%- endif -%}

      {%- if settings.company_address.is_valid or settings.company_phone.is_valid or settings.company_email.is_valid or settings.company_hours.is_valid -%}
      <div class="col-6 col-lg-auto">
        <h3 class="h6 fw-semibold mb-3">Contact</h3>
        <ul class="list-unstyled mb-0">
          {%- if settings.company_address.is_valid -%}
          <li class="mb-2 text-secondary" data-footer-theme-role="muted">{{ settings.company_address }}</li>
          {%- endif -%}
          {%- if settings.company_phone.is_valid -%}
          <li class="mb-2"><a class="link-dark text-decoration-none" data-footer-theme-role="link" href="tel:{{ settings.company_phone.value | escape }}">{{ settings.company_phone }}</a></li>
          {%- endif -%}
          {%- if settings.company_email.is_valid -%}
          <li class="mb-2 d-flex align-items-start">
            <i class="bi bi-envelope-fill me-3 flex-shrink-0" aria-hidden="true"></i>
            <div class="flex-grow-1" style="min-width:0;">
              <a href="mailto:{{ settings.company_email.value | escape }}" class="link-dark text-decoration-none text-break" data-footer-theme-role="link">{{ settings.company_email }}</a>
            </div>
          </li>
          {%- endif -%}
          {%- if settings.company_hours.is_valid -%}
          <li class="mb-2 text-secondary" data-footer-theme-role="muted">{{ settings.company_hours }}</li>
          {%- endif -%}
        </ul>
      </div>
      {%- endif -%}
    </div>
    </div>
  </div>

  <div class="bg-dark text-white py-3 text-center small" data-footer-theme-role="bar">
    Copyright &copy; {{ request.year }} - {{ site.name }}
  </div>
</footer>`,
  fields: [],
  notes: [
    'This footer has no Page Custom Fields. It reads footer_logo, footer_about, footer_menu_1, and contact details from the shared Page Settings datastore.',
    'Choose Light or Dark in the preview or Template tab. Astro switches only the marked Bootstrap color classes in the displayed and copied markup; no extra Liquid theme variables are required.',
    'The shared header must load Page Settings and assign the settings object before this footer renders.',
    'Bootstrap Icons CSS must be available for the email icon.',
    'Use View Datastore to inspect or copy the Page Settings schema. For the extended footer with social media, use footer-02.',
    'Closes the main element opened by the site header before rendering the footer. The surrounding MPSS1 footer remains responsible for closing body and html.',
  ],
  preview: {
    html: `<footer data-footer-theme="light" data-footer-theme-role="root" class="bg-light text-dark">
  <div class="py-5">
    <div class="container">
    <div class="row justify-content-between g-4">
      <div class="col-12 col-lg-4">
        <div class="h3 fw-bold text-primary mb-3">Example</div>
        <p class="text-secondary mt-3" data-footer-theme-role="muted">A little about our company and the work we do for our community.</p>
      </div>
      <div class="col-6 col-lg-auto">
        <h3 class="h6 fw-semibold mb-3">Explore</h3>
        <ul class="list-unstyled mb-0">
          <li class="mb-2"><a class="link-dark text-decoration-none" data-footer-theme-role="link" href="#">About us</a></li>
          <li class="mb-2"><a class="link-dark text-decoration-none" data-footer-theme-role="link" href="#">Our services</a></li>
          <li class="mb-2"><a class="link-dark text-decoration-none" data-footer-theme-role="link" href="#">Contact</a></li>
        </ul>
      </div>
      <div class="col-6 col-lg-auto">
        <h3 class="h6 fw-semibold mb-3">Contact</h3>
        <ul class="list-unstyled mb-0">
          <li class="mb-2 text-secondary" data-footer-theme-role="muted">123 Example Street, Anytown</li>
          <li class="mb-2"><a class="link-dark text-decoration-none" data-footer-theme-role="link" href="tel:+15550102020">(555) 010-2020</a></li>
          <li class="mb-2 d-flex align-items-start">
            <i class="bi bi-envelope-fill me-3 flex-shrink-0" aria-hidden="true"></i>
            <div class="flex-grow-1" style="min-width:0;"><a class="link-dark text-decoration-none text-break" data-footer-theme-role="link" href="mailto:hello@example.com">hello@example.com</a></div>
          </li>
          <li class="mb-2 text-secondary" data-footer-theme-role="muted">Monday–Friday, 8:00 a.m.–5:00 p.m.</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
  <div class="bg-dark text-white py-3 text-center small" data-footer-theme-role="bar">
    Copyright © 2026 - Example
  </div>
</footer>`,
  },
  mockData: {},
};
