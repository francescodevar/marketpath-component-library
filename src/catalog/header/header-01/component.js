export default {
  id: 'header-01',
  name: 'Header Sticky Offcanvas',
  category: 'header',
  prefix: 'header_01_',
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  description: 'A sticky, responsive site header with a Settings-driven logo, nested menu, and contact call to action.',
  tags: ['navigation', 'offcanvas', 'settings'],
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
{%- add_javascript "/theme/navbar.js" position:'body' -%}
{%- menu mainMenu = settings.main_menu.guid -%}

<nav class="navbar navbar-expand-xl py-0 navbar-light sticky-top shadow-sm bg-white" id="mainNavbar">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="/" aria-label="Home">
      {%- if settings.logo_image.is_valid -%}
      <img src="{% image_url = settings.logo_image | preset:'300x300-max webp' %}" alt="Company Home" id="navbarLogo" class="img-fluid" style="width:auto; height:auto; max-width:100%; max-height:64px; object-fit:contain; transition: max-height 0.3s ease;">
      {%- else -%}
      <span class="fw-bold fs-4 text-dark">Example</span>
      {%- endif -%}
    </a>

    <button class="navbar-toggler d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Open navigation menu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="d-none d-xl-flex collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mx-auto gap-xl-4">
        {%- for navItem in mainMenu.items -%}
        {%- if navItem.items.size > 0 -%}
        <li class="nav-item small dropdown">
          <a class="nav-link text-uppercase fw-semibold text-dark dropdown-toggle" href="{{ navItem.href.value | escape }}" data-bs-toggle="dropdown" aria-expanded="false">{{ navItem.name }}</a>
          <ul class="dropdown-menu">
            {%- for sub in navItem.items -%}
            <li><a class="dropdown-item" href="{{ sub.href.value | escape }}">{{ sub.name }}</a></li>
            {%- endfor -%}
          </ul>
        </li>
        {%- else -%}
        <li class="nav-item small">
          <a class="nav-link text-uppercase fw-semibold text-dark" href="{{ navItem.href.value | escape }}">{{ navItem.name }}</a>
        </li>
        {%- endif -%}
        {%- endfor -%}
      </ul>

      {%- if settings.header_cta_link.is_valid -%}
      <div class="d-flex align-items-center gap-3">
        <a href="{{ settings.header_cta_link.value | escape }}" class="d-flex align-items-center text-decoration-none">
          <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-25" style="width:55px; height:55px;">
            <i class="bi bi-telephone-outbound-fill text-primary" style="font-size:1.5rem;" aria-hidden="true"></i>
          </div>
          <div class="d-flex flex-column ps-3">
            {%- if settings.header_cta_text_pretitle.is_valid -%}
            <span class="text-secondary small fw-medium">{{ settings.header_cta_text_pretitle }}</span>
            {%- endif -%}
            {%- if settings.header_cta_text_title.is_valid -%}
            <span class="fw-bold text-dark fs-5">{{ settings.header_cta_text_title }}</span>
            {%- endif -%}
          </div>
        </a>
      </div>
      {%- endif -%}
    </div>

    <div class="offcanvas offcanvas-end d-xl-none" role="dialog" aria-modal="true" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" style="max-width:340px;">
      <div class="offcanvas-header">
        <h2 class="h5 offcanvas-title mb-0" id="offcanvasNavbarLabel">Menu</h2>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav flex-grow-1">
          {%- for navItem in mainMenu.items -%}
          {%- if navItem.items.size > 0 -%}
          <li class="nav-item small dropdown">
            <a class="nav-link dropdown-toggle text-uppercase fw-semibold text-dark" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ navItem.name }}</a>
            <ul class="dropdown-menu">
              {%- for sub in navItem.items -%}
              <li><a class="dropdown-item" href="{{ sub.href.value | escape }}">{{ sub.name }}</a></li>
              {%- endfor -%}
            </ul>
          </li>
          {%- else -%}
          <li class="nav-item">
            <a class="nav-link text-uppercase fw-semibold text-dark" href="{{ navItem.href.value | escape }}">{{ navItem.name }}</a>
          </li>
          {%- endif -%}
          {%- endfor -%}
        </ul>

        {%- if settings.header_cta_link.is_valid -%}
        <div class="d-flex align-items-center gap-3 mt-4 pt-3 border-top">
          <a href="{{ settings.header_cta_link.value | escape }}" class="d-flex align-items-center text-decoration-none gap-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-25" style="width:55px; height:55px;">
              <i class="bi bi-telephone-outbound-fill text-primary" style="font-size:1.5rem;" aria-hidden="true"></i>
            </div>
            <div class="d-flex flex-column">
              {%- if settings.header_cta_text_pretitle.is_valid -%}
              <span class="text-secondary small fw-medium">{{ settings.header_cta_text_pretitle }}</span>
              {%- endif -%}
              {%- if settings.header_cta_text_title.is_valid -%}
              <span class="fw-bold text-dark fs-5">{{ settings.header_cta_text_title }}</span>
              {%- endif -%}
            </div>
          </a>
        </div>
        {%- endif -%}
      </div>
    </div>
  </div>
</nav>
<main>
    {%- endunless -%}
{%- endunless %}`,
  fields: [],
  notes: [
    'The Template panel contains the complete MPSS1 shared-header scaffold and navigation markup at the navigation comment, so it can be copied as one block. It opens <main> immediately after navigation; the site footer closes it. The datastore_items call uses the shared Page Settings datastore name.',
    'The logo keeps its intrinsic aspect ratio and is capped at 64px high so it does not stretch or force a tall navbar. The header reads logo_image, main_menu, and header_cta_* from settings = siteDS.fetched[0].data, so it has no page Custom Fields. settings.main_menu.guid is the selected menu reference, separate from the Settings datastore GUID.',
    'The desktop and offcanvas navigation both render nested menu items. Bootstrap bundle JavaScript must be available site-wide for the offcanvas and dropdowns.',
    'The theme navbar script is loaded from /theme/navbar.js. Bootstrap Icons CSS is needed for the telephone icon.',
  ],
  preview: {
    html: `<nav class="navbar navbar-expand-xl py-0 navbar-light sticky-top shadow-sm bg-white" id="mainNavbar">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="/" aria-label="Home">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='80' viewBox='0 0 240 80'%3E%3Cpath d='M8 40 37 12l29 28v30H8z' fill='%230d6efd'/%3E%3Cpath d='M29 70V44h16v26M8 40h58' fill='none' stroke='%23fff' stroke-width='4'/%3E%3Ctext x='78' y='54' font-family='sans-serif' font-size='34' font-weight='700' fill='%23212529'%3EExample%3C/text%3E%3C/svg%3E" alt="Example" class="img-fluid" style="width:auto; height:auto; max-width:100%; max-height:64px; object-fit:contain;">
    </a>
    <button class="navbar-toggler d-xl-none" type="button" aria-label="Open navigation menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="d-none d-xl-flex collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mx-auto gap-xl-4">
        <li class="nav-item small"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">Home</a></li>
        <li class="nav-item small dropdown">
          <a class="nav-link text-uppercase fw-semibold text-dark dropdown-toggle" href="#">Services</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Residential</a></li>
            <li><a class="dropdown-item" href="#">Commercial</a></li>
          </ul>
        </li>
        <li class="nav-item small"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">About</a></li>
        <li class="nav-item small"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">Contact</a></li>
      </ul>
      <div class="d-flex align-items-center gap-3">
        <a href="#" class="d-flex align-items-center text-decoration-none">
          <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-25" style="width:55px; height:55px;">
            <i class="bi bi-telephone-outbound-fill text-primary" style="font-size:1.5rem;" aria-hidden="true"></i>
          </div>
          <div class="d-flex flex-column ps-3">
            <span class="text-secondary small fw-medium">Call us today</span>
            <span class="fw-bold text-dark fs-5">(555) 010-2020</span>
          </div>
        </a>
      </div>
    </div>
    <div class="offcanvas offcanvas-end d-xl-none" role="dialog" aria-modal="true" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" style="max-width:340px;">
      <div class="offcanvas-header">
        <h2 class="h5 offcanvas-title mb-0" id="offcanvasNavbarLabel">Menu</h2>
        <button type="button" class="btn-close" aria-label="Close menu"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav flex-grow-1">
          <li class="nav-item"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">Home</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-uppercase fw-semibold text-dark" href="#">Services</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Residential</a></li>
              <li><a class="dropdown-item" href="#">Commercial</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link text-uppercase fw-semibold text-dark" href="#">Contact</a></li>
        </ul>
        <div class="d-flex align-items-center gap-3 mt-4 pt-3 border-top">
          <a href="#" class="d-flex align-items-center text-decoration-none gap-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-25" style="width:55px; height:55px;">
              <i class="bi bi-telephone-outbound-fill text-primary" style="font-size:1.5rem;" aria-hidden="true"></i>
            </div>
            <div class="d-flex flex-column">
              <span class="text-secondary small fw-medium">Call us today</span>
              <span class="fw-bold text-dark fs-5">(555) 010-2020</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>`,
  },
  mockData: {},
};
