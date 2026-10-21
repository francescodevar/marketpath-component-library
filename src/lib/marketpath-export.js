import { collectImagePresets, marketpathImagePresetJson } from './image-presets.js';
import { strToU8, zipSync } from 'fflate';

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
  component.settingsDatastoreId,
].filter(Boolean))];

const datastoreGuidForField = (field) => Array.isArray(field.DatastoreGUID)
  ? field.DatastoreGUID[0]
  : field.DatastoreGUID;

// Exported so the Playground can match preview text to these sample items and record edits against them.
export const exampleDatastoreItems = {
  'call-to-action': [
    {
      Name: 'Example Call to Action',
      Title: 'Example Call to Action',
      cta_eyebrow: 'LET’S TALK ABOUT YOUR PROJECT.',
      cta_title: '<p class="fs-1 fw-bold mb-0">CALL +1 (555) 010-0100</p>',
      cta_description: '<p>We’re here to answer your questions and help you plan your next step.</p>',
      cta_button_text: 'Request a Quote',
      cta_button_link: { UrlType: 'Custom', Url: 'https://example.com/contact', ReferenceGuid: null },
    },
  ],
  services: [
    { Name: 'Example Service 1', Title: 'Home repairs', services_image: '', services_summary: '<p>Thoughtful repairs and updates to make your home more comfortable.</p>', services_content: '<p>Thoughtful work for a more comfortable home.</p>' },
    { Name: 'Example Service 2', Title: 'Windows & doors', services_image: '', services_summary: '<p>Improve comfort and welcome natural light with carefully planned upgrades.</p>', services_content: '<p>Carefully planned upgrades for everyday living.</p>' },
    { Name: 'Example Service 3', Title: 'Outdoor living', services_image: '', services_summary: '<p>Make more room to relax and gather with a refreshed outdoor space.</p>', services_content: '<p>Make more room to relax and gather.</p>' },
  ],
  testimonials: [
    { Name: 'Example Testimonial 1', Title: 'Jane Smith', testimonial_text: '<p>The team made the whole process clear, organized, and easy from start to finish.</p>', testimonial_highlight: 'Homeowner' },
    { Name: 'Example Testimonial 2', Title: 'John Doe', testimonial_text: '<p>The work was completed on schedule, and every detail was handled with care.</p>', testimonial_highlight: 'Project client' },
    { Name: 'Example Testimonial 3', Title: 'Jane Smith', testimonial_text: '<p>Communication was excellent, and the finished result looks great.</p>', testimonial_highlight: 'Homeowner' },
    { Name: 'Example Testimonial 4', Title: 'John Doe', testimonial_text: '<p>A smooth experience with thoughtful service and dependable workmanship.</p>', testimonial_highlight: 'Project client' },
  ],
  'team-members': [
    { Name: 'Example Team Member 1', Title: 'Jane Smith', team_member_image: '', team_member_role: 'Project Manager', team_member_bio: '<p>Jane helps each project move forward with clear communication and careful planning.</p>', team_member_phone: '(555) 010-2020', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: { UrlType: 'Custom', Url: 'https://www.linkedin.com/', ReferenceGuid: null } }, { social_media_platform: 'Instagram', social_media_link: { UrlType: 'Custom', Url: 'https://www.instagram.com/', ReferenceGuid: null } }] },
    { Name: 'Example Team Member 2', Title: 'John Doe', team_member_image: '', team_member_role: 'Site Supervisor', team_member_bio: '<p>John keeps the details organized and makes sure every stage is completed with care.</p>', team_member_phone: '(555) 010-2021', team_member_email: 'john@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: { UrlType: 'Custom', Url: 'https://www.linkedin.com/', ReferenceGuid: null } }] },
    { Name: 'Example Team Member 3', Title: 'Jane Smith', team_member_image: '', team_member_role: 'Client Care', team_member_bio: '<p>Jane is here to answer questions and help make every interaction feel straightforward.</p>', team_member_phone: '(555) 010-2022', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'Instagram', social_media_link: { UrlType: 'Custom', Url: 'https://www.instagram.com/', ReferenceGuid: null } }] },
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

// Applies per-item edits on top of the sample items. Item identity (Name) is never edited, so references stay valid.
function mergeDatastoreEdits(items, edits) {
  const merged = {};
  for (const [id, list] of Object.entries(items)) {
    const itemEdits = edits && typeof edits === 'object' ? edits[id] : null;
    merged[id] = itemEdits && typeof itemEdits === 'object'
      ? list.map((item, index) => {
        // Only keys the sample item already has, so an edit can never add a field the schema does not define.
        const changes = Object.fromEntries(Object.entries(itemEdits[index] || {}).filter(([key]) => key !== 'Name' && key in item));
        return { ...item, ...changes };
      })
      : list;
  }
  return merged;
}

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
    return { UrlType: 'Custom', Url: value, ReferenceGuid: null };
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

const themePageDefinitions = {
  home: { templateName: '/pages/_home.liquid', restrictedTypes: 'Article', articleName: 'Home', url: '/' },
  generic: { templateName: '/pages/_generic_page.liquid', restrictedTypes: 'Article', articleName: 'Generic Page', url: '/generic-page' },
  about: { templateName: '/pages/_about.liquid', restrictedTypes: 'Article', articleName: 'About', url: '/about' },
  contact: { templateName: '/pages/_contact.liquid', restrictedTypes: 'Article', articleName: 'Contact', url: '/contact' },
  error: { templateName: '/error_page_404.liquid', restrictedTypes: 'ErrorPage', errorPage: true, url: '/404' },
  services: { templateName: '/pages/_services.liquid', restrictedTypes: 'Datastore', datastoreId: 'services', url: '/services', rootPath: '/services/' },
  'inside-services': { templateName: '/pages/_individual_service.liquid', restrictedTypes: 'DatastoreItem:services', entityDatastoreId: 'services', url: '/services/' },
  projects: { templateName: '/pages/_projects.liquid', restrictedTypes: 'Datastore', datastoreId: 'projects', url: '/projects', rootPath: '/projects/' },
  'inside-projects': { templateName: '/pages/_individual_project.liquid', restrictedTypes: 'DatastoreItem:projects', entityDatastoreId: 'projects', url: '/projects/' },
  blog: { templateName: '/pages/blog.liquid', restrictedTypes: ['Blog', 'BlogPost'], blog: true, url: '/blog' },
  testimonials: { templateName: '/pages/_testimonials.liquid', restrictedTypes: 'Datastore', datastoreId: 'testimonials', url: '/testimonials' },
  team: { templateName: '/pages/_our_team.liquid', restrictedTypes: 'Datastore', datastoreId: 'team-members', url: '/team' },
  thankyou: { templateName: '/pages/_thank_you.liquid', restrictedTypes: 'Article', articleName: 'Thank You', url: '/thank-you' },
  gallery: { templateName: '/pages/_gallery.liquid', restrictedTypes: 'Article', articleName: 'Gallery', url: '/gallery' },
  faqs: { templateName: '/pages/_faqs.liquid', restrictedTypes: 'Datastore', datastoreId: 'faqs', url: '/faqs' },
};

const datastorePageDefinitions = {
  services: { pageKey: 'services', detailPageKey: 'inside-services', route: '/services', rootPath: '/services/' },
  projects: { pageKey: 'projects', detailPageKey: 'inside-projects', route: '/projects', rootPath: '/projects/' },
  testimonials: { pageKey: 'testimonials', route: '/testimonials' },
  'team-members': { pageKey: 'team', route: '/team' },
  faqs: { pageKey: 'faqs', route: '/faqs' },
};

function pageInfoForThemePage(page, index) {
  const definition = themePageDefinitions[page.key];
  if (!definition) throw new Error(`Unsupported theme page: ${page.key}`);
  return {
    ...page,
    ...definition,
    articleName: definition.articleName || page.label || page.key,
    slug: slugify(page.key),
    blocks: Array.isArray(page.blocks) ? page.blocks : [],
    index,
  };
}

function componentInstancesForPage(page, componentsById, datastoresByPlaceholder) {
  const occurrences = new Map();
  const blocks = ['home', 'blog', 'error', 'thankyou'].includes(page.key)
    ? page.blocks.filter((block) => componentsById.get(block.id)?.category !== 'page-title')
    : page.blocks;
  return blocks.flatMap((block, index) => {
    const component = componentsById.get(block.id);
    if (!component) return [];
    const occurrence = (occurrences.get(component.id) || 0) + 1;
    occurrences.set(component.id, occurrence);
    const idMap = new Map();
    if (!component.sharedFieldsId && occurrence > 1) {
      const nextPrefix = `${component.prefix.slice(0, -1)}_${occurrence}_`;
      for (const id of fieldIds(component.fields)) {
        if (id.startsWith(component.prefix)) idMap.set(id, `${nextPrefix}${id.slice(component.prefix.length)}`);
      }
    }
    return [{
      component,
      idMap,
      occurrence,
      partialName: `/partials/theme/${slugify(component.id)}${occurrence > 1 ? `-${occurrence}` : ''}.liquid`,
      instanceKey: `${page.key}:${index}`,
      datastoresByPlaceholder,
      // Field values edited in the Playground; they replace the component's mockData for this block.
      values: block.values && typeof block.values === 'object' ? block.values : null,
    }];
  });
}

function fillImageFields(fields, values, idMap = new Map(), imageForField = () => 'placeholder.jpg') {
  for (const field of fields || []) {
    if (field.Type === 'group') {
      fillImageFields(field.Fields, values, idMap, imageForField);
      continue;
    }
    if (!field.FieldID) continue;
    const outputId = idMap.get(field.FieldID) || field.FieldID;
    if (field.Type === 'image') {
      values[outputId] = imageForField(field.FieldID);
      continue;
    }
    if (field.Type === 'imagelist') {
      values[outputId] = field.FieldID.endsWith('gallery_images')
        ? Array.from({ length: 9 }, () => imageForField(field.FieldID))
        : [imageForField(field.FieldID)];
      continue;
    }
    if (field.Type !== 'fieldset') continue;

    const children = field.Fields || [];
    let items = Array.isArray(values[outputId]) ? values[outputId] : [];
    if (!items.length && children.some((child) => child.Type === 'image')) items = [{}];
    values[outputId] = items.map((item) => {
      const next = { ...item };
      for (const child of children) {
        if (child.Type === 'image') next[child.FieldID] = imageForField(child.FieldID);
        else if (child.Type === 'imagelist') next[child.FieldID] = [imageForField(child.FieldID)];
        else if (next[child.FieldID] === undefined && child.DefaultValue !== undefined) next[child.FieldID] = clone(child.DefaultValue);
      }
      return next;
    });
  }
}

function pageFieldsForInstances(instances, datastoreItemsByGuid, imageForField) {
  const values = {};
  for (const instance of instances) {
    const { component, idMap } = instance;
    appendArticleFields(component.fields, component, idMap, instance.values || component.mockData || {}, datastoreItemsByGuid, values);
    fillImageFields(component.fields, values, idMap, imageForField);
    for (const field of fieldIdsWithTypes(component.fields)) {
      if (field.Type === 'form' && !values[instance.idMap.get(field.FieldID) || field.FieldID]) {
        values[instance.idMap.get(field.FieldID) || field.FieldID] = 'Example Contact Form';
      }
    }
  }
  return values;
}

function fieldIdsWithTypes(fields, result = []) {
  for (const field of fields || []) {
    if (field.Type === 'group') fieldIdsWithTypes(field.Fields, result);
    else result.push(field);
  }
  return result;
}

function themeHeaderTemplate(component, { swiper = false } = {}) {
  let markup = component.template
    .replace(/\{%-?\s*add_javascript\s+["']\/theme\/navbar\.js["'][^%]*-?%\}/g, '');
  const assets = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">',
    swiper ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8.4.6/swiper-bundle.min.css">' : '',
    swiper ? '<script src="https://cdn.jsdelivr.net/npm/swiper@8.4.6/swiper-bundle.min.js"></script>' : '',
  ].filter(Boolean).join('\n');
  if (/<\/head>/i.test(markup)) markup = markup.replace(/<\/head>/i, `${assets}\n</head>`);
  return markup;
}

function themePageMarkup(headerPath, componentPaths, footerPath) {
  return [
    `{%- include "${headerPath}" -%}`,
    ...componentPaths.map((name) => `{%- include "${name}" -%}`),
    `{%- include "${footerPath}" -%}`,
  ].join('\n');
}

function imageReadyDatastoreItem(item, datastore, imageForField) {
  const next = { ...clone(item) };
  for (const field of fieldIdsWithTypes(datastore.fields)) {
    if (field.Type === 'image') next[field.FieldID] = imageForField(field.FieldID);
    if (field.Type === 'imagelist') next[field.FieldID] = [imageForField(field.FieldID)];
    if (field.Type === 'fieldset' && Array.isArray(next[field.FieldID])) {
      next[field.FieldID] = next[field.FieldID].map((entry) => {
        const value = { ...entry };
        for (const child of field.Fields || []) {
          if (child.Type === 'image') value[child.FieldID] = imageForField(child.FieldID);
          if (child.Type === 'imagelist') value[child.FieldID] = [imageForField(child.FieldID)];
        }
        return value;
      });
    }
  }
  for (const key of Object.keys(next)) {
    if (/_image$/i.test(key)) next[key] = imageForField(key);
    if (key === 'project_images') next[key] = Array.from({ length: 4 }, () => imageForField(key));
  }
  return next;
}

function exampleSettingsItem(menuNames, logoName, contactSelected, siteDomain) {
  const menuItems = menuNames.map((name) => `Main Menu/${name}`);
  return {
    Name: 'Example Settings',
    Title: 'Example Settings',
    DatastoreGUID: 'Page Settings',
    logo_image: logoName,
    main_menu: 'Main Menu',
    header_cta_text_pretitle: 'Call us today',
    header_cta_text_title: '(555) 010-0100',
    header_cta_link: { UrlType: 'Custom', Url: 'tel:+15550100100', ReferenceGuid: null },
    topbar_cta_text: 'Request a consultation',
    topbar_cta_link: contactSelected
      ? { UrlType: 'Entity', Url: `//${siteDomain}/contact`, ReferenceGuid: 'Article:Contact' }
      : { UrlType: 'Custom', Url: 'https://example.com/contact', ReferenceGuid: null },
    footer_logo: logoName,
    footer_about: 'Example provides thoughtful service and dependable work for every project.',
    footer_menu_1: menuItems,
    company_email: 'hello@example.com',
    company_phone: '(555) 010-0100',
    company_address: '123 Example Street, Example City',
    company_hours: 'Monday–Friday, 9:00 a.m.–5:00 p.m.',
    company_social_media: [{ social_media_platform: 'Instagram', social_media_link: { UrlType: 'Custom', Url: 'https://example.com/social', ReferenceGuid: null } }],
  };
}

function themeSiteUrl(route, siteDomain) {
  const path = String(route || '/').startsWith('/') ? String(route || '/') : `/${route}`;
  return `//${siteDomain}${path}`;
}

function themeArticleBase(page, templateName, dateStamp, siteDomain) {
  return {
    Name: page.articleName,
    Title: page.articleName,
    PostDate: dateStamp,
    URL: themeSiteUrl(page.url, siteDomain),
    TemplateGUID: templateName,
    BrowserTitle: page.articleName,
    MetaDescription: `Example content for the ${page.articleName} page.`,
    Keywords: '',
    MetaRobots: '',
    IncludeInSearch: true,
    SummaryHTML: null,
    ContentHTML: null,
  };
}

function themeMenuTarget(page, datastoreById, siteDomain) {
  if (page.key === 'error' || page.entityDatastoreId) return null;
  if (page.blog) return { UrlType: 'Entity', Url: themeSiteUrl(page.url, siteDomain), ReferenceGuid: 'Blog:Blog' };
  if (page.datastoreId) {
    const datastore = datastoreById.get(page.datastoreId);
    return datastore ? { UrlType: 'Entity', Url: themeSiteUrl(page.url, siteDomain), ReferenceGuid: `Datastore:${datastore.name}` } : null;
  }
  return { UrlType: 'Entity', Url: themeSiteUrl(page.url, siteDomain), ReferenceGuid: `Article:${page.articleName}` };
}

/** Build a multi-page Marketpath import JSON for the Playground theme workflow. */
export function createThemeMarketpathImport({
  pages,
  themeName = 'Example theme',
  headerId,
  footerId,
  components,
  datastores = [],
  siteDomain = '',
  imageName = 'placeholder.jpg',
  themeAssets = null,
  projectCount = 3,
  // Edits made to the sample datastore items in the Playground: { services: { 0: { Title: '…' } } }, keyed by item index.
  datastoreEdits = {},
}) {
  const exampleItems = mergeDatastoreEdits(exampleDatastoreItems, datastoreEdits);
  const componentsById = new Map(components.map((component) => [component.id, component]));
  const datastoresById = new Map(datastores.map((datastore) => [datastore.id, datastore]));
  const datastoresByPlaceholder = new Map(datastores.map((datastore) => [datastore.guidPlaceholder, datastore]));
  const selectedPages = (pages || []).map(pageInfoForThemePage);
  if (!selectedPages.length) throw new Error('Select at least one page before exporting the theme.');
  const header = componentsById.get(headerId);
  const footer = componentsById.get(footerId);
  if (header?.category !== 'header' || footer?.category !== 'footer') throw new Error('Choose a valid header and footer before exporting.');
  const normalizedSiteDomain = String(siteDomain || '').trim().replace(/^(?:https?:)?\/\//i, '').split('/')[0];
  if (!normalizedSiteDomain) {
    throw new Error('Enter your Marketpath site domain in Edit pages before exporting the theme.');
  }
  const logoName = themeAssets?.logoName || imageName;
  const teamMemberNames = themeAssets?.teamMemberNames || [];
  const photoNames = themeAssets?.photoNames || [];
  const randomPhoto = () => photoNames.length ? photoNames[Math.floor(Math.random() * photoNames.length)] : imageName;
  const imageForField = () => randomPhoto();
  const projectLimit = Math.max(1, Math.min(11, Number(projectCount) || 3));
  const imageNames = themeAssets ? [...new Set([logoName, ...teamMemberNames, ...photoNames])] : [imageName];

  const pageInstances = new Map();
  const partialsByName = new Map();
  const allInstances = [header, footer].map((component) => ({ component, idMap: new Map(), occurrence: 1, partialName: component.id === headerId ? '/_header.liquid' : '/_footer.liquid' }));
  let needsSwiper = false;
  const usedDatastoreIds = new Set(['page-settings']);

  for (const page of selectedPages) {
    const instances = componentInstancesForPage(page, componentsById, datastoresByPlaceholder);
    pageInstances.set(page.key, instances);
    for (const instance of instances) {
      const { component } = instance;
      allInstances.push(instance);
      for (const id of componentDatastoreIds(component)) usedDatastoreIds.add(id);
      needsSwiper ||= ['testimonials-01', 'banner-04', 'project-detail-01'].includes(component.id);
      const partialKey = `${component.id}:${instance.occurrence}`;
      if (!partialsByName.has(instance.partialName)) {
        partialsByName.set(instance.partialName, {
          Name: instance.partialName,
          Title: `${component.name}${instance.occurrence > 1 ? ` (${instance.occurrence})` : ''}`,
          Type: 'partial',
          Markup: remapTemplate(component.template, instance.idMap, instance.occurrence),
          ...(component.fields?.length ? { Fields: remapFields(clone(component.fields), instance.idMap, datastoresByPlaceholder) } : {}),
          _partialKey: partialKey,
        });
      }
    }
    const pageDefinition = themePageDefinitions[page.key];
    if (pageDefinition.datastoreId) usedDatastoreIds.add(pageDefinition.datastoreId);
    if (pageDefinition.entityDatastoreId) usedDatastoreIds.add(pageDefinition.entityDatastoreId);
  }
  if (usedDatastoreIds.has('services') || usedDatastoreIds.has('projects')) {
    // Their item detail templates are paired with the listing schemas when selected.
    if (selectedPages.some((page) => page.key === 'inside-services')) usedDatastoreIds.add('services');
    if (selectedPages.some((page) => page.key === 'inside-projects')) usedDatastoreIds.add('projects');
  }
  for (const id of usedDatastoreIds) {
    if (!datastoresById.has(id)) throw new Error(`Missing datastore schema ${id} required by the selected theme.`);
  }

  const hasContactForm = [...pageInstances.values()].flat().some((instance) => fieldIdsWithTypes(instance.component.fields).some((field) => field.Type === 'form'));
  const formName = 'Example Contact Form';
  const pageMenuItems = [];
  const menuNames = [];
  const menuEntries = [];
  for (const page of selectedPages) {
    if (page.key === 'error' || page.entityDatastoreId) continue;
    const href = themeMenuTarget(page, datastoresById, normalizedSiteDomain);
    if (!href) continue;
    const group = ({ generic: 'About', about: 'About', testimonials: 'About', team: 'About', gallery: 'Resources', blog: 'Resources', faqs: 'Resources' })[page.key];
    const label = page.key === 'home' ? 'Home' : page.label;
    menuEntries.push({ page, href, group, label });
  }
  const addMenuItem = (path, href) => {
    pageMenuItems.push({ Name: `Main Menu/${path}`, Href: href, OpenInNewTab: false, Description: '', Content: null, Order: String(pageMenuItems.length + 1) });
  };
  const entryFor = (key) => menuEntries.find((entry) => entry.page.key === key);
  const addGroup = (name, keys) => {
    const entries = keys.map(entryFor).filter(Boolean);
    if (!entries.length) return;
    addMenuItem(name, entries[0].href);
    for (const entry of entries) addMenuItem(`${name}/${entry.label}`, entry.href);
  };
  if (entryFor('home')) addMenuItem('Home', entryFor('home').href);
  addGroup('About', ['about', 'testimonials', 'generic', 'team']);
  const servicePage = entryFor('services');
  if (servicePage) {
    addMenuItem('Services', servicePage.href);
    if (selectedPages.some((page) => page.key === 'inside-services')) {
      exampleItems.services.slice(0, 3).forEach((item) => addMenuItem(`Services/${item.Title}`, { UrlType: 'Entity', Url: themeSiteUrl(`/services/${slugify(item.Title)}`, normalizedSiteDomain), ReferenceGuid: `DatastoreItem:${item.Name}` }));
    }
  }
  if (entryFor('projects')) addMenuItem('Projects', entryFor('projects').href);
  addGroup('Resources', ['gallery', 'blog', 'faqs']);
  if (entryFor('contact')) addMenuItem('Contact', entryFor('contact').href);
  menuNames.push(...pageMenuItems.filter((item) => !item.Name.slice('Main Menu/'.length).includes('/')).map((item) => item.Name.slice('Main Menu/'.length)));

  const dateStamp = '2026-01-01 12:00:00.000';
  const exampleDataById = new Map();
  for (const id of usedDatastoreIds) {
    const datastore = datastoresById.get(id);
    if (id === 'page-settings') {
      exampleDataById.set(id, [exampleSettingsItem(menuNames, logoName, selectedPages.some((page) => page.key === 'contact'), normalizedSiteDomain)]);
      continue;
    }
    const sourceItems = id === 'projects' ? exampleItems.projects.slice(0, projectLimit) : id === 'services' ? exampleItems.services.slice(0, 3) : exampleItems[id] || [];
    const sampleItems = sourceItems.map((item, index) => ({
      ...imageReadyDatastoreItem(item, datastore, (fieldId) => id === 'team-members' && fieldId === 'team_member_image' && teamMemberNames.length
        ? teamMemberNames[index % teamMemberNames.length]
        : imageForField(fieldId)),
      DatastoreGUID: datastore.name,
    }));
    exampleDataById.set(id, sampleItems);
  }
  const datastoreItemsByGuid = new Map(datastores.map((datastore) => [
    datastore.guidPlaceholder,
    exampleDataById.get(datastore.id) || [],
  ]));

  const datastoreRecords = [...usedDatastoreIds].map((id) => {
    const datastore = datastoresById.get(id);
    const record = {
      Name: datastore.name,
      Title: datastore.name,
      DatastoreType: id.replaceAll('-', ' '),
      CreatePageByDefault: false,
      DefaultRootPath: '',
      BrowserTitle: datastore.name,
      MetaDescription: `Example ${datastore.name} content.`,
      Keywords: '',
      MetaRobots: '',
      IncludeInSearch: false,
      Fields: clone(datastore.fields),
    };
    const listingPage = selectedPages.find((page) => themePageDefinitions[page.key].datastoreId === id);
    const detailPage = selectedPages.find((page) => themePageDefinitions[page.key].entityDatastoreId === id);
    const dataPage = datastorePageDefinitions[id];
    if (listingPage && dataPage) {
      record.CreatePageByDefault = true;
      record.DefaultRootPath = dataPage.rootPath || '';
      record.URL = themeSiteUrl(dataPage.route, normalizedSiteDomain);
      record.TemplateGUID = listingPage.templateName;
      record.IncludeInSearch = true;
    }
    if (detailPage && dataPage?.detailPageKey) {
      const detailDefinition = themePageDefinitions[dataPage.detailPageKey];
      record.DefaultTemplateGUID = detailDefinition.templateName;
      record.DefaultRootPath = dataPage.rootPath || `${dataPage.route}/`;
    }
    if (listingPage) {
      Object.assign(record, pageFieldsForInstances(pageInstances.get(listingPage.key), datastoreItemsByGuid, imageForField));
    }
    return record;
  });
  const datastoreItems = [...usedDatastoreIds].flatMap((id) => exampleDataById.get(id) || []);

  const detailItemPageKeys = ['inside-services', 'inside-projects'];
  for (const pageKey of detailItemPageKeys) {
    const page = selectedPages.find((entry) => entry.key === pageKey);
    if (!page) continue;
    const datastoreId = themePageDefinitions[pageKey].entityDatastoreId;
    const datastore = datastoresById.get(datastoreId);
    const pageValues = pageFieldsForInstances(pageInstances.get(pageKey), datastoreItemsByGuid, imageForField);
    const itemRecords = datastoreItems.filter((item) => item.DatastoreGUID === datastore.name);
    const dataPage = datastorePageDefinitions[datastoreId];
    itemRecords.forEach((item) => {
      item.TemplateGUID = themePageDefinitions[pageKey].templateName;
      item.URL = themeSiteUrl(`${dataPage.rootPath || `${dataPage.route}/`}${slugify(item.Title || item.Name)}`, normalizedSiteDomain);
      item.BrowserTitle = item.Title || item.Name;
      item.MetaDescription = 'Example detail content. Replace it with your own copy after import.';
      item.Keywords = '';
      item.MetaRobots = '';
      item.IncludeInSearch = true;
      Object.assign(item, clone(pageValues));
    });
  }

  const pageTemplates = [];
  for (const page of selectedPages) {
    const definition = themePageDefinitions[page.key];
    const instances = pageInstances.get(page.key);
    const componentPaths = instances.map((instance) => instance.partialName);
    const useSwiper = instances.some(({ component }) => ['testimonials-01', 'banner-04', 'project-detail-01'].includes(component.id));
    const markup = themePageMarkup('/_header.liquid', componentPaths, '/_footer.liquid');
    pageTemplates.push({
      Name: definition.templateName,
      Title: page.label,
      Type: 'page',
      RestrictedTypes: clone(definition.restrictedTypes),
      Markup: markup,
      _swiper: useSwiper,
    });
  }

  const headerMarkup = themeHeaderTemplate(header, { swiper: needsSwiper });
  const partialTemplates = [
    { Name: '/_header.liquid', Title: header.name, Type: 'partial', Markup: headerMarkup },
    { Name: '/_footer.liquid', Title: footer.name, Type: 'partial', Markup: footer.template },
    ...partialsByName.values().map(({ _partialKey, ...partial }) => partial),
  ];
  const templates = [...pageTemplates.map(({ _swiper, ...template }) => template), ...partialTemplates];

  const articleRecords = [];
  const errorPageRecords = [];
  for (const page of selectedPages) {
    const definition = themePageDefinitions[page.key];
    const instances = pageInstances.get(page.key);
    const fields = pageFieldsForInstances(instances, datastoreItemsByGuid, imageForField);
    if (hasContactForm && instances.some((instance) => fieldIdsWithTypes(instance.component.fields).some((field) => field.Type === 'form'))) {
      for (const instance of instances) {
        for (const field of fieldIdsWithTypes(instance.component.fields)) {
          if (field.Type === 'form') fields[instance.idMap.get(field.FieldID) || field.FieldID] = formName;
        }
      }
    }
    if (definition.errorPage) {
      errorPageRecords.push({
        Name: 'Example Error Page 404',
        Title: '404 Not Found',
        SiteDomainGUID: normalizedSiteDomain,
        ErrorCode: '0',
        URLFilter: '',
        URL: themeSiteUrl(definition.url, normalizedSiteDomain),
        TemplateGUID: definition.templateName,
        BrowserTitle: 'Page not found',
        MetaDescription: 'The requested page could not be found.',
        Keywords: '',
        MetaRobots: '',
        ContentHTML: null,
        ...fields,
      });
    } else if (definition.articleName) {
      articleRecords.push({ ...themeArticleBase(page, definition.templateName, dateStamp, normalizedSiteDomain), ...fields });
    }
  }

  const imagePresets = marketpathImagePresetJson(collectImagePresets(allInstances.map((instance) => instance.component))).ImagePreset;
  const needsGallery = selectedPages.some((page) => page.key === 'gallery')
    || [...pageInstances.values()].flat().some((instance) => instance.component.category === 'gallery');
  const needsBlog = selectedPages.some((page) => page.key === 'blog');
  const exampleTags = [...new Set([
    ...(needsGallery ? ['Interior', 'Exterior'] : []),
    ...(needsBlog ? ['Example', 'Planning'] : []),
  ])];
  const result = {
    Template: templates,
    Image: imageNames.map((name) => themeAssets ? ({
      Name: name,
      Title: name,
      Alt: name,
      Attribution: '',
      FileGUID: `image/${name}`,
      ...(needsGallery ? { Tags: ['Interior', 'Exterior'] } : {}),
    }) : ({
      Name: imageName,
      Title: 'Example placeholder',
      Alt: 'Example image placeholder',
      Attribution: '',
      FileGUID: `image/${imageName}`,
      ...(needsGallery ? { Tags: ['Interior', 'Exterior'] } : {}),
    })),
    ImagePreset: imagePresets,
    Datastore: datastoreRecords,
    ...(datastoreItems.length ? { DatastoreItem: datastoreItems } : {}),
    ...(articleRecords.length ? { Article: articleRecords } : {}),
    ...(errorPageRecords.length ? { ErrorPage: errorPageRecords } : {}),
    Menu: [{ Name: 'Main Menu' }],
    MenuItem: pageMenuItems,
  };

  if (hasContactForm) {
    const thankyou = selectedPages.find((page) => page.key === 'thankyou');
    result.Form = [{
      Name: formName,
      Title: formName,
      RedirectURL: thankyou
        ? { UrlType: 'Entity', Url: themeSiteUrl(thankyou.url, normalizedSiteDomain), ReferenceGuid: `Article:${thankyou.articleName}` }
        : { UrlType: 'Custom', Url: 'https://example.com/thank-you', ReferenceGuid: null },
      Fields: [
        { Type: 'text', IsRequired: true, IsReadonly: false, RequiredMessage: 'Please enter your name.', FieldID: 'name', Label: 'Name' },
        { Type: 'text', Validators: [{ Type: 'email' }], IsRequired: true, IsReadonly: false, RequiredMessage: 'Please enter a valid email.', FieldID: 'email', Label: 'Email' },
        { Type: 'textarea', IsRequired: false, IsReadonly: false, FieldID: 'message', Label: 'Message' },
        { Type: 'submit', TextIsHtml: false, ButtonText: 'Send message', FieldID: 'submit', Label: 'Send message', Classname: 'btn btn-primary' },
      ],
    }];
  }

  if (selectedPages.some((page) => page.key === 'blog')) {
    const blogTemplate = themePageDefinitions.blog.templateName;
    const blogName = 'Blog';
    result.Blog = [{
      Name: blogName,
      Title: blogName,
      CreatePageByDefault: true,
      DefaultRootPath: '/blog/',
      URL: themeSiteUrl('/blog', normalizedSiteDomain),
      TemplateGUID: blogTemplate,
      BrowserTitle: blogName,
      MetaDescription: 'Example articles and helpful ideas.',
      Keywords: '',
      MetaRobots: '',
      IncludeInSearch: true,
    }];
    const posts = [
      ['Example Article 1', 'A few practical ideas for planning your next project.'],
      ['Example Article 2', 'Simple ways to make everyday spaces work better.'],
      ['Example Article 3', 'What to consider before choosing materials and finishes.'],
    ];
    result.BlogPost = posts.map(([title, summary], index) => ({
      Name: title,
      Title: title,
      BlogGUID: blogName,
      PostDate: `2026-01-${String(index + 1).padStart(2, '0')} 12:00:00.000`,
      Tags: index === 0 ? ['Example'] : ['Planning'],
      URL: themeSiteUrl(`/blog/${slugify(title)}`, normalizedSiteDomain),
      TemplateGUID: blogTemplate,
      BrowserTitle: title,
      MetaDescription: summary,
      Keywords: '',
      MetaRobots: '',
      IncludeInSearch: true,
      ImageGUID: randomPhoto(),
      SummaryHTML: `<p>${summary}</p>`,
      ContentHTML: `<p>${summary}</p><p>Example content for this article. Replace it with your own writing after import.</p>`,
    }));
  }
  if (exampleTags.length) result.Tag = exampleTags.map((name) => ({ Name: name, Title: name }));

  return result;
}

/** Package a generated import JSON and its shared image asset in Marketpath's ZIP layout. */
export function createThemeImportZip({ packageData, placeholderImage, themeImages, themeVariables }) {
  if (!packageData) throw new Error('A Marketpath import package is required.');
  const files = { 'ALL.json': strToU8(JSON.stringify(packageData, null, 2)) };
  if (themeImages?.length) {
    for (const { name, bytes } of themeImages) files[`image/${name}`] = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  } else if (placeholderImage) {
    files['image/placeholder.jpg'] = placeholderImage instanceof Uint8Array ? placeholderImage : new Uint8Array(placeholderImage);
  }
  if (themeVariables) files['_variables.scss'] = strToU8(themeVariables);
  return zipSync(files, { level: 6 });
}

export function createThemeVariablesScss({ primary = '#063B6F', secondary = '#232323', dark = '#212529', light = '#F8F9FA', white = '#fff', fontFamily = 'Exo 2' } = {}) {
  const colors = { primary, secondary, dark, light, white };
  for (const [name, value] of Object.entries(colors)) {
    if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) throw new Error(`Invalid ${name} color.`);
  }
  const fonts = ['Exo 2', 'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Poppins', 'Inter'];
  if (!fonts.includes(fontFamily)) throw new Error('Choose a supported Google Font.');
  const googleFont = fontFamily.replaceAll(' ', '+');
  return `/** Marketpath theme variables; generated from the Playground. */
@import url('https://fonts.googleapis.com/css2?family=${googleFont}:ital,wght@0,100..900;1,100..900&display=swap');

$font-family-sans-serif: "${fontFamily}", system-ui, -apple-system, "Segoe UI", sans-serif;
$primary: ${primary};
$secondary: ${secondary};
$dark: ${dark};
$light: ${light};
$white: ${white};
$theme-colors: (
  "primary": $primary,
  "secondary": $secondary,
  "white": $white,
  "light": $light,
  "dark": $dark,
);
$lead-font-weight: 400;
$spacer: 1rem;
$spacers: (
  0: 0, 1: $spacer * .25, 2: $spacer * .5, 3: $spacer,
  4: $spacer * 1.5, 5: $spacer * 3, 6: $spacer * 4, 7: $spacer * 5,
  8: $spacer * 6, 9: $spacer * 7, 10: $spacer * 8, 11: $spacer * 9,
  12: $spacer * 10, 13: $spacer * 11, 14: $spacer * 12, 15: $spacer * 13,
);
$link-decoration: none;
$link-color: $secondary;
$link-hover-color: $secondary;
$dropdown-bg: $secondary;
$dropdown-min-width: 15rem;
$dropdown-padding-y: 0;
$dropdown-link-color: $white;
$dropdown-link-hover-bg: $primary;
$dropdown-item-padding-y: .75rem;
$dropdown-item-padding-x: 1.25rem;
$dropdown-spacer: 1.25rem;
$btn-link-color: #fff;
$btn-border-radius: 0;
$btn-padding-y: 1rem;
$btn-padding-x: 2.5rem;
$btn-font-weight: 700;

body {
  font-family: "${fontFamily}", sans-serif;
  font-optical-sizing: auto;
}
`;
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
    result.Article[0].BrowserTitle = `${component.name} Example`;
    result.Article[0].MetaDescription = `Example content for ${component.name}.`;
    result.Article[0].URL = `/${slugify(component.id)}-example`;
    result.Article[0].TemplateGUID = pageTemplate.Name;
    result.Article[0][listField.FieldID] = items.map((item) => item.Name);
  }

  return result;
}

export function createComponentImport({ component, datastores = [], siteDomain = '', pagePath = '', includeTemplate = true, includeFields = true, includeDatastore = true, includeExamples = true, includePageExample = false }) {
  const requiredDatastores = componentDatastoreIds(component);
  let exampleHost;
  const examplePath = String(pagePath).trim() || (component.entityDatastoreId === 'services' ? '/services/' : `/${slugify(component.name)}-example`);
  if (includePageExample) {
    if (!includeExamples) throw new Error('Include example content to create a page example.');
    try {
      const domain = String(siteDomain).trim();
      if (!domain) throw new Error();
      const parsed = new URL(/^(?:https?:)?\/\//i.test(domain) ? domain.replace(/^\/\//, 'https://') : `https://${domain}`);
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error();
      exampleHost = parsed.host;
    } catch {
      throw new Error('Enter the target site domain without a page path.');
    }
    if (!/^\/(?!\/)[^?#\\\s]*$/.test(examplePath)) throw new Error('Enter a page route starting with /, without a domain, query, or fragment.');
  }
  if (includePageExample && (!includeTemplate || (component.fields?.length && !includeFields))) {
    throw new Error('Include the template and Page Fields to create a page example.');
  }
  if (includeExamples && requiredDatastores.length && !includeDatastore) {
    throw new Error('Include the datastore to create example content for this component.');
  }

  const result = component.category === 'services' && component.datastoreId === 'services'
    ? createServicesComponentImport({ component, datastores, createFiles: includeExamples })
    : createMarketpathImport({
      blocks: [{ id: component.id }],
      pageName: `${component.name} Example`,
      components: [component],
      datastores,
      createTextExamples: includeExamples,
    });

  const partial = result.Template.find((template) => template.Type === 'partial');
  if (!partial) throw new Error(`Could not create the ${component.name} template.`);

  let serviceDetailTemplateName;
  let serviceDetailFields = {};

  if (component.category === 'inside-services' && component.entityDatastoreId === 'services') {
    serviceDetailTemplateName = '/pages/_individual_service.liquid';
    const pageTemplate = result.Template.find((template) => template.Type === 'page');
    if (!pageTemplate) throw new Error('Could not create the Services detail page template.');
    pageTemplate.Name = serviceDetailTemplateName;
    pageTemplate.Title = component.name;
    pageTemplate.RestrictedTypes = 'DatastoreItem:services';
    partial.Name = '/partials/inside-services/services-individual-01.liquid';
    partial.Title = component.name;
    pageTemplate.Markup = pageMarkup([partial.Name], { bootstrapJs: component.bootstrapJs, swiper: false });
    if (result.Article?.[0]) {
      const article = result.Article[0];
      serviceDetailFields = Object.fromEntries(fieldIds(component.fields).filter((id) => id in article).map((id) => [id, article[id]]));
    }
    delete result.Article;
  }

  if (serviceDetailTemplateName && includeDatastore && includeTemplate && includePageExample) {
    const servicesDatastore = result.Datastore?.find((datastore) => datastore.Name === 'Services');
    if (!servicesDatastore) throw new Error('The Services datastore schema is missing from the import.');
    servicesDatastore.DefaultTemplateGUID = serviceDetailTemplateName;
    const serviceRootPath = component.entityDatastoreId === 'services' ? `${examplePath.replace(/\/+$/, '')}/` : '/services/';
    servicesDatastore.DefaultRootPath = serviceRootPath;
    for (const item of result.DatastoreItem || []) {
      if (item.DatastoreGUID !== 'Services') continue;
      item.TemplateGUID = serviceDetailTemplateName;
      item.URL = `${serviceRootPath}${slugify(item.Title || item.Name)}`;
      item.BrowserTitle = item.Title || item.Name;
      item.MetaDescription = 'Example service detail content. Replace it with your own copy after import.';
      item.Keywords = '';
      item.MetaRobots = '';
      item.IncludeInSearch = true;
    }
  }
  for (const item of result.DatastoreItem || []) {
    if (item.DatastoreGUID === 'Services') Object.assign(item, clone(serviceDetailFields));
  }

  if (!includeTemplate) {
    partial.Markup = '';
    result.Template = result.Template.filter((template) => template.Type !== 'page');
  }
  if (!includeFields) delete partial.Fields;
  if (!includeDatastore) delete result.Datastore;
  if (includeTemplate) {
    const presets = collectImagePresets([component]);
    if (presets.length) result.ImagePreset = marketpathImagePresetJson(presets).ImagePreset;
  }
  if (!includeExamples) {
    delete result.Article;
    delete result.DatastoreItem;
  } else {
    if (result.Article?.[0]) fillImageFields(component.fields, result.Article[0], new Map(), () => 'placeholder.jpg');
    for (const item of result.DatastoreItem || []) {
      const datastore = datastores.find((schema) => schema.name === item.DatastoreGUID);
      if (datastore) fillImageFields(datastore.fields, item, new Map(), () => 'placeholder.jpg');
    }
    const hasImageField = (fields) => (fields || []).some((field) =>
      ['image', 'imagelist'].includes(field.Type) || hasImageField(field.Fields));
    const usesImages = hasImageField(component.fields) || requiredDatastores.some((id) => {
      const datastore = datastores.find((schema) => schema.id === id);
      return hasImageField(datastore?.fields);
    });
    if (usesImages) result.Image = [{
      Name: 'placeholder.jpg',
      Title: 'Example placeholder',
      Alt: 'Example image placeholder',
      Attribution: '',
      FileGUID: 'image/placeholder.jpg',
      ...(component.category === 'gallery' ? { Tags: ['Interior', 'Exterior'] } : {}),
    }];
    if (component.category === 'gallery') result.Tag = ['Interior', 'Exterior'].map((name) => ({ Name: name, Title: name }));
    if (includePageExample) {
      for (const article of result.Article || []) article.URL = themeSiteUrl(examplePath, exampleHost);
      for (const item of result.DatastoreItem || []) {
        if (item.URL?.startsWith('/') && !item.URL.startsWith('//')) item.URL = themeSiteUrl(item.URL, exampleHost);
      }
    }
  }
  if (!includePageExample) delete result.Article;
  return result;
}

export { slugify as marketpathSlug };
