const slugify = (value) => String(value || 'playground-page')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'playground-page';

const clone = (value) => JSON.parse(JSON.stringify(value));
const componentDatastoreIds = (component) => [...new Set([
  component.datastoreId,
  ...(component.datastoreIds || []),
  component.entityDatastoreId,
].filter(Boolean))];

const datastoreGuidForField = (field) => Array.isArray(field.DatastoreGUID)
  ? field.DatastoreGUID[0]
  : field.DatastoreGUID;

const exampleDatastoreItems = {
  'call-to-action': [
    {
      Name: 'Example Call to Action',
      Title: 'Example Call to Action',
      cta_eyebrow: 'LET’S TALK ABOUT YOUR PROJECT.',
      cta_title: '<p class="fs-1 fw-bold mb-0">CALL +1 (555) 010-0100</p>',
      cta_description: '<p>We’re here to answer your questions and help you plan your next step.</p>',
      cta_button_text: 'Request a Quote',
      cta_button_link: { UrlType: 'External', Url: 'https://example.com/contact', ReferenceGuid: null },
    },
  ],
  services: [
    { Name: 'Example Service 1', Title: 'Home repairs', services_image: '', services_summary: '<p>Thoughtful repairs and updates to make your home more comfortable.</p>', services_content: '<p>Thoughtful work for a more comfortable home.</p>' },
    { Name: 'Example Service 2', Title: 'Windows & doors', services_image: '', services_summary: '<p>Improve comfort and welcome natural light with carefully planned upgrades.</p>', services_content: '<p>Carefully planned upgrades for everyday living.</p>' },
    { Name: 'Example Service 3', Title: 'Outdoor living', services_image: '', services_summary: '<p>Make more room to relax and gather with a refreshed outdoor space.</p>', services_content: '<p>Make more room to relax and gather.</p>' },
    { Name: 'Example Service 4', Title: 'Interior updates', services_image: '', services_summary: '<p>Refresh everyday spaces with careful planning and quality workmanship.</p>', services_content: '<p>Refresh your home with quality workmanship.</p>' },
  ],
  testimonials: [
    { Name: 'Example Testimonial 1', Title: 'Jane Smith', testimonial_text: '<p>The team made the whole process clear, organized, and easy from start to finish.</p>', testimonial_highlight: 'Homeowner' },
    { Name: 'Example Testimonial 2', Title: 'John Doe', testimonial_text: '<p>The work was completed on schedule, and every detail was handled with care.</p>', testimonial_highlight: 'Project client' },
    { Name: 'Example Testimonial 3', Title: 'Jane Smith', testimonial_text: '<p>Communication was excellent, and the finished result looks great.</p>', testimonial_highlight: 'Homeowner' },
    { Name: 'Example Testimonial 4', Title: 'John Doe', testimonial_text: '<p>A smooth experience with thoughtful service and dependable workmanship.</p>', testimonial_highlight: 'Project client' },
  ],
  'team-members': [
    { Name: 'Example Team Member 1', Title: 'Jane Smith', team_member_image: '', team_member_role: 'Project Manager', team_member_bio: '<p>Jane helps each project move forward with clear communication and careful planning.</p>', team_member_phone: '(555) 010-2020', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: { UrlType: 'External', Url: 'https://www.linkedin.com/', ReferenceGuid: null } }, { social_media_platform: 'Instagram', social_media_link: { UrlType: 'External', Url: 'https://www.instagram.com/', ReferenceGuid: null } }] },
    { Name: 'Example Team Member 2', Title: 'John Doe', team_member_image: '', team_member_role: 'Site Supervisor', team_member_bio: '<p>John keeps the details organized and makes sure every stage is completed with care.</p>', team_member_phone: '(555) 010-2021', team_member_email: 'john@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: { UrlType: 'External', Url: 'https://www.linkedin.com/', ReferenceGuid: null } }] },
    { Name: 'Example Team Member 3', Title: 'Jane Smith', team_member_image: '', team_member_role: 'Client Care', team_member_bio: '<p>Jane is here to answer questions and help make every interaction feel straightforward.</p>', team_member_phone: '(555) 010-2022', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'Instagram', social_media_link: { UrlType: 'External', Url: 'https://www.instagram.com/', ReferenceGuid: null } }] },
  ],
  faqs: [
    { Name: 'Example FAQ 1', Title: 'How do I get started?', faq_answer: '<p>Contact us to discuss your project, goals, and next steps.</p>' },
    { Name: 'Example FAQ 2', Title: 'Can I customize the project?', faq_answer: '<p>We will review the available options with you during planning.</p>' },
    { Name: 'Example FAQ 3', Title: 'When will I receive an estimate?', faq_answer: '<p>After learning about your goals, we will prepare a clear project estimate.</p>' },
  ],
  projects: [
    { Name: 'Example Project 1', Title: 'Coastal window renovation', project_image: '', project_summary: '<p>A brighter, more comfortable coastal home.</p>', project_content: '<p>Careful planning and quality materials helped refresh this coastal home.</p>', project_images: [], projects_details: [], project_overview: '<p>A thoughtful renovation completed with care.</p>' },
    { Name: 'Example Project 2', Title: 'Welcoming entry doors', project_image: '', project_summary: '<p>A thoughtful entry with lasting curb appeal.</p>', project_content: '<p>A new entry door brings character and everyday performance.</p>', project_images: [], projects_details: [], project_overview: '<p>A welcoming entrance designed for everyday use.</p>' },
    { Name: 'Example Project 3', Title: 'Backyard deck retreat', project_image: '', project_summary: '<p>An outdoor space designed for gathering.</p>', project_content: '<p>A comfortable deck makes room for time outside.</p>', project_images: [], projects_details: [], project_overview: '<p>An outdoor project built around gathering.</p>' },
  ],
};

function fieldIds(fields, ids = []) {
  for (const field of fields || []) {
    if (field.Type === 'group') fieldIds(field.Fields, ids);
    else if (field.FieldID) ids.push(field.FieldID);
  }
  return ids;
}

function remapFields(fields, idMap, datastoresByPlaceholder) {
  return (fields || []).map((field) => {
    const next = { ...field };
    if (next.FieldID && idMap.has(next.FieldID)) next.FieldID = idMap.get(next.FieldID);
    if (next.Condition?.FieldID && idMap.has(next.Condition.FieldID)) {
      next.Condition = { ...next.Condition, FieldID: idMap.get(next.Condition.FieldID) };
    }
    if (next.Type === 'group') next.Fields = remapFields(next.Fields, idMap, datastoresByPlaceholder);
    if (next.Type === 'fieldset') next.Fields = remapFields(next.Fields, idMap, datastoresByPlaceholder);
    if (['datastoreitem', 'datastoreitemlist'].includes(next.Type)) {
      const datastore = datastoresByPlaceholder.get(datastoreGuidForField(next));
      if (datastore && next.Type === 'datastoreitemlist') next.DatastoreGUID = [datastore.name];
      if (datastore && next.Type === 'datastoreitem') next.DatastoreGUID = datastore.name;
    }
    return next;
  });
}

function remapTemplate(template, idMap, occurrence) {
  let markup = template;
  for (const [original, replacement] of [...idMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
    markup = markup.replaceAll(`entity.${original}`, `entity.${replacement}`);
  }
  if (occurrence > 1) {
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    for (const id of ids) {
      const replacement = `${id}-${occurrence}`;
      markup = markup
        .replaceAll(`id="${id}"`, `id="${replacement}"`)
        .replaceAll(`="#${id}"`, `="#${replacement}"`)
        .replaceAll(`="${id}"`, `="${replacement}"`);
    }
  }
  markup = markup.replace(/\{%-?\s*img\b[\s\S]*?-?%\}/g, (tag) => tag.replace(/\s+/g, ' ').trim());
  // The self-contained page shell loads Swiper from its CDN instead of requiring
  // the source site's local /marketpath/swiperjs assets.
  return markup
    .replace(/\{%-?\s*add_stylesheet\s+["']\/marketpath\/swiperjs\/css\/swiper\.css["']\s*-?%\}/g, '')
    .replace(/\{%-?\s*add_javascript\s+["']\/marketpath\/swiperjs\/js\/swiper\.js["'][^%]*-?%\}/g, '');
}

function mockValueForField(field, component, mockData, datastoreItemsByGuid) {
  const datastoreItems = datastoreItemsByGuid.get(datastoreGuidForField(field)) || [];
  if (field.Type === 'datastoreitemlist') return datastoreItems.map((item) => item.Name);
  if (field.Type === 'datastoreitem') return datastoreItems[0]?.Name;
  const key = field.FieldID?.startsWith(component.prefix) ? field.FieldID.slice(component.prefix.length) : field.FieldID;
  let value = mockData?.[key];
  if (value === undefined && field.DefaultValue !== undefined) value = field.DefaultValue;
  if (value === undefined) return undefined;
  if (field.Type === 'toggle' && typeof value === 'boolean') return value ? field.OnValue : field.OffValue;
  if (field.Type === 'url' && typeof value === 'string' && value.trim()) {
    return { UrlType: 'External', Url: value, ReferenceGuid: null };
  }
  return clone(value);
}

function appendArticleFields(fields, component, idMap, mockData, datastoreItemsByGuid, article) {
  for (const field of fields || []) {
    if (field.Type === 'group') {
      appendArticleFields(field.Fields, component, idMap, mockData, datastoreItemsByGuid, article);
      continue;
    }
    const outputId = idMap.get(field.FieldID) || field.FieldID;
    if (field.Type === 'fieldset') {
      const key = field.FieldID.startsWith(component.prefix) ? field.FieldID.slice(component.prefix.length) : field.FieldID;
      const items = Array.isArray(mockData?.[key]) ? mockData[key] : [];
      article[outputId] = items.map((item) => Object.fromEntries(field.Fields.map((child) => {
        let value = item[child.FieldID];
        if (value === undefined && child.DefaultValue !== undefined) value = child.DefaultValue;
        if (child.Type === 'toggle' && typeof value === 'boolean') value = value ? child.OnValue : child.OffValue;
        return [child.FieldID, value === undefined ? '' : clone(value)];
      })));
      continue;
    }
    const value = mockValueForField(field, component, mockData, datastoreItemsByGuid);
    if (value !== undefined) article[outputId] = value;
  }
}

function sampleItemsForDatastore(datastore) {
  const items = exampleDatastoreItems[datastore.id] || [];
  return items.map((item) => ({ ...item, DatastoreGUID: datastore.name }));
}

function pageMarkup(partialNames, { bootstrapJs, swiper }) {
  const stylesheetLinks = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">',
    swiper ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8.4.6/swiper-bundle.min.css">' : '',
  ].filter(Boolean).join('\n    ');
  const headerScripts = swiper ? '<script src="https://cdn.jsdelivr.net/npm/swiper@8.4.6/swiper-bundle.min.js"></script>' : '';
  const footerScripts = bootstrapJs ? '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>' : '';
  const includes = partialNames.map((name) => `{%- include "${name}" -%}`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page_title | default:automatic_markup.title | escape }}</title>
  ${stylesheetLinks}
  ${headerScripts}
</head>
<body>
${includes}
${footerScripts}
</body>
</html>`;
}

/** Build a minimal Marketpath site-package JSON for a Playground page. */
export function createMarketpathImport({ blocks, pageName, components, datastores = [], createTextExamples = false }) {
  const componentsById = new Map(components.map((component) => [component.id, component]));
  const datastoresById = new Map(datastores.map((datastore) => [datastore.id, datastore]));
  const datastoresByPlaceholder = new Map(datastores.map((datastore) => [datastore.guidPlaceholder, datastore]));
  const datastoreItemsByGuid = new Map(datastores.map((datastore) => [datastore.guidPlaceholder, sampleItemsForDatastore(datastore)]));
  const datastoreIds = new Set();
  const occurrences = new Map();
  const partialNames = [];
  const partialTemplates = [];
  const articleFields = {};
  let bootstrapJs = false;
  let swiper = false;

  for (const block of blocks) {
    const component = componentsById.get(block.id);
    if (!component) continue;
    const occurrence = (occurrences.get(component.id) || 0) + 1;
    occurrences.set(component.id, occurrence);
    for (const id of componentDatastoreIds(component)) {
      const datastore = datastoresById.get(id);
      if (!datastore) throw new Error(`Missing datastore schema ${id} for ${component.name}`);
      datastoreIds.add(datastore.id);
    }
    bootstrapJs ||= Boolean(component.bootstrapJs);
    swiper ||= ['testimonials-01', 'banner-04', 'project-detail-01'].includes(component.id);

    const idMap = new Map();
    if (!component.sharedFieldsId && occurrence > 1) {
      const nextPrefix = `${component.prefix.slice(0, -1)}_${occurrence}_`;
      for (const id of fieldIds(component.fields)) {
        if (id.startsWith(component.prefix)) idMap.set(id, `${nextPrefix}${id.slice(component.prefix.length)}`);
      }
    }

    const componentSlug = slugify(component.id);
    const partialName = `/partials/playground/${componentSlug}-${occurrence}.liquid`;
    partialNames.push(partialName);
    partialTemplates.push({
      Name: partialName,
      Title: `${component.name}${occurrence > 1 ? ` (${occurrence})` : ''}`,
      Type: 'partial',
      Markup: remapTemplate(component.template, idMap, occurrence),
      Fields: remapFields(clone(component.fields), idMap, datastoresByPlaceholder),
    });

    if (createTextExamples) {
      appendArticleFields(component.fields, component, idMap, component.mockData || {}, datastoreItemsByGuid, articleFields);
    }
  }

  if (!partialTemplates.length) throw new Error('Add at least one section before exporting for Marketpath.');

  const slug = slugify(pageName);
  const pageTemplate = {
    Name: `/pages/_${slug}.liquid`,
    Title: pageName || 'Playground Page',
    Type: 'page',
    RestrictedTypes: 'Article',
    Markup: pageMarkup(partialNames, { bootstrapJs, swiper }),
  };

  const importedDatastores = [...datastoreIds].map((id) => {
    const datastore = datastoresById.get(id);
    return {
      Name: datastore.name,
      Title: datastore.name,
      DatastoreType: datastore.id.replaceAll('-', ' '),
      CreatePageByDefault: false,
      DefaultRootPath: '',
      Fields: clone(datastore.fields),
    };
  });

  const result = {
    Template: [...partialTemplates, pageTemplate],
    ...(importedDatastores.length ? { Datastore: importedDatastores } : {}),
  };

  if (createTextExamples) {
    const datastoreItems = [...datastoreIds].flatMap((id) => sampleItemsForDatastore(datastoresById.get(id)));
    const exampleTitle = `${pageName || 'Playground Page'} Example`;
    result.Article = [{
      Name: exampleTitle,
      Title: exampleTitle,
      PostDate: new Date().toISOString().replace('T', ' ').replace('Z', ''),
      URL: `/${slug}-example`,
      TemplateGUID: pageTemplate.Name,
      BrowserTitle: exampleTitle,
      MetaDescription: 'Example page content created from the selected Marketpath components.',
      Keywords: '',
      MetaRobots: '',
      IncludeInSearch: true,
      SummaryHTML: null,
      ContentHTML: null,
      ...articleFields,
    }];
    if (datastoreItems.length) result.DatastoreItem = datastoreItems;
  }

  return result;
}

/** Build an import package for one Services component, with optional sample files. */
export function createServicesComponentImport({ component, datastores = [], createFiles = false }) {
  if (!component || component.category !== 'services' || component.datastoreId !== 'services') {
    throw new Error('Select a Services component to create this import package.');
  }

  const result = createMarketpathImport({
    blocks: [{ id: component.id }],
    pageName: `${component.id} Example`,
    components: [component],
    datastores,
    createTextExamples: createFiles,
  });
  const partial = result.Template.find((template) => template.Type === 'partial');
  const pageTemplate = result.Template.find((template) => template.Type === 'page');
  if (!partial || !pageTemplate) throw new Error('Could not create the Services templates.');

  partial.Name = `/partials/services/${slugify(component.id)}.liquid`;
  partial.Title = component.name;
  pageTemplate.Name = `/pages/_${slugify(component.id)}-example.liquid`;
  pageTemplate.Title = `${component.name} Example`;
  pageTemplate.Markup = `{% include "/_header.liquid" %}
{%- include "${partial.Name}" -%}
{% include "/_footer.liquid" %}`;

  if (createFiles) {
    const items = (result.DatastoreItem || [])
      .filter((item) => item.DatastoreGUID === 'Services')
      .slice(0, 3);
    if (items.length !== 3) throw new Error('The Services datastore must provide three sample items.');

    const findListField = (fields) => {
      for (const field of fields || []) {
        if (field.Type === 'datastoreitemlist') return field;
        const nested = findListField(field.Fields);
        if (nested) return nested;
      }
      return null;
    };
    const listField = findListField(component.fields);
    if (!listField) throw new Error(`${component.name} does not contain a Services list field.`);

    result.DatastoreItem = items;
    result.Article[0].Name = `${component.name} Example`;
    result.Article[0].Title = `${component.name} Example`;
    result.Article[0].URL = `/${slugify(component.id)}-example`;
    result.Article[0].TemplateGUID = pageTemplate.Name;
    result.Article[0][listField.FieldID] = items.map((item) => item.Name);
  }

  return result;
}

export { slugify as marketpathSlug };
