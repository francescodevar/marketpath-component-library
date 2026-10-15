import { createFooterTheme } from '../../../lib/footer-theme.js';

export default {
  id: 'footer-03',
  name: 'Information & Contact Footer',
  category: 'footer',
  prefix: 'footer_03_',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  theme: createFooterTheme('light', 'bg-dark', 'bg-white'),
  description: 'A three-column footer with logo and about text, an information menu, contact info, and a copyright bar.',
  tags: ['footer', 'contact', 'information', 'settings'],
  template: `{% comment %}
    This outputs the Footer Logo and About, Information menu, and Contact Info above the copyright bar.
    Vars
    settings - It is defined on the header
    menu_title - Meant to customize the footer menu title
    contact_info_title - Meant to customize the contact info title
{% endcomment -%}

{% var menu_title = menu_title | default:"Information" %}
{% var contact_info_title = contact_info_title | default:"Contact Info" %}

</main>
<footer data-footer-theme="light" data-footer-theme-role="root" class="bg-white text-dark">
  <div class="py-5">
    <div class="container">
      <div class="row justify-content-between g-4 g-lg-5">
        <div class="col-12 col-lg-5">
          {% if settings.footer_logo.is_valid %}
          {% img settings.footer_logo preset:"300x300-max webp" alt:settings.footer_logo.alt|default:'Company Logo' class:"img-fluid mb-3" style:"max-height:90px;max-width:260px;width:auto;object-fit:contain;" link:false %}
          {% endif %}
          {% if settings.footer_about is_valid %}
          <p class="text-secondary mb-0" data-footer-theme-role="muted">{{ settings.footer_about }}</p>
          {% endif %}
        </div>

        {% if settings.footer_menu_1.is_valid %}
        <div class="col-6 col-lg-auto">
          {% if menu_title is_valid %}
          <h2 class="h3 text-dark mb-4 fw-semibold" data-footer-theme-role="heading">{{ menu_title }}</h2>
          {% endif %}
          {%- for footerLink in settings.footer_menu_1 -%}
          <div class="mb-3">
            <a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="{{ footerLink.href }}"{% if footerLink.open_in_new_tab %} target="_blank" rel="noopener"{% endif %}>
              <i class="bi bi-caret-right me-3" aria-hidden="true"></i>{{ footerLink.name }}
            </a>
          </div>
          {%- endfor -%}
        </div>
        {% endif %}

        <div class="col-6 col-lg-auto">
          {% if contact_info_title is_valid %}
          <h2 class="h3 text-dark mb-4 fw-semibold" data-footer-theme-role="heading">{{ contact_info_title }}</h2>
          {% endif %}

          {% if settings.company_address.is_valid %}
          <div class="mb-3 d-flex align-items-start">
            <i class="bi bi-geo-alt-fill me-3" aria-hidden="true"></i>
            <div class="text-secondary" data-footer-theme-role="muted">{{ settings.company_address }}</div>
          </div>
          {% endif %}

          {% if settings.company_phone.is_valid %}
          <div class="mb-3 d-flex align-items-start">
            <i class="bi bi-telephone-fill me-3" aria-hidden="true"></i>
            <div><a href="tel:{{ settings.company_phone.value | escape }}" class="text-secondary text-decoration-none" data-footer-theme-role="muted">{{ settings.company_phone }}</a></div>
          </div>
          {% endif %}

          {% if settings.company_hours.is_valid %}
          <div class="mb-3 d-flex align-items-start">
            <i class="bi bi-clock-fill me-3" aria-hidden="true"></i>
            <div class="text-secondary" data-footer-theme-role="muted">{{ settings.company_hours }}</div>
          </div>
          {% endif %}

          {% if settings.company_email.is_valid %}
          <div class="mb-3 d-flex align-items-start">
            <i class="bi bi-envelope-fill me-3 flex-shrink-0" aria-hidden="true"></i>
            <div class="flex-grow-1" style="min-width:0;">
              <a href="mailto:{{ settings.company_email.value | escape }}" class="text-secondary text-decoration-none text-break" data-footer-theme-role="muted">{{ settings.company_email }}</a>
            </div>
          </div>
          {% endif %}
        </div>
      </div>
    </div>
  </div>

  <div class="bg-dark text-white py-3 text-center small" data-footer-theme-role="bar">
    Copyright &copy; {{ request.year }} - {{ site.name }}
    <span class="d-none d-md-inline mx-2">|</span>
    <a href="https://www.marketpath.com" target="_blank" rel="noopener" class="text-decoration-none text-reset">Powered by Marketpath CMS</a>
  </div>
</footer>
  </body>
</html>`,
  fields: [],
  notes: [
    'This footer has no Page Custom Fields. It reads footer_logo, footer_about, footer_menu_1, and the company address, phone, hours, and email from the shared Page Settings datastore.',
    'Choose Light or Dark in the preview or Template tab. Astro switches only the marked Bootstrap color classes in the displayed and copied markup, including the inverted copyright bar.',
    'Closes the main element opened by the site header before rendering the footer, then closes body and html. Use it as the site footer template rather than as a standalone page section.',
    'The menu and contact headings can be overridden with the Liquid variables menu_title and contact_info_title; they default to Information and Contact Info.',
    'Use View Datastore to inspect or copy the Page Settings schema. Bootstrap Icons CSS must be available for the menu and contact icons.',
  ],
  preview: {
    html: `<footer data-footer-theme="light" data-footer-theme-role="root" class="bg-white text-dark">
  <div class="py-5">
    <div class="container">
      <div class="row justify-content-between g-4 g-lg-5">
        <div class="col-12 col-lg-5">
          <div class="mb-3 fw-bold fs-2 text-primary">Example</div>
          <p class="text-secondary mb-0" data-footer-theme-role="muted">Example provides high-quality home improvement services, including windows, doors, and outdoor living. We serve residential customers throughout the surrounding communities.</p>
        </div>
        <div class="col-6 col-lg-auto">
          <h2 class="h3 text-dark mb-4 fw-semibold" data-footer-theme-role="heading">Information</h2>
          <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right me-3" aria-hidden="true"></i>About</a></div>
          <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right me-3" aria-hidden="true"></i>Windows</a></div>
          <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right me-3" aria-hidden="true"></i>Doors</a></div>
          <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right me-3" aria-hidden="true"></i>Featured Projects</a></div>
          <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none text-secondary" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right me-3" aria-hidden="true"></i>Contact</a></div>
        </div>
        <div class="col-6 col-lg-auto">
          <h2 class="h3 text-dark mb-4 fw-semibold" data-footer-theme-role="heading">Contact Info</h2>
          <div class="mb-3 d-flex align-items-start"><i class="bi bi-geo-alt-fill me-3" aria-hidden="true"></i><div class="text-secondary" data-footer-theme-role="muted">123 Example Street, Anytown, ST 00000</div></div>
          <div class="mb-3 d-flex align-items-start"><i class="bi bi-telephone-fill me-3" aria-hidden="true"></i><div><a href="tel:+15550102020" class="text-secondary text-decoration-none" data-footer-theme-role="muted">(555) 010-2020</a></div></div>
          <div class="mb-3 d-flex align-items-start"><i class="bi bi-clock-fill me-3" aria-hidden="true"></i><div class="text-secondary" data-footer-theme-role="muted">Mon–Fri: 8:00 a.m. – 5:00 p.m.</div></div>
          <div class="mb-3 d-flex align-items-start"><i class="bi bi-envelope-fill me-3 flex-shrink-0" aria-hidden="true"></i><div class="flex-grow-1" style="min-width:0;"><a href="mailto:hello@example.com" class="text-secondary text-decoration-none text-break" data-footer-theme-role="muted">hello@example.com</a></div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-dark text-white py-3 text-center small" data-footer-theme-role="bar">
    Copyright © 2026 - Example
    <span class="d-none d-md-inline mx-2">|</span>
    <a href="https://www.marketpath.com" target="_blank" rel="noopener" class="text-decoration-none text-reset">Powered by Marketpath CMS</a>
  </div>
</footer>`,
  },
  mockData: {},
};
