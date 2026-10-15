import { createFooterTheme } from '../../../lib/footer-theme.js';

export default {
  id: 'footer-02',
  name: 'Settings Contact Footer',
  category: 'footer',
  prefix: 'footer_02_',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  theme: createFooterTheme('dark', 'bg-secondary'),
  description: 'A four-column footer driven by the shared Page Settings datastore, with contact details, menus, social links, and copyright.',
  tags: ['footer', 'contact', 'social', 'settings'],
  template: `{% comment %}
    This outputs the Footer About, Contact Info, and Menu Options above the footer.
    Vars
    settings - It is defined on the header
    menu_title - Meant to customize the footer menu title
    contact_info_title - Meant to customize the contact info title
{% endcomment -%}

{% var menu_title = menu_title | default:"Services" %}
{% var contact_info_title = contact_info_title | default:"Contact Us" %}

</main>
<footer data-footer-theme="dark" data-footer-theme-role="root" class="bg-secondary text-white">
  <div class="py-5">
    <div class="container">
    <div class="row justify-content-between g-4 g-lg-5">
      <div class="col-12 col-lg-4">
        {% if settings.footer_logo.is_valid %}
        {% img settings.footer_logo preset:"300x300-max webp" alt:settings.footer_logo.alt|default:'Company Logo' class:"img-fluid mb-3" style:"max-height:90px;max-width:260px;width:auto;object-fit:contain;" link:false %}
        {% endif %}
        {% if settings.footer_about is_valid %}
        <p class="text-white opacity-75 mb-0 pe-lg-3" data-footer-theme-role="muted">{{ settings.footer_about }}</p>
        {% endif %}
      </div>

      {% if settings.footer_menu_1.is_valid %}
      <div class="col-6 col-lg-auto">
        {% if menu_title is_valid %}
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">{{ menu_title }}</h2>
        {% endif %}
        {%- for footerLink in settings.footer_menu_1 -%}
        <div class="mb-3">
          <a class="d-inline-flex align-items-center text-decoration-none fs-6 text-white opacity-75" data-footer-theme-role="muted" href="{{ footerLink.href }}"{% if footerLink.open_in_new_tab %} target="_blank" rel="noopener"{% endif %}>
            <i class="bi bi-caret-right-fill text-primary me-2 fs-6" aria-hidden="true"></i>{{ footerLink.name }}
          </a>
        </div>
        {%- endfor -%}
      </div>
      {% endif %}

      <div class="col-6 col-lg-auto">
        {% if contact_info_title is_valid %}
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">{{ contact_info_title }}</h2>
        {% endif %}

        {% if settings.company_address.is_valid %}
        <div class="mb-3 d-flex align-items-start">
          <i class="bi bi-geo-alt-fill me-3 fs-5" aria-hidden="true"></i>
          <div class="text-white opacity-75" data-footer-theme-role="muted">{{ settings.company_address }}</div>
        </div>
        {% endif %}

        {% if settings.company_phone.is_valid %}
        <div class="mb-3 d-flex align-items-start">
          <i class="bi bi-telephone-fill me-3 fs-5" aria-hidden="true"></i>
          <div><a href="tel:{{ settings.company_phone.value | escape }}" class="text-white text-decoration-none opacity-75" data-footer-theme-role="muted">{{ settings.company_phone }}</a></div>
        </div>
        {% endif %}

        {% if settings.company_email.is_valid %}
        <div class="mb-3 d-flex align-items-start">
          <i class="bi bi-envelope-fill me-3 fs-5 flex-shrink-0" aria-hidden="true"></i>
          <div class="flex-grow-1" style="min-width:0;"><a href="mailto:{{ settings.company_email.value | escape }}" class="text-white text-decoration-none opacity-75 text-break" data-footer-theme-role="muted">{{ settings.company_email }}</a></div>
        </div>
        {% endif %}

        {% if settings.company_hours.is_valid %}
        <div class="mb-3 d-flex align-items-start">
          <i class="bi bi-clock-fill me-3 fs-5" aria-hidden="true"></i>
          <div class="text-white opacity-75" data-footer-theme-role="muted">{{ settings.company_hours }}</div>
        </div>
        {% endif %}
      </div>

      {% if settings.company_social_media.is_valid %}
      <div class="col-12 col-lg-auto">
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">Follow Us</h2>
        <div class="d-flex flex-wrap gap-3">
          {% for social in settings.company_social_media %}
          <a href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener" title="{{ social.social_media_platform.value | escape }}" class="text-decoration-none m-0 text-white" data-footer-theme-role="link">
            <i class="bi bi-{{ social.social_media_platform.value | downcase }} fs-3" aria-hidden="true"></i>
          </a>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
    </div>
  </div>

  <div class="bg-light text-dark py-3 text-center small" data-footer-theme-role="bar">
    Copyright &copy; {{ request.year }} - {{ site.name }}
    <span class="d-none d-md-inline mx-2">|</span>
    <a href="https://www.marketpath.com" target="_blank" rel="noopener" class="text-decoration-none text-reset">Powered by Marketpath CMS</a>
  </div>
</footer>
  </body>
</html>`,
  fields: [],
  notes: [
    'This footer reads its logo, about text, footer menu, contact details, hours, and social fieldset from Page Settings; settings must already be assigned by the shared header.',
    'Choose Light or Dark in the preview or Template tab. Astro switches only the marked Bootstrap color classes in the displayed and copied markup; no extra Liquid theme variables are required.',
    'Closes the main element opened by the site header before rendering the footer, then closes body and html. Use it as the site footer template rather than as a standalone page section.',
    'The menu and contact headings can be overridden with the Liquid variables menu_title and contact_info_title; they default to Services and Contact Us.',
    'This component shares the Page Settings schema. Use View Datastore to inspect or copy the full settings Fields JSON.',
    'Bootstrap Icons CSS must be available for the contact and social icons.',
  ],
  preview: {
    html: `<footer data-footer-theme="dark" data-footer-theme-role="root" class="bg-secondary text-white">
  <div class="py-5">
    <div class="container">
    <div class="row justify-content-between g-4 g-lg-5">
      <div class="col-12 col-lg-4">
        <div class="mb-3 fw-bold fs-3">Example</div>
        <p class="text-white opacity-75 mb-0 pe-lg-3" data-footer-theme-role="muted">A little about our company and the work we do for our community.</p>
      </div>
      <div class="col-6 col-lg-auto">
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">Services</h2>
        <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none fs-6 text-white opacity-75" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right-fill text-primary me-2 fs-6" aria-hidden="true"></i>Home improvements</a></div>
        <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none fs-6 text-white opacity-75" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right-fill text-primary me-2 fs-6" aria-hidden="true"></i>Windows and doors</a></div>
        <div class="mb-3"><a class="d-inline-flex align-items-center text-decoration-none fs-6 text-white opacity-75" data-footer-theme-role="muted" href="#"><i class="bi bi-caret-right-fill text-primary me-2 fs-6" aria-hidden="true"></i>Our projects</a></div>
      </div>
      <div class="col-6 col-lg-auto">
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">Contact Us</h2>
        <div class="mb-3 d-flex align-items-start"><i class="bi bi-geo-alt-fill me-3 fs-5" aria-hidden="true"></i><div class="opacity-75 text-white" data-footer-theme-role="muted">123 Example Street, Anytown</div></div>
        <div class="mb-3 d-flex align-items-start"><i class="bi bi-telephone-fill me-3 fs-5" aria-hidden="true"></i><div><a href="tel:+15550102020" class="text-white text-decoration-none opacity-75" data-footer-theme-role="muted">(555) 010-2020</a></div></div>
        <div class="mb-3 d-flex align-items-start"><i class="bi bi-envelope-fill me-3 fs-5 flex-shrink-0" aria-hidden="true"></i><div class="flex-grow-1" style="min-width:0;"><a href="mailto:hello@example.com" class="text-white text-decoration-none opacity-75 text-break" data-footer-theme-role="muted">hello@example.com</a></div></div>
        <div class="mb-3 d-flex align-items-start"><i class="bi bi-clock-fill me-3 fs-5" aria-hidden="true"></i><div class="opacity-75 text-white" data-footer-theme-role="muted">Monday–Friday, 8:00 a.m.–5:00 p.m.</div></div>
      </div>
      <div class="col-12 col-lg-auto">
        <h2 class="h4 text-white mb-4 fw-bold" data-footer-theme-role="heading">Follow Us</h2>
        <div class="d-flex flex-wrap gap-3">
          <a href="#" title="Facebook" class="text-decoration-none m-0 text-white link-light" data-footer-theme-role="link"><i class="bi bi-facebook fs-3" aria-hidden="true"></i></a>
          <a href="#" title="Instagram" class="text-decoration-none m-0 text-white link-light" data-footer-theme-role="link"><i class="bi bi-instagram fs-3" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
    </div>
  </div>
  <div class="bg-light text-dark py-3 text-center small" data-footer-theme-role="bar">
    Copyright © 2026 - Example
    <span class="d-none d-md-inline mx-2">|</span>
    <a href="https://www.marketpath.com" target="_blank" rel="noopener" class="text-decoration-none text-reset">Powered by Marketpath CMS</a>
  </div>
</footer>`,
  },
  mockData: {},
};
