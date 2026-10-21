export default {
  id: 'header-02',
  name: 'Header Contact Strip with Collapsible Navigation',
  category: 'header',
  prefix: 'header_02_',
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  settingsDatastoreId: 'page-settings',
  description: 'A primary contact and social strip above a responsive logo and menu row with hover dropdowns.',
  tags: ['navigation', 'contact', 'social', 'two-tier'],
  template: `{% comment %}
    Inputs:
        page_title - As per MPSS1 standards, if set, will override the default page title.
        no_header_or_footer_markup - As per MPSS1 standards, if set, will disable output of all markup in the header. It will still load the javascript and stylesheet.
        minimal_header_and_footer_content - As per MPSS1 standards, if set, will disable output of navigation menu and other markup (apart from meta properties). It will still load the javascript and stylesheet.
{% endcomment -%}
{%- add_stylesheet "/main.scss" -%}
{%- add_javascript "/bootstrap5/js/bootstrap.bundle.min.js" defer:true async:true position:'body' -%}
{%- unless no_header_or_footer_markup -%}
<!DOCTYPE html>
<html lang="en" class="h-100">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{{ site.name }}" />
    <meta property="og:title" content="{{ page_title | default:automatic_markup.title | escape }}" />
    <meta property="og:description" content="{{ automatic_markup.description | escape }}" />
    <meta property="og:url" content="{{ entity.full_url }}" />
  </head>
  <body>
    {%- datastore_items var siteDS = datastore:'Page Settings' limit:1 sort_direction:'asc' -%}
    {%- assign settings = siteDS.fetched[0].data -%}
    {%- unless minimal_header_and_footer_content -%}
    {% comment %}
    Include all Navigation, Menu, Topbars that are intended to be displayed on all pages site-wide here.
    {% endcomment %}
{%- menu mainMenu = settings.main_menu.guid -%}

<div class="sticky-top z-9999">
<div class="text-white d-none d-lg-block bg-primary">
  <div class="container d-flex justify-content-end align-items-center gap-4 py-2 small">
    {%- if settings.company_email.is_valid -%}
    <a class="text-white text-decoration-none d-flex align-items-center gap-2" href="mailto:{{ settings.company_email.value | escape }}">
      <i class="bi bi-envelope-at" aria-hidden="true"></i>
      <span>{{ settings.company_email }}</span>
    </a>
    {%- endif -%}

    {%- if settings.header_cta_text_title.is_valid -%}
    <a class="text-white text-decoration-none d-flex align-items-center gap-2" href="{% if settings.header_cta_link.is_valid %}{{ settings.header_cta_link.value | escape }}{% else %}tel:{{ settings.header_cta_text_title.value | escape }}{% endif %}">
      <i class="bi bi-telephone" aria-hidden="true"></i>
      <span>{{ settings.header_cta_text_title }}</span>
    </a>
    {%- endif -%}

    {%- if settings.company_social_media.is_valid -%}
      {%- for social in settings.company_social_media -%}
        {%- if social.social_media_link.is_valid -%}
        <a class="text-white text-decoration-none" href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener" aria-label="{{ social.social_media_platform }}">
          {%- if social.social_media_platform.value == "Facebook" -%}
          <i class="bi bi-facebook" aria-hidden="true"></i>
          {%- elsif social.social_media_platform.value == "Instagram" -%}
          <i class="bi bi-instagram" aria-hidden="true"></i>
          {%- elsif social.social_media_platform.value == "YouTube" -%}
          <i class="bi bi-youtube" aria-hidden="true"></i>
          {%- elsif social.social_media_platform.value == "LinkedIn" -%}
          <i class="bi bi-linkedin" aria-hidden="true"></i>
          {%- elsif social.social_media_platform.value == "X" -%}
          <i class="bi bi-twitter-x" aria-hidden="true"></i>
          {%- elsif social.social_media_platform.value == "TikTok" -%}
          <i class="bi bi-tiktok" aria-hidden="true"></i>
          {%- endif -%}
        </a>
        {%- endif -%}
      {%- endfor -%}
    {%- endif -%}
  </div>
</div>

<nav class="navbar navbar-expand-lg bg-white border-bottom py-3">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center me-auto" href="/">
    {%- img settings.logo_image preset:"300x300-max webp" alt:settings.logo_image.alt|default:'Company Logo' id:"navbarLogo" class:"img-fluid" style:"height:auto;max-height:64px;width:auto;max-width:100%;object-fit:contain;" link:false -%}
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainNavbar">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
        {%- for navItem in mainMenu.items -%}
        {%- if navItem.items.size > 0 -%}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-dark opacity-75" href="{{ navItem.href.value | escape }}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ navItem.name }}
          </a>
          <ul class="dropdown-menu">
            {%- for sub in navItem.items -%}
            <li><a class="dropdown-item" href="{{ sub.href.value | escape }}">{{ sub.name }}</a></li>
            {%- endfor -%}
          </ul>
        </li>
        {%- else -%}
        <li class="nav-item">
          <a class="nav-link text-dark opacity-75" href="{{ navItem.href.value | escape }}">{{ navItem.name }}</a>
        </li>
        {%- endif -%}
        {%- endfor -%}

        <li class="nav-item ms-lg-2">
          <a class="nav-link text-primary" href="/search" aria-label="Search">
            <i class="bi bi-search" aria-hidden="true"></i>
            <span class="d-lg-none ms-2">Search</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</div>
<main>
    {%- endunless -%}
{%- endunless %}

{% add_stylesheet inline %}
.sticky-top.z-9999 {
  z-index: 9999;
}

@media (min-width: 992px) {
  .navbar .dropdown:hover > .dropdown-menu {
    display: block;
  }
}
{% end_stylesheet %}`,
  fields: [],
  notes: [
    'The Template panel contains the complete MPSS1 header scaffold, Settings datastore lookup, navbar markup, and inline hover CSS as one copyable block. It opens <main> after the navigation; the site footer closes it. A sticky-top wrapper keeps both header rows fixed together while scrolling.',
    'The header loads the shared Page Settings datastore by name. The top strip uses company_email, header_cta_text_title/header_cta_link, and the company_social_media fieldset.',
    'The top contact strip is hidden below the Bootstrap lg breakpoint. The header uses the Marketpath img tag for logo_image and the selected main_menu, and reveals dropdown menus on hover at desktop widths.',
    'The logo keeps its intrinsic aspect ratio and is capped at 64px high to fit the navbar without stretching.',
    'Bootstrap Icons CSS must be available for the contact, social, and search icons. The Bootstrap bundle is loaded by the MPSS1 scaffold for collapse and dropdown behavior.',
  ],
  preview: {
    html: `<div class="sticky-top z-9999">
<div class="text-white d-none d-lg-block bg-primary">
  <div class="container d-flex justify-content-end align-items-center gap-4 py-2 small">
    <a class="text-white text-decoration-none d-flex align-items-center gap-2" href="mailto:hello@example.com"><i class="bi bi-envelope-at" aria-hidden="true"></i><span>hello@example.com</span></a>
    <a class="text-white text-decoration-none d-flex align-items-center gap-2" href="tel:+15550102020"><i class="bi bi-telephone" aria-hidden="true"></i><span>(555) 010-2020</span></a>
    <a class="text-white text-decoration-none" href="#" aria-label="Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a>
    <a class="text-white text-decoration-none" href="#" aria-label="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a>
  </div>
</div>
<nav class="navbar navbar-expand-lg bg-white border-bottom py-3">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center me-auto" href="/" aria-label="Home"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='80' viewBox='0 0 240 80'%3E%3Cpath d='M8 40 37 12l29 28v30H8z' fill='%230d6efd'/%3E%3Cpath d='M29 70V44h16v26M8 40h58' fill='none' stroke='%23fff' stroke-width='4'/%3E%3Ctext x='78' y='54' font-family='sans-serif' font-size='34' font-weight='700' fill='%23212529'%3EExample%3C/text%3E%3C/svg%3E" alt="Example" class="img-fluid" style="height:auto;max-height:64px;width:auto;max-width:100%;object-fit:contain;"></a>
    <button class="navbar-toggler" type="button" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse show" id="mainNavbar">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
        <li class="nav-item"><a class="nav-link text-dark opacity-75" href="#">Home</a></li>
        <li class="nav-item dropdown"><a class="nav-link dropdown-toggle text-dark opacity-75" href="#">About Us</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="#">Our story</a></li></ul></li>
        <li class="nav-item dropdown"><a class="nav-link dropdown-toggle text-dark opacity-75" href="#">Services</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="#">Our services</a></li></ul></li>
        <li class="nav-item dropdown"><a class="nav-link dropdown-toggle text-dark opacity-75" href="#">Our Work</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="#">Recent projects</a></li></ul></li>
        <li class="nav-item"><a class="nav-link text-dark opacity-75" href="#">Contact</a></li>
        <li class="nav-item ms-lg-2"><a class="nav-link text-primary" href="/search" aria-label="Search"><i class="bi bi-search" aria-hidden="true"></i></a></li>
      </ul>
    </div>
  </div>
</nav>
</div>`,
  },
  mockData: {},
};
