const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const { createMarketpathImport, createServicesComponentImport } = await import('../src/lib/marketpath-export.js');
  const component = {
    id: 'hero-01',
    name: 'Hero',
    prefix: 'hero_01_',
    bootstrapJs: false,
    fields: [{ Type: 'group', Label: 'Hero', Fields: [{ Type: 'text', FieldID: 'hero_01_title', Label: 'Title' }] }],
    template: '<section id="hero-title"><h1>{{ entity.hero_01_title }}</h1></section>',
  };
  const datastoreComponent = {
    id: 'services-02',
    name: 'Services',
    prefix: 'services_02_',
    datastoreId: 'services',
    bootstrapJs: false,
    fields: [{ Type: 'group', Label: 'Services', Fields: [{ Type: 'datastoreitemlist', FieldID: 'services_02_items', DatastoreGUID: 'SERVICES PLACEHOLDER' }] }],
    template: '{% if entity.services_02_items.is_valid %}<section>{% endif %}',
  };
  const datastore = { id: 'services', name: 'Services', guidPlaceholder: 'SERVICES PLACEHOLDER', fields: [{ Type: 'group', Label: 'Service', Fields: [{ Type: 'text', FieldID: 'title' }] }] };

  const result = createMarketpathImport({
    blocks: [{ id: 'hero-01' }, { id: 'hero-01' }, { id: 'services-02' }],
    pageName: 'Example Home',
    components: [component, datastoreComponent],
    datastores: [datastore],
  });

  assert.deepEqual(Object.keys(result), ['Template', 'Datastore']);
  assert.equal(result.Template.length, 4);
  assert.equal(result.Template[0].Type, 'partial');
  assert.match(result.Template[1].Name, /hero-01-2\.liquid$/);
  assert.equal(result.Template[1].Fields[0].Fields[0].FieldID, 'hero_01_2_title');
  assert.match(result.Template[1].Markup, /entity\.hero_01_2_title/);
  assert.match(result.Template[1].Markup, /id="hero-title-2"/);
  assert.equal(result.Template.at(-1).Name, '/pages/_example-home.liquid');
  assert.equal(result.Template.at(-1).Type, 'page');
  assert.match(result.Template.at(-1).Markup, /include "\/partials\/playground\/hero-01-1\.liquid"/);
  assert.deepEqual(result.Template[2].Fields[0].Fields[0].DatastoreGUID, ['Services']);
  assert.equal(result.Datastore[0].Name, 'Services');
  assert.throws(() => createMarketpathImport({ blocks: [], pageName: 'Empty', components: [], datastores: [] }), /at least one section/i);

  function findFiles(directory, targetName) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? findFiles(entryPath, targetName) : entry.name === targetName ? [entryPath] : [];
    });
  }
  const root = path.join(__dirname, '..', 'src');
  const realComponents = await Promise.all(findFiles(path.join(root, 'catalog'), 'component.js').map(async (file) => (await import(pathToFileURL(file).href)).default));
  const realDatastores = await Promise.all(findFiles(path.join(root, 'datastores'), 'datastore.js').map(async (file) => (await import(pathToFileURL(file).href)).default));
  const realPackage = createMarketpathImport({
    blocks: [...realComponents.map(({ id }) => ({ id })), { id: 'faq-01' }, { id: 'hero-03' }],
    pageName: 'Example Site Home',
    components: realComponents,
    datastores: realDatastores,
    createTextExamples: true,
  });
  assert.equal(realPackage.Template.filter((template) => template.Type === 'partial').length, realComponents.length + 2);
  assert.deepEqual(realPackage.Datastore.map(({ Name }) => Name).sort(), ['Call to Action', 'FAQs', 'Projects', 'Services', 'Testimonials']);
  const ctaPartial = realPackage.Template.find((template) => template.Name.includes('/cta-01-'));
  assert.equal(ctaPartial.Fields[0].Fields[0].DatastoreGUID, 'Call to Action');
  assert.doesNotMatch(JSON.stringify(realPackage), /WRITE HERE YOUR .* GUID/);
  assert.doesNotMatch(JSON.stringify(realPackage), /SiteDomain|north-shore|marketpath\.site/);
  assert.match(realPackage.Template.at(-1).Markup, /bootstrap@5\.3\.3\/dist\/js\/bootstrap\.bundle\.min\.js/);
  assert.match(realPackage.Template.at(-1).Markup, /swiper@8\.4\.6\/swiper-bundle\.min\.js/);
  assert.doesNotMatch(realPackage.Template.find((template) => template.Name.includes('testimonials-01')).Markup, /\/marketpath\/swiperjs/);
  assert.equal(realPackage.Article.length, 1);
  assert.equal(realPackage.DatastoreItem.length, 15);
  assert.equal(realPackage.DatastoreItem.filter((item) => item.DatastoreGUID === 'Call to Action').length, 1);
  assert.equal(realPackage.DatastoreItem.filter((item) => item.DatastoreGUID === 'Services').length, 4);
  assert.equal(realPackage.DatastoreItem.filter((item) => item.DatastoreGUID === 'Testimonials').length, 4);
  assert.equal(realPackage.DatastoreItem.filter((item) => item.DatastoreGUID === 'FAQs').length, 3);
  assert.equal(realPackage.DatastoreItem.filter((item) => item.DatastoreGUID === 'Projects').length, 3);
  const exampleTestimonial = realPackage.DatastoreItem.find((item) => item.DatastoreGUID === 'Testimonials');
  assert.equal(exampleTestimonial.Title, 'Jane Smith');
  assert(exampleTestimonial.testimonial_text.startsWith('<p>'));
  assert.equal(exampleTestimonial.testimonial_highlight, 'Homeowner');
  assert(!Object.hasOwn(exampleTestimonial, 'customer_name'));
  assert.equal(realPackage.Article[0].cta_datastore_item, 'Example Call to Action');
  assert.equal(realPackage.DatastoreItem.find((item) => item.Name === 'Example Call to Action').cta_title, '<p class="fs-1 fw-bold mb-0">CALL +1 (555) 010-0100</p>');
  assert.equal(realPackage.Article[0].services_items.length, 4);
  assert.equal(realPackage.Article[0].services_individual_01_links.length, 4);
  assert.equal(realPackage.Article[0].services_individual_01_faqs.length, 3);
  assert.equal(realPackage.Article[0].testimonials_section_items.length, 4);
  assert.equal(realPackage.Article[0].hero_01_title, 'Built for the way you live.');
  assert.equal(realPackage.Article[0].projects_items.length, 3);
  assert.deepEqual(realPackage.Article[0].projects_items, ['Example Project 1', 'Example Project 2', 'Example Project 3']);
  const projectsPartial = realPackage.Template.find((template) => template.Name.includes('/projects-01-'));
  assert.deepEqual(projectsPartial.Fields[0].Fields[3].DatastoreGUID, ['Projects']);
  const projectDetailPartial = realPackage.Template.find((template) => template.Name.includes('/project-detail-01-'));
  assert.match(projectDetailPartial.Markup, /entity\.project_images/);
  assert.match(realPackage.Template.at(-1).Markup, /swiper@8\.4\.6\/swiper-bundle\.min\.js/);
  assert(realPackage.DatastoreItem.find((item) => item.DatastoreGUID === 'FAQs').faq_answer);
  const serviceDetailPartial = realPackage.Template.find((template) => template.Name.includes('/services-individual-01-'));
  const serviceDetailFields = serviceDetailPartial.Fields[0].Fields;
  assert.deepEqual(serviceDetailFields.find((field) => field.FieldID === 'services_individual_01_links').DatastoreGUID, ['Services']);
  assert.deepEqual(serviceDetailFields.find((field) => field.FieldID === 'services_individual_01_faqs').DatastoreGUID, ['FAQs']);
  const services02 = realComponents.find((component) => component.id === 'services-02');
  const emptyServicesPackage = createServicesComponentImport({ component: services02, datastores: realDatastores });
  assert.deepEqual(Object.keys(emptyServicesPackage), ['Template', 'Datastore']);
  assert.equal(emptyServicesPackage.Template.filter((template) => template.Type === 'partial').length, 1);
  assert.match(emptyServicesPackage.Template[0].Name, /\/partials\/services\/services-02\.liquid$/);
  assert.match(emptyServicesPackage.Template[0].Markup, /entity\.services_items/);
  assert.deepEqual(emptyServicesPackage.Template[0].Fields[0].Fields.map((field) => field.FieldID), ['services_eyebrow', 'services_title', 'services_description', 'services_items']);
  assert.deepEqual(emptyServicesPackage.Template[0].Fields[0].Fields[3].DatastoreGUID, ['Services']);
  assert.equal(emptyServicesPackage.Datastore[0].Name, 'Services');
  assert.equal(emptyServicesPackage.Template.at(-1).Markup, '{% include "/_header.liquid" %}\n{%- include "/partials/services/services-02.liquid" -%}\n{% include "/_footer.liquid" %}');

  const servicesFilesPackage = createServicesComponentImport({ component: services02, datastores: realDatastores, createFiles: true });
  assert.equal(servicesFilesPackage.DatastoreItem.length, 3);
  assert.equal(servicesFilesPackage.Article.length, 1);
  assert.equal(servicesFilesPackage.Article[0].services_items.length, 3);
  assert.deepEqual(servicesFilesPackage.DatastoreItem.map((item) => item.Title), ['Home repairs', 'Windows & doors', 'Outdoor living']);
  assert(servicesFilesPackage.DatastoreItem.every((item) => item.services_image === ''));
  assert.equal(servicesFilesPackage.Article[0].TemplateGUID, '/pages/_services-02-example.liquid');
  const heroMarkup = realPackage.Template.find((template) => template.Name === '/partials/playground/hero-03-1.liquid').Markup;
  const imageTags = [...heroMarkup.matchAll(/\{%-?\s*img\b[\s\S]*?-?%\}/g)].map(([tag]) => tag);
  assert(imageTags.length > 0, 'Hero 03 image tag should be present');
  assert(imageTags.every((tag) => !tag.includes('\n')), 'Marketpath img tags must be exported on a single line');
  const logoCarouselPackage = createMarketpathImport({
    blocks: [{ id: 'banner-04' }],
    pageName: 'Example Logo Carousel',
    components: realComponents,
    datastores: realDatastores,
  });
  assert.match(logoCarouselPackage.Template.at(-1).Markup, /swiper@8\.4\.6\/swiper-bundle\.min\.js/);
  assert.match(logoCarouselPackage.Template.at(-1).Markup, /swiper@8\.4\.6\/swiper-bundle\.min\.css/);
  console.log('PASS: Marketpath package supports single- and multi-datastore imports with optional CTA, service, FAQ, article, and testimonial examples.');
})().catch((error) => { console.error(error); process.exit(1); });
