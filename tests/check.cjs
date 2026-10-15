// Run: node tests/check.cjs — no packages or CMS credentials required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.join(__dirname, '..');
  const catalogRoot = path.join(root, 'src/catalog');
  const datastoreRoot = path.join(root, 'src/datastores');
  const { footerMarkupForTheme, footerTemplateForTheme } = await import(pathToFileURL(path.join(root, 'src/lib/footer-theme.js')).href);
  const { categoryGroupsFor, categoryLabel } = await import(pathToFileURL(path.join(root, 'src/lib/utils.js')).href);
  const { collectImagePresets, marketpathImagePresetJson } = await import(pathToFileURL(path.join(root, 'src/lib/image-presets.js')).href);
  function findFiles(directory, targetName) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findFiles(entryPath, targetName);
      return entry.name === targetName ? [entryPath] : [];
    });
  }
  const records = await Promise.all(findFiles(catalogRoot, 'component.js').map(async (file) => {
    const module = await import(pathToFileURL(file).href);
    return { file, component: module.default };
  }));
  const datastoreRecords = await Promise.all(findFiles(datastoreRoot, 'datastore.js').map(async (file) => {
    const module = await import(pathToFileURL(file).href);
    return { file, datastore: module.default };
  }));
  const components = records.map(({ component }) => component);
  const datastores = datastoreRecords.map(({ datastore }) => datastore);
  const imagePresets = collectImagePresets(components);
  const imagePresetImport = marketpathImagePresetJson(imagePresets);
  assert.deepEqual(imagePresets.map((preset) => preset.code).sort(), [
    '1200x675-crop',
    '1920x1080-crop',
    '1920x600-crop',
    '200x200-crop',
    '240x160-crop',
    '300x300-max',
    '480x320-crop',
    '600x338-crop',
    '700x394-crop',
    '720x480-crop',
    '800x450-crop',
    '800x600-crop',
    '960x540-crop',
    'webp',
  ]);
  const presetByCode = Object.fromEntries(imagePresets.map((preset) => [preset.code, preset]));
  assert.equal(presetByCode['800x600-crop'].queryString, 'height=600&mode=crop&width=800');
  assert.equal(presetByCode['300x300-max'].queryString, 'maxheight=300&maxwidth=300');
  assert.equal(presetByCode['480x320-crop'].queryString, 'height=320&mode=crop&width=480');
  assert.equal(presetByCode['240x160-crop'].queryString, 'height=160&mode=crop&width=240');
  assert.equal(presetByCode['800x450-crop'].queryString, 'height=450&mode=crop&width=800');
  assert.equal(presetByCode.webp.queryString, 'format=webp');
  assert(presetByCode.webp.components.some((component) => component.id === 'projects-01'));
  assert(!presetByCode['800x450-crop webp']);
  assert(presetByCode['800x600-crop'].components.some((component) => component.id === 'content-03'));
  const webpComponentIds = new Set(presetByCode.webp.components.map((component) => component.id));
  for (const preset of imagePresets.filter((entry) => /^\d/.test(entry.code))) {
    for (const component of preset.components) assert(webpComponentIds.has(component.id), `${component.id}: image preset ${preset.code} must also request the separate webp preset`);
  }
  assert.deepEqual(Object.keys(imagePresetImport), ['ImagePreset']);
  assert(imagePresetImport.ImagePreset.every((preset) => preset.Code && preset.QueryString));
  assert(!imagePresetImport.ImagePreset.some((preset) => preset.Code.includes(' ')));
  const categoryGroups = categoryGroupsFor([...new Set(components.map((component) => component.category))]);
  assert.deepEqual(categoryGroups.map((group) => group.label), ['Services', 'Projects', 'Layout', 'Resources', 'Content']);
  assert.deepEqual(categoryGroups.find((group) => group.id === 'services').categories, ['services', 'inside-services']);
  assert.deepEqual(categoryGroups.find((group) => group.id === 'projects').categories, ['projects', 'inside-projects']);
  assert.deepEqual(categoryGroups.find((group) => group.id === 'layout').categories, ['hero', 'header', 'footer', 'banner', 'page-title', 'cta', 'thank-you', 'error-404']);
  assert.deepEqual(categoryGroups.find((group) => group.id === 'resources').categories, ['blog', 'faq', 'gallery']);
  assert.deepEqual(categoryGroups.find((group) => group.id === 'content').categories, ['content', 'contact', 'testimonials', 'team']);
  assert(!categoryGroups.find((group) => group.id === 'content').categories.includes('projects'));
  assert.equal(categoryLabel('inside-services'), 'Inside Services');
  assert.equal(categoryLabel('inside-projects'), 'Inside Projects');
  assert.equal(categoryLabel('thank-you'), 'Thank You');
  assert.equal(categoryLabel('error-404'), 'Error 404');
  assert(components.length > 0, 'catalog is empty');
  assert(datastores.length > 0, 'no datastore schemas found');
  assert.equal(new Set(components.map(c => c.id)).size, components.length, 'duplicate component ids');
  assert.equal(new Set(datastores.map(d => d.id)).size, datastores.length, 'duplicate datastore ids');
  const allFields = new Map();
  let total = 0;
  for (const { file, component: c } of records) {
    assert.equal(path.basename(path.dirname(file)), c.id, `${c.id}: folder must match component id`);
    assert.equal(path.basename(path.dirname(path.dirname(file))), c.category, `${c.id}: parent folder must match category`);
    const expectedPrefix = c.sharedFieldsId ? `${c.sharedFieldsId}_` : c.id.replaceAll('-', '_') + '_';
    assert.equal(c.prefix, expectedPrefix);
    assert(c.preview.html && c.template && c.tags.length);
    assert(!c.preview.html.includes('{%') && !c.preview.html.includes('{{'), `${c.id}: preview contains Liquid`);
    assert.equal(c.customJs, /add_javascript/.test(c.template), `${c.id}: inaccurate JS metadata`);
    assert(!/<script|<style|{{#if|py-lg-8|entity\.is_valid/.test(c.template));
    assert.equal(c.customCss, /style=|style\s*:/.test(c.template) || /add_stylesheet\s+inline/.test(c.template), `${c.id}: inaccurate CSS metadata`);
    const fields = new Map();
    const itemFields = new Set();
    const componentFieldTypes = [];
    function registerField(field) {
      const definition = JSON.stringify(field);
      const previous = allFields.get(field.FieldID);
      if (previous) {
        assert(c.sharedFieldsId && previous.sharedFieldsId === c.sharedFieldsId && previous.definition === definition, `Duplicate ${field.FieldID}`);
        return;
      }
      allFields.set(field.FieldID, { sharedFieldsId: c.sharedFieldsId, definition });
      total++;
    }
    function visit(list) {
      for (const f of list) {
        if (f.Type === 'group') { assert(!f.FieldID); assert(f.Fields.length); visit(f.Fields); continue; }
        componentFieldTypes.push(f.Type);
        if (f.Type === 'fieldset') {
          assert(f.FieldID.startsWith(c.prefix) && /^[a-z0-9_]+$/.test(f.FieldID));
          assert(f.AllowMultiple && f.Fields.length, `${f.FieldID}: repeatable fieldset needs Fields`);
          registerField(f); fields.set(f.FieldID, f);
          for (const child of f.Fields) {
            assert(['text', 'textarea', 'url', 'image', 'toggle', 'html', 'select'].includes(child.Type));
            assert(/^[a-z0-9_]+$/.test(child.FieldID), `${f.FieldID}: invalid item FieldID ${child.FieldID}`);
            itemFields.add(child.FieldID);
            if (child.Type === 'select') assert(child.Options && child.Delimiter, `${child.FieldID}: select needs Options and Delimiter`);
          }
          continue;
        }
        assert(['text', 'textarea', 'url', 'image', 'toggle', 'html', 'select', 'radio', 'taglist', 'imagelist', 'datastoreitem', 'datastoreitemlist', 'form'].includes(f.Type));
        if (['select', 'radio'].includes(f.Type)) assert(f.Options && f.Delimiter, `${f.FieldID}: ${f.Type} needs Options and Delimiter`);
        if (f.Type === 'radio') assert(!f.Validators, `${f.FieldID}: radio fields do not support Validators`);
        if (['datastoreitem', 'datastoreitemlist'].includes(f.Type)) assert(f.DatastoreGUID, `${f.FieldID}: datastore reference needs DatastoreGUID`);
        const isSharedFieldId = c.sharedFieldIds?.includes(f.FieldID);
        assert((f.FieldID.startsWith(c.prefix) || isSharedFieldId) && /^[a-z0-9_]+$/.test(f.FieldID), `${c.id}: FieldID ${f.FieldID} must start with ${c.prefix} unless explicitly shared, and use lowercase letters, digits, and underscores`);
        registerField(f); fields.set(f.FieldID, f);
        if (['image', 'toggle'].includes(f.Type)) assert(!f.Validators);
      }
    }
    visit(c.fields);
    const datastoreReferenceTypes = ['datastoreitem', 'datastoreitemlist'];
    const hasDatastoreItems = componentFieldTypes.some((type) => datastoreReferenceTypes.includes(type));
    const componentDatastoreIds = new Set([...(c.datastoreIds || []), ...(c.datastoreId ? [c.datastoreId] : [])]);
    assert(!hasDatastoreItems || componentDatastoreIds.size > 0, `${c.id}: datastore fields must declare their datastoreId/datastoreIds`);
    assert(componentDatastoreIds.size === 0 || hasDatastoreItems || Boolean(c.entityDatastoreId), `${c.id}: datastore schemas without field references must be the root entity datastore`);
    for (const id of componentDatastoreIds) {
      const datastore = datastores.find((entry) => entry.id === id);
      assert(datastore, `${c.id}: unknown datastoreId ${id}`);
      assert(datastore.name && Array.isArray(datastore.fields) && datastore.fields.length, `${c.id}: datastore schema is empty`);
    }
    if (c.entityDatastoreId) {
      assert(datastores.some((entry) => entry.id === c.entityDatastoreId), `${c.id}: unknown entityDatastoreId ${c.entityDatastoreId}`);
      assert(componentDatastoreIds.has(c.entityDatastoreId), `${c.id}: entityDatastoreId must be included in datastoreIds`);
    }
    for (const field of fields.values()) {
      if (!datastoreReferenceTypes.includes(field.Type)) continue;
      const guids = Array.isArray(field.DatastoreGUID) ? field.DatastoreGUID : [field.DatastoreGUID];
      for (const guid of guids) {
        const datastore = datastores.find((entry) => entry.guidPlaceholder === guid);
        assert(datastore, `${c.id}: unknown DatastoreGUID ${guid}`);
        assert(componentDatastoreIds.has(datastore.id), `${c.id}: ${field.FieldID} references ${datastore.id} but it is not declared`);
      }
    }
    const entityDatastore = c.entityDatastoreId && datastores.find((entry) => entry.id === c.entityDatastoreId);
    const entityDatastoreFieldIds = new Set();
    function visitEntityDatastoreFields(list) {
      for (const field of list || []) {
        if (field.Type === 'group') visitEntityDatastoreFields(field.Fields);
        else if (field.FieldID) entityDatastoreFieldIds.add(field.FieldID);
      }
    }
    if (entityDatastore) visitEntityDatastoreFields(entityDatastore.fields);
    for (const f of fields.values()) {
      assert(c.template.includes(`entity.${f.FieldID}`), `${f.FieldID}: unused field`);
      if (f.Condition) assert(fields.has(f.Condition.FieldID));
      if (f.Type === 'url') assert(c.template.includes(`${f.FieldID}.value | escape`));
    }
    const stack = [];
    for (const token of c.template.matchAll(/{%-?([\s\S]*?)-?%}|{{([\s\S]*?)}}/g)) {
      const text = (token[1] || token[2]).trim();
      if (text.startsWith('if ')) stack.push(text);
      else if (text === 'endif') assert(stack.pop(), `${c.id}: extra endif`);
      else {
        for (const ref of text.matchAll(/entity\.([a-z0-9_]+)/g)) {
          // MPSS1 exposes these entity properties as built-ins, not Page Custom Fields.
          if (['full_url', 'url', 'title', 'browser_title', 'object_type', 'parent_page'].includes(ref[1])) continue;
          if (fields.has(ref[1])) {
            assert(stack.some(condition => condition.includes(`entity.${ref[1]}.is_valid`)), `${ref[1]}: unguarded output`);
          } else {
            assert(entityDatastoreFieldIds.has(ref[1]), `${c.id}: unknown field ${ref[1]}`);
            assert(stack.some(condition => condition.includes(`entity.${ref[1]}.is_valid`)), `${ref[1]}: unguarded datastore output`);
          }
        }
        for (const ref of text.matchAll(/item\.([a-z0-9_]+)/g)) {
          assert(itemFields.has(ref[1]), `${c.id}: unknown fieldset item field ${ref[1]}`);
          assert(stack.some(condition => condition.includes(`item.${ref[1]}.is_valid`)), `${ref[1]}: unguarded fieldset item output`);
        }
      }
    }
    assert.equal(stack.length, 0, `${c.id}: unclosed if`);
    const ids = [...c.preview.html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const m of c.preview.html.matchAll(/data-bs-target="#([^"]+)"/g)) assert(ids.includes(m[1]));
  }
  for (const { file, datastore } of datastoreRecords) {
    assert.equal(path.basename(path.dirname(file)), datastore.id, `${datastore.id}: datastore folder must match its id`);
    assert(datastore.name && datastore.guidPlaceholder && datastore.fields.length, `${datastore.id}: incomplete schema metadata`);
  }
  for (const component of components.filter((entry) => entry.settingsDatastoreId)) {
    const datastore = datastores.find((entry) => entry.id === component.settingsDatastoreId);
    assert(datastore, `${component.id}: unknown settingsDatastoreId ${component.settingsDatastoreId}`);
    if (component.template.includes('datastore:')) {
      assert(component.template.includes(datastore.guidPlaceholder), `${component.id}: Settings datastore GUID does not match its shared schema`);
    }
  }
  const contactPage = components.find((component) => component.id === 'contact-01');
  assert(contactPage);
  assert.equal(contactPage.settingsDatastoreId, 'page-settings');
  const contactFields = contactPage.fields[0].Fields;
  assert.deepEqual(contactFields.map((field) => field.FieldID), [
    'contact_01_title',
    'contact_01_description',
    'contact_01_form',
    'contact_01_google_maps_embed_url',
  ]);
  assert.equal(contactFields[0].IsRequired, false);
  assert.equal(contactFields[0].RequiredMessage, 'This field is required');
  assert.equal(contactFields[2].Type, 'form');
  assert(contactPage.template.includes('entity.contact_01_google_maps_embed_url.value | escape'));
  assert(contactPage.notes.some((note) => note.includes('Redirect URL to /thank-you')));
  const contactComponents = components.filter((component) => component.category === 'contact');
  assert.deepEqual(contactComponents.map((component) => component.id).sort(), ['contact-01', 'contact-02', 'contact-main']);
  assert(contactComponents.every((component) => component.sharedFieldsId === 'contact_01'));
  assert(contactComponents.every((component) => JSON.stringify(component.sharedFieldIds) === JSON.stringify(contactPage.sharedFieldIds)));
  assert(contactComponents.every((component) => JSON.stringify(component.fields[0].Fields) === JSON.stringify(contactFields)));
  assert(contactComponents.every((component) => !component.customJs));
  assert(contactComponents.every((component) => component.template.includes('<div class="contact-form">{{ entity.contact_01_form }}</div>')));
  assert(contactComponents.every((component) => !component.template.includes('/marketpath/form-bootstrap5/v2/bootstrap5-form.liquid')));
  assert(contactComponents.every((component) => component.notes.some((note) => note.includes('Redirect URL to /thank-you'))));
  const contact02 = contactComponents.find((component) => component.id === 'contact-02');
  assert(!contact02.template.includes('contact-02-form-step'));
  assert(!contact02.preview.html.includes('contact-02-form-step'));
  assert.deepEqual(contact02.fields[1].Fields.map((field) => field.FieldID), ['contact_01_form_eyebrow', 'contact_01_form_title']);
  assert(contact02.template.includes('entity.contact_01_form_eyebrow.is_valid'));
  assert(contact02.template.includes('{{ entity.contact_01_form_eyebrow }}'));
  assert(contact02.template.includes('entity.contact_01_form_title.is_valid'));
  assert(contact02.template.includes('{{ entity.contact_01_form_title }}'));
  const contactMain = contactComponents.find((component) => component.id === 'contact-main');
  assert(contactMain.template.indexOf('class="contact-main-social') < contactMain.template.indexOf('<iframe'));
  assert(contactMain.preview.html.indexOf('class="contact-main-social') < contactMain.preview.html.indexOf('class="contact-main-map-art'));
  const thankYouComponents = components.filter((component) => component.category === 'thank-you');
  assert.deepEqual(thankYouComponents.map((component) => component.id).sort(), ['thank-you-01', 'thank-you-02']);
  assert(thankYouComponents.every((component) => component.sharedFieldsId === 'thank_you'));
  assert(thankYouComponents.every((component) => JSON.stringify(component.sharedFieldIds) === JSON.stringify(thankYouComponents[0].sharedFieldIds)));
  assert(thankYouComponents.every((component) => JSON.stringify(component.fields[0].Fields) === JSON.stringify(thankYouComponents[0].fields[0].Fields)));
  assert(thankYouComponents.every((component) => component.customCss));
  assert(thankYouComponents.find((component) => component.id === 'thank-you-01').template.includes('width: 4.5rem;\n  height: 4.5rem;'));
  assert(thankYouComponents.find((component) => component.id === 'thank-you-02').template.includes('width: 5rem;\n  height: 5rem;'));
  const thankYou02 = thankYouComponents.find((component) => component.id === 'thank-you-02');
  const thankYou02ExtraFields = thankYou02.fields[1].Fields;
  assert.deepEqual(thankYou02ExtraFields.map((field) => field.FieldID), [
    'thank_you_completion_eyebrow',
    'thank_you_completion_title',
    'thank_you_completion_description',
    'thank_you_next_steps_title',
    'thank_you_next_step_1',
    'thank_you_next_step_2',
    'thank_you_next_step_3',
  ]);
  for (const field of thankYou02ExtraFields) {
    assert(thankYou02.template.includes(`entity.${field.FieldID}.is_valid`));
    assert(thankYou02.template.includes(`{{ entity.${field.FieldID} }}`));
  }
  const error404 = components.find((component) => component.id === 'error-404');
  assert(error404);
  assert.equal(error404.category, 'error-404');
  assert.deepEqual(error404.fields[0].Fields.map((field) => field.FieldID), [
    'error_404_title',
    'error_404_description',
    'error_404_button_text',
    'error_404_button_link',
  ]);
  assert(error404.template.includes('entity.error_404_button_link.value | escape'));
  const sharedFields = new Map();
  for (const component of components.filter((entry) => entry.sharedFieldsId)) {
    const allDefinitions = new Map();
    function collectDefinitions(list) {
      for (const field of list || []) {
        if (field.Type === 'group') collectDefinitions(field.Fields);
        else if (field.FieldID) allDefinitions.set(field.FieldID, field);
      }
    }
    collectDefinitions(component.fields);
    const sharedIds = component.sharedFieldIds || null;
    if (sharedIds) for (const id of sharedIds) assert(allDefinitions.has(id), `${component.id}: unknown shared FieldID ${id}`);
    const definition = sharedIds
      ? JSON.stringify(sharedIds.map((id) => allDefinitions.get(id)))
      : JSON.stringify(component.fields);
    const previous = sharedFields.get(component.sharedFieldsId);
    if (previous) assert.equal(definition, previous, `${component.sharedFieldsId}: shared Page Fields must match for all shared FieldIDs`);
    else sharedFields.set(component.sharedFieldsId, definition);
  }
  const ctaVariants = components.filter((component) => ['cta-01', 'cta-02'].includes(component.id));
  assert.equal(ctaVariants.length, 2, 'both CTA variants must be present');
  assert(ctaVariants.every((component) => component.sharedFieldsId === 'cta' && component.datastoreId === 'call-to-action'));
  assert(ctaVariants.every((component) => JSON.stringify(component.fields) === JSON.stringify(ctaVariants[0].fields)));
  assert.equal(ctaVariants[0].fields[0].Fields[0].FieldID, 'cta_datastore_item');
  assert.equal(ctaVariants[0].fields[0].Fields[0].Type, 'datastoreitem');
  const ctaDatastore = datastores.find((datastore) => datastore.id === 'call-to-action');
  assert(ctaDatastore, 'Call to Action datastore schema is missing');
  const ctaItemIds = ctaDatastore.fields.flatMap((group) => group.Fields.map((field) => field.FieldID));
  assert.deepEqual(ctaItemIds, ['cta_eyebrow', 'cta_title', 'cta_description', 'cta_button_text', 'cta_button_link'], 'CTA datastore fields must use the cta_ prefix');
  for (const variant of ctaVariants) {
    for (const id of ctaItemIds) assert(variant.template.includes(`cta.${id}`), `${variant.id}: template must read cta.${id}`);
    assert.doesNotMatch(variant.template, /cta\.(eyebrow|title|description|button_text|button_link)\b/, `${variant.id}: template still uses unprefixed datastore fields`);
  }
  const servicesDatastore = datastores.find((datastore) => datastore.id === 'services');
  assert(servicesDatastore, 'Services datastore schema is missing');
  const serviceItemFields = servicesDatastore.fields.flatMap((group) => group.Fields);
  assert.deepEqual(serviceItemFields.map((field) => field.FieldID), ['services_image', 'services_summary', 'services_content']);
  assert.deepEqual(serviceItemFields.map((field) => field.Type), ['image', 'html', 'html']);
  for (const field of serviceItemFields) {
    assert(field.FieldID.startsWith('services_'), `${field.FieldID}: Services datastore fields must use the services_ prefix`);
    assert(!allFields.has(field.FieldID), `${field.FieldID}: Services datastore field collides with a page Custom Field`);
  }
  const serviceComponents = components.filter((component) => component.datastoreId === 'services');
  assert.deepEqual(serviceComponents.map((component) => component.id).sort(), ['services-01', 'services-02', 'services-03', 'services-04']);
  assert(serviceComponents.every((component) => component.sharedFieldsId === 'services' && component.prefix === 'services_'));
  assert(serviceComponents.every((component) => JSON.stringify(component.fields) === JSON.stringify(serviceComponents[0].fields)), 'Services variants must expose identical shared Page Fields');
  const servicesPageFieldIds = serviceComponents[0].fields.flatMap((group) => group.Fields.map((field) => field.FieldID));
  assert.deepEqual(servicesPageFieldIds, ['services_eyebrow', 'services_title', 'services_description', 'services_items']);
  for (const component of serviceComponents) {
    const listField = component.fields.flatMap((field) => field.Fields || []).find((field) => field.Type === 'datastoreitemlist');
    assert(listField, `${component.id}: missing Services datastore list field`);
    assert.match(component.template, /{{\s*service\.title\s*}}/, `${component.id}: cards must use the datastore item's default title`);
    const fieldsUsed = component.id === 'services-01'
      ? serviceItemFields.map((field) => field.FieldID)
      : ['services-02', 'services-04'].includes(component.id) ? ['services_image', 'services_summary'] : ['services_image'];
    for (const id of fieldsUsed) assert(component.template.includes(`service.${id}`), `${component.id}: template must read ${id}`);
  }
  for (const serviceId of ['services-01', 'services-02', 'services-04']) {
    const serviceComponent = serviceComponents.find((component) => component.id === serviceId);
    assert(serviceComponent.template.includes("preset:'240x160-crop webp'"));
    assert(serviceComponent.template.includes("preset:'480x320-crop webp'"));
    assert(serviceComponent.template.includes("preset:'720x480-crop webp'"));
    assert(serviceComponent.template.includes('srcset='));
  }
  const serviceCards = components.find((component) => component.id === 'services-01');
  const serviceCardsSummaryPosition = serviceCards.template.indexOf('service.services_summary');
  const serviceCardsContentPosition = serviceCards.template.indexOf('service.services_content');
  const serviceCardsLinkPosition = serviceCards.template.indexOf('service.full_url');
  assert(serviceCardsSummaryPosition >= 0 && serviceCardsContentPosition > serviceCardsSummaryPosition && serviceCardsLinkPosition > serviceCardsContentPosition, 'Service Cards render summary, rich content, then link');
  const stackServices = components.find((component) => component.id === 'services-02');
  assert.doesNotMatch(stackServices.template, /service\.services_content|service-content/);
  assert(stackServices.template.includes('service.services_summary'));
  assert(stackServices.preview.html.includes('Open up your space with quality, comfort, and a fresh perspective.'));
  assert.doesNotMatch(stackServices.preview.html, /Thoughtful upgrades for a more comfortable home/);
  const alternatingServices = components.find((component) => component.id === 'services-04');
  assert(alternatingServices.template.includes('forloop.index0 | modulo: 2'));
  assert(alternatingServices.template.includes('flex-lg-row-reverse'));
  assert(alternatingServices.template.includes('bg-primary'));
  assert(alternatingServices.template.includes('bg-dark'));
  assert(alternatingServices.template.includes('service.services_summary'));
  assert(!alternatingServices.template.includes('bi-arrow-up-right-square-fill'));
  assert(!alternatingServices.preview.html.includes('bi-arrow-up-right-square-fill'));
  assert.doesNotMatch(alternatingServices.template, /service\.services_content/);
  const faqsDatastore = datastores.find((datastore) => datastore.id === 'faqs');
  assert(faqsDatastore);
  assert.equal(faqsDatastore.fields[0].Fields[0].FieldID, 'faq_answer');
  assert.equal(faqsDatastore.fields[0].Fields[0].Type, 'html');
  const faq02 = components.find((component) => component.id === 'faq-02');
  assert(faq02);
  assert.equal(faq02.datastoreId, 'faqs');
  assert(faq02.template.includes('faq.title'));
  assert(faq02.template.includes('faq.faq_answer'));
  const serviceDetail = components.find((component) => component.id === 'services-individual-01');
  assert(serviceDetail);
  assert.equal(serviceDetail.category, 'inside-services');
  assert.deepEqual([...serviceDetail.datastoreIds].sort(), ['faqs', 'services']);
  assert.equal(serviceDetail.entityDatastoreId, 'services');
  assert(serviceDetail.template.includes('class="btn btn-outline-primary text-center"'));
  assert(serviceDetail.preview.html.includes('class="btn btn-outline-primary text-center"'));
  assert(serviceDetail.template.includes('entity.services_image'));
  assert(serviceDetail.template.includes('entity.services_summary'));
  assert(serviceDetail.template.includes('entity.services_content'));
  assert(serviceDetail.template.includes('faq.faq_answer'));
  const serviceDetailFields = serviceDetail.fields[0].Fields;
  assert.equal(serviceDetailFields.find((field) => field.FieldID === 'services_individual_01_links').DatastoreGUID, servicesDatastore.guidPlaceholder);
  assert.equal(serviceDetailFields.find((field) => field.FieldID === 'services_individual_01_faqs').DatastoreGUID, faqsDatastore.guidPlaceholder);
  const projectsDatastore = datastores.find((datastore) => datastore.id === 'projects');
  assert(projectsDatastore);
  assert.equal(projectsDatastore.guidPlaceholder, 'd305845c-b6c1-45c9-9ebc-4ed879ee7016');
  const projectItemFields = projectsDatastore.fields.flatMap((group) => group.Fields);
  assert.deepEqual(projectItemFields.map((field) => field.FieldID), ['project_image', 'project_summary', 'project_content', 'project_images', 'projects_details', 'project_overview']);
  assert.equal(projectItemFields.find((field) => field.FieldID === 'project_summary').Type, 'html');
  assert.equal(projectItemFields.find((field) => field.FieldID === 'project_content').Type, 'html');
  const projectCards = components.find((component) => component.id === 'projects-01');
  assert(projectCards);
  assert.equal(projectCards.category, 'projects');
  assert.equal(projectCards.datastoreId, 'projects');
  assert.equal(projectCards.customCss, true);
  assert(projectCards.template.includes('project.project_summary') === false, 'Project cards show the title/action, not detail summary/content');
  assert(projectCards.template.includes('project.project_image'));
  assert(projectCards.template.includes('project.project_images'));
  assert(projectCards.template.includes('project.full_url | escape'));
  assert.match(projectCards.template, /<a href="\{\{ project\.full_url \| escape \}\}" class="project-card/);
  assert(projectCards.template.includes('translateY(calc(100% - 6rem))'));
  assert(projectCards.template.includes('project-card-action { min-height: 4rem; }'));
  assert(projectCards.template.includes('project-card:focus-visible'));
  assert(projectCards.template.includes('@media (hover: none)'));
  const projectDetail = components.find((component) => component.id === 'project-detail-01');
  assert(projectDetail);
  assert.equal(projectDetail.category, 'inside-projects');
  assert.deepEqual(projectDetail.datastoreIds, ['projects']);
  assert.equal(projectDetail.entityDatastoreId, 'projects');
  assert.equal(projectDetail.customCss, true);
  assert.equal(projectDetail.customJs, true);
  assert(projectDetail.template.includes('entity.project_images'));
  assert(projectDetail.template.includes('entity.projects_details'));
  assert(projectDetail.template.includes('entity.project_overview'));
  assert(projectDetail.template.includes('entity.project_detail_01_button_1_link.value | escape'));
  assert(projectDetail.template.includes('project-detail-pagination'));
  assert(projectDetail.template.includes('new Swiper(slider'));
  const testimonialsDatastore = datastores.find((datastore) => datastore.id === 'testimonials');
  const testimonialItemFields = testimonialsDatastore.fields.flatMap((group) => group.Fields);
  assert.deepEqual(testimonialItemFields.map((field) => field.FieldID), ['testimonial_text', 'testimonial_highlight']);
  assert.deepEqual(testimonialItemFields.map((field) => field.Type), ['html', 'text']);
  const testimonialComponents = components.filter((component) => component.category === 'testimonials');
  assert.deepEqual(testimonialComponents.map((component) => component.id).sort(), ['testimonials-01', 'testimonials-02', 'testimonials-03']);
  assert(testimonialComponents.every((component) => component.datastoreId === 'testimonials'));
  assert(testimonialComponents.every((component) => component.sharedFieldsId === 'testimonials'));
  assert(testimonialComponents.every((component) => JSON.stringify(component.sharedFieldIds) === JSON.stringify(['testimonials_section_title', 'testimonials_intro_text', 'testimonials_section_items'])));
  for (const testimonialComponent of testimonialComponents) {
    assert(testimonialComponent.template.includes('testimonial.title'));
    assert(testimonialComponent.template.includes('testimonial.testimonial_highlight'));
    assert.doesNotMatch(testimonialComponent.template, /customer_name/);
  }
  const testimonials01 = testimonialComponents.find((component) => component.id === 'testimonials-01');
  assert.equal(testimonials01.customCss, true);
  assert(testimonials01.template.includes('width: 48px;'));
  assert(testimonials01.template.includes('height: 48px;'));
  assert(testimonials01.template.includes('gap: .5rem;'));
  assert(testimonials01.template.includes('swiper-pagination-bullet-active {'));
  assert(testimonials01.template.includes('background: var(--bs-primary) !important;'));
  assert(testimonials01.template.includes('swiper-pagination-bullet-active::before'));
  assert(testimonials01.template.includes('swiper-pagination-bullet::before'));
  const testimonials03 = testimonialComponents.find((component) => component.id === 'testimonials-03');
  assert.equal(testimonials03.fields[1].Fields[0].FieldID, 'testimonials_03_image');
  assert.equal(testimonials03.fields[1].Fields[0].Type, 'image');
  assert(testimonials03.template.includes('testimonial.testimonial_text'));
  assert(testimonials03.template.includes('entity.testimonials_03_image preset:"800x600-crop webp"'));
  const teamDatastore = datastores.find((datastore) => datastore.id === 'team-members');
  assert(teamDatastore);
  const teamDatastoreFields = teamDatastore.fields.flatMap((group) => group.Fields);
  assert.deepEqual(teamDatastoreFields.map((field) => field.FieldID), [
    'team_member_image',
    'team_member_role',
    'team_member_bio',
    'team_member_phone',
    'team_member_email',
    'team_member_social_media',
  ]);
  const teamSocialField = teamDatastoreFields.find((field) => field.FieldID === 'team_member_social_media');
  assert.equal(teamSocialField.Type, 'fieldset');
  assert.equal(teamSocialField.AllowMultiple, true);
  assert.deepEqual(teamSocialField.Fields.map((field) => field.FieldID), ['social_media_platform', 'social_media_link']);
  assert(teamSocialField.Fields[0].Options.includes('LinkedIn'));
  const teamComponents = components.filter((component) => component.category === 'team');
  assert.deepEqual(teamComponents.map((component) => component.id).sort(), ['team-01', 'team-02']);
  assert(teamComponents.every((component) => component.datastoreId === 'team-members'));
  assert(teamComponents.every((component) => component.sharedFieldsId === 'team'));
  assert(teamComponents.every((component) => JSON.stringify(component.fields) === JSON.stringify(teamComponents[0].fields)));
  assert(teamComponents.every((component) => component.fields[0].Fields.find((field) => field.FieldID === 'team_members').DatastoreGUID === teamDatastore.guidPlaceholder));
  for (const teamComponent of teamComponents) {
    assert(teamComponent.template.includes('for member in entity.team_members'));
    assert(teamComponent.template.includes('member.title'));
    assert(teamComponent.template.includes('member.team_member_role'));
    assert(teamComponent.template.includes('member.team_member_bio'));
    assert(teamComponent.template.includes('member.team_member_image'));
    assert(teamComponent.template.includes('member.team_member_phone'));
    assert(teamComponent.template.includes('member.team_member_email'));
    assert(teamComponent.template.includes('member.team_member_social_media'));
    assert(teamComponent.template.includes('social.social_media_platform.value'));
    assert(teamComponent.template.includes('social.social_media_link.value | escape'));
    assert(!teamComponent.template.includes('team_member_linkedin'));
  }
  const faq = components.find(c => c.id === 'faq-01');
  assert.equal(faq.bootstrapJs, true);
  assert.equal((faq.preview.html.match(/data-bs-toggle="collapse"/g) || []).length, 3);
  const faqComponents = components.filter((component) => component.category === 'faq');
  assert.deepEqual(faqComponents.map((component) => component.id).sort(), ['faq-01', 'faq-02']);
  const faqMain = components.find((component) => component.id === 'faq-02');
  assert.equal(faq.datastoreId, 'faqs');
  assert.equal(faqMain.datastoreId, 'faqs');
  assert.equal(faqMain.bootstrapJs, true);
  assert.equal(faqMain.name, 'FAQ Main');
  assert.equal(faq.sharedFieldsId, 'faq');
  assert.equal(faqMain.sharedFieldsId, faq.sharedFieldsId);
  assert.deepEqual(faqMain.sharedFieldIds, faq.sharedFieldIds);
  assert(faqMain.fields[0].Fields.some((field) => field.FieldID === 'faq_eyebrow'));
  assert(faqMain.template.includes('entity.faq_eyebrow'));
  assert(faqMain.template.includes('faq.title'));
  assert(faqMain.template.includes('faq.faq_answer'));
  const gallery = components.find(c => c.id === 'gallery-01');
  assert(gallery);
  assert.equal(gallery.bootstrapJs, true);
  assert.equal(gallery.customCss, true);
  assert.equal(gallery.customJs, true);
  assert.equal(gallery.sharedFieldsId, 'gallery');
  assert.equal(gallery.prefix, 'gallery_');
  assert.deepEqual(gallery.fields[0].Fields.map((field) => field.FieldID), ['gallery_filters', 'gallery_title', 'gallery_filter_style', 'gallery_images']);
  const galleryFilterStyle = gallery.fields[0].Fields.find((field) => field.FieldID === 'gallery_filter_style');
  assert.equal(galleryFilterStyle.Type, 'select');
  assert.equal(galleryFilterStyle.DefaultValue, 'buttons');
  assert(gallery.template.includes('gallery-filter-list--active-outline'));
  assert(gallery.template.includes('entity.gallery_images'));
  const blog = components.find((component) => component.id === 'blog-01');
  assert(blog);
  assert.equal(blog.fields.length, 0, 'blog-01 uses built-in Blog and Post data, not Page Custom Fields');
  assert.equal(blog.bootstrapJs, false);
  assert.equal(blog.customJs, false);
  assert.equal(blog.customCss, true);
  assert(blog.template.includes('blog_posts var posts'));
  assert.match(blog.template, /elsif entity\.object_type == 'tag'/);
  assert(gallery.template.includes('bootstrap.Carousel'));
  const gallery02 = components.find((component) => component.id === 'gallery-02');
  assert(gallery02);
  assert.equal(gallery02.bootstrapJs, true);
  assert.equal(gallery02.customJs, true);
  assert(gallery02.template.includes('data-gallery-modal'));
  assert(gallery02.template.includes('data-gallery-carousel-inner'));
  assert.match(gallery02.template, /\.gallery-modern-modal\s*\{[^}]*z-index:\s*10050/s);
  assert.doesNotMatch(gallery02.template, /From the collection|gallery-modern-caption-title/);
  const gallery03 = components.find((component) => component.id === 'gallery-03');
  assert(gallery03);
  assert.equal(gallery03.bootstrapJs, false);
  assert.equal(gallery03.customJs, true);
  assert.deepEqual(gallery03.fields, gallery.fields);
  assert(gallery03.template.includes('data-gallery-selection-thumb'));
  assert(gallery03.template.includes('data-gallery-selection-main'));
  assert(gallery03.template.includes('repeat(4, minmax(0, 1fr))'));
  assert.match(gallery03.template, /\.gallery-selection-stage\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  const content01 = components.find((component) => component.id === 'content-01');
  const content02 = components.find((component) => component.id === 'content-02');
  for (const contentImageVariant of [content01, content02]) {
    assert(contentImageVariant);
    const imageRatioField = contentImageVariant.fields[0].Fields.find((field) => field.FieldID.endsWith('_image_ratio'));
    assert.equal(imageRatioField.Type, 'select');
    assert.deepEqual(imageRatioField.Options, 'square:Square (1:1);landscape:Landscape (4:3);widescreen:Widescreen (16:9)');
    assert(contentImageVariant.template.includes('ratio-1x1'));
    assert(contentImageVariant.template.includes('ratio-4x3'));
    assert(contentImageVariant.template.includes('ratio-16x9'));
    assert(contentImageVariant.template.includes('preset:"300x300-max webp"'));
    assert(contentImageVariant.template.includes('preset:"800x600-crop webp"'));
    assert(contentImageVariant.template.includes('preset:"1920x1080-crop webp"'));
  }
  assert.equal(content02.customCss, false);
  assert.doesNotMatch(content02.template, /style=/);
  const content03 = components.find((component) => component.id === 'content-03');
  assert(content03);
  assert.equal(content03.customCss, false);
  assert.equal(content03.customJs, false);
  const benefitsField = content03.fields[0].Fields.find((field) => field.FieldID === 'content_03_bullets');
  assert.equal(benefitsField.Type, 'fieldset');
  assert.equal(benefitsField.AllowMultiple, true);
  assert.equal(benefitsField.Validators.find((validator) => validator.Type === 'maxitems').Value, 4);
  assert(content03.template.includes('item.text'));
  assert(content03.template.includes('card text-bg-primary rounded-0 border-0 position-absolute bottom-0 end-0 w-25 h-25'));
  assert(content03.template.includes('row-cols-1 row-cols-lg-2'));
  assert(content03.template.includes('card text-bg-primary'));
  assert(content03.template.includes('bi bi-check-circle-fill text-primary fs-5 flex-shrink-0 align-self-start lh-1'));
  assert.doesNotMatch(content03.template, /aria-hidden="true">→<\/span>/);
  assert.match(content03.template, /\{%- img entity\.content_03_image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" link:false loading:"lazy" -%\}/);
  assert(content03.template.includes('btn btn-primary'));
  const content04 = components.find((component) => component.id === 'content-04');
  assert(content04);
  assert.deepEqual(content04.fields[0].Fields.map((field) => field.FieldID), [
    'content_04_title',
    'content_04_body',
    'content_04_image',
    'content_04_image_ratio',
    'content_04_image_position',
  ]);
  assert.equal(content04.fields[0].Fields[1].Type, 'html');
  assert.equal(content04.fields[0].Fields[3].Type, 'select');
  assert.equal(content04.fields[0].Fields[4].Type, 'select');
  assert(content04.template.includes('h2 mb-3 fs-1'));
  assert(content04.template.includes('row g-5 align-items-start'));
  assert(!content04.template.includes('rounded-3'));
  assert(content04.template.includes("entity.content_04_image_position.value == 'left'"));
  assert(content04.template.includes('entity.content_04_image preset:"800x600-crop webp"'));
  assert(content04.template.includes('entity.content_04_image preset:"300x300-max webp"'));
  assert(content04.template.includes('entity.content_04_image preset:"1920x1080-crop webp"'));
  const content05 = components.find((component) => component.id === 'content-05');
  assert(content05);
  assert.equal(content05.customCss, false);
  assert.equal(content05.customJs, false);
  const content05Items = content05.fields[0].Fields[0];
  assert.equal(content05Items.Type, 'fieldset');
  assert.equal(content05Items.FieldID, 'content_05_items');
  assert.equal(content05Items.AllowMultiple, true);
  assert.deepEqual(content05Items.Fields.map((field) => field.FieldID), ['image', 'title']);
  assert(content05.template.includes('for item in entity.content_05_items'));
  assert(content05.template.includes('item.title'));
  assert(content05.template.includes('link:false'));
  assert.doesNotMatch(content05.template, /<a\b/);
  const content06 = components.find((component) => component.id === 'content-06');
  assert(content06);
  assert.equal(content06.fields[0].Fields[2].Type, 'fieldset');
  assert.equal(content06.fields[0].Fields[2].FieldID, 'content_06_bullets');
  assert.deepEqual(content06.fields[0].Fields[2].Fields.map((field) => field.FieldID), ['text']);
  assert.equal(content06.fields[0].Fields[4].Type, 'image');
  assert.equal(content06.fields[0].Fields[5].FieldID, 'content_06_image_ratio');
  assert.equal(content06.fields[0].Fields[5].Type, 'select');
  assert(content06.template.includes('p class="h5 mb-0 fw-bolder"'));
  assert(content06.template.includes('h2 class="fs-2 fw-bold text-primary mb-4"'));
  assert(content06.template.includes('d-grid gap-2 mb-0'));
  assert(content06.template.includes('span class="h5 align-self-start"'));
  assert(content06.template.includes('bi-arrow-right-circle-fill fs-5 text-dark'));
  assert(!content06.template.includes('bi-arrow-right-circle-fill fs-5 lh-1'));
  assert(content06.template.includes('d-flex align-items-start gap-2'));
  assert(content06.template.includes('align-self-start'));
  assert(content06.template.includes('fst-italic text-dark mt-4 mb-0'));
  assert(!content06.template.includes('bi-arrow-right-circle-fill fs-4 text-dark mt-1'));
  assert(content06.template.includes('newline_to_br'));
  assert(content06.template.includes('row g-5 align-items-start'));
  assert(content06.template.includes('entity.content_06_image preset:"300x300-max webp"'));
  assert(content06.template.includes('entity.content_06_image preset:"800x600-crop webp"'));
  assert(content06.template.includes('entity.content_06_image preset:"1920x1080-crop webp"'));
  const pageTitle01 = components.find((component) => component.id === 'page-title-01');
  assert(pageTitle01);
  assert.equal(pageTitle01.category, 'page-title');
  assert.equal(pageTitle01.customCss, false);
  assert.equal(pageTitle01.customJs, false);
  assert.equal(pageTitle01.bootstrapJs, false);
  assert.equal(pageTitle01.datastoreId, undefined);
  assert.equal(pageTitle01.sharedFieldsId, 'page_title_01');
  assert.deepEqual(pageTitle01.sharedFieldIds, ['page_title_01_title_source', 'page_title_01_custom_title', 'page_title_01_show_breadcrumbs']);
  const pageTitleFields = pageTitle01.fields[0].Fields;
  assert.equal(pageTitleFields.find((field) => field.FieldID === 'page_title_01_title_source').Type, 'radio');
  assert.equal(pageTitleFields.find((field) => field.FieldID === 'page_title_01_title_source').DefaultValue, 'page');
  assert.equal(pageTitleFields.find((field) => field.FieldID === 'page_title_01_background_color').Type, 'select');
  assert.equal(pageTitleFields.find((field) => field.FieldID === 'page_title_01_background_color').DefaultValue, 'light');
  assert(!pageTitleFields.some((field) => field.FieldID === 'page_title_01_background_image'));
  const pageTitleBreadcrumbToggle = pageTitleFields.find((field) => field.FieldID === 'page_title_01_show_breadcrumbs');
  assert.equal(pageTitleBreadcrumbToggle.Type, 'toggle');
  assert.equal(pageTitleBreadcrumbToggle.OnColor, 'success');
  assert.equal(pageTitleFields.at(-1).FieldID, 'page_title_01_show_breadcrumbs');
  assert(pageTitle01.template.includes('entity.title'));
  assert(!pageTitle01.template.includes('slim_page_title/v1/_breadcrumb.liquid'));
  assert(pageTitle01.template.includes('>Home</a>'));
  assert(pageTitle01.template.includes("entity.url.value | split:'/'"));
  assert(pageTitle01.template.includes('last_segment_index'));
  assert(!pageTitle01.template.includes('entity.parent_page'));
  assert(!pageTitle01.template.includes('defaultItem'));
  assert(pageTitle01.template.includes('col-12 col-md-auto ms-md-auto'));
  assert(pageTitle01.template.includes('class="py-4'));
  const pageTitle02 = components.find((component) => component.id === 'page-title-02');
  assert(pageTitle02);
  assert.equal(pageTitle02.category, 'page-title');
  assert.equal(pageTitle02.sharedFieldsId, pageTitle01.sharedFieldsId);
  assert.deepEqual(pageTitle02.sharedFieldIds, pageTitle01.sharedFieldIds);
  assert.equal(pageTitle02.customCss, false);
  assert.equal(pageTitle02.customJs, false);
  assert.equal(pageTitle02.bootstrapJs, false);
  assert.equal(pageTitle02.datastoreId, undefined);
  const pageTitle02Fields = pageTitle02.fields[0].Fields;
  assert.equal(pageTitle02Fields.find((field) => field.FieldID === 'page_title_01_background_image').Type, 'image');
  assert.equal(pageTitle02Fields.find((field) => field.FieldID === 'page_title_01_background_image').IsRequired, true);
  assert(!pageTitle02Fields.some((field) => field.FieldID === 'page_title_01_background_color'));
  for (const suffix of ['title_source', 'custom_title', 'show_breadcrumbs']) {
    const solidField = pageTitleFields.find((field) => field.FieldID === `page_title_01_${suffix}`);
    const imageField = pageTitle02Fields.find((field) => field.FieldID === `page_title_01_${suffix}`);
    assert(solidField && imageField, `Page Title variants should both expose ${suffix}`);
    assert.equal(solidField.Type, imageField.Type, `Page Title ${suffix} types should match`);
    assert.equal(solidField.Label, imageField.Label, `Page Title ${suffix} labels should match`);
  }
  assert.deepEqual(pageTitle01.sharedFieldIds, pageTitle02.sharedFieldIds);
  assert(pageTitle02.template.includes('class="py-5 position-relative'));
  assert(pageTitle02.template.includes('1920x600-crop'));
  assert(pageTitle02.template.includes('col-12 col-md-auto ms-md-auto'));
  assert(pageTitle02.template.includes("entity.url.value | split:'/'"));
  const hero01 = components.find((component) => component.id === 'hero-01');
  const hero03 = components.find((component) => component.id === 'hero-03');
  assert(hero01 && hero03);
  assert.equal(hero01.sharedFieldsId, 'hero_01');
  assert.equal(hero03.sharedFieldsId, hero01.sharedFieldsId);
  assert.deepEqual(hero03.fields, hero01.fields);
  assert.equal(hero01.fields[0].Fields[0].FieldID, 'hero_01_eyebrow');
  for (const hero of [hero01, hero03]) {
    assert(hero.template.includes('entity.hero_01_eyebrow.is_valid'));
    assert(hero.template.includes('fw-bold fst-italic'));
    assert(hero.template.includes('font-size:18px;'));
    assert(hero.preview.html.includes('font-size:18px;'));
  }
  assert.equal(hero03.bootstrapJs, false);
  assert.equal(hero03.customCss, true);
  for (const heroId of ['hero-01', 'hero-03']) {
    const heroComponent = components.find((component) => component.id === heroId);
    assert(heroComponent.template.includes('srcset='));
    assert(heroComponent.template.includes("preset:'800x450-crop webp'"));
    assert(heroComponent.template.includes("preset:'1200x675-crop webp'"));
    assert(heroComponent.template.includes("preset:'1920x1080-crop webp'"));
  }
  assert.match(hero03.template, /linear-gradient\(130deg/);
  assert(hero03.template.includes('rgba(10, 10, 10, .68) 0%'));
  assert(hero03.template.includes('rgba(10, 10, 10, .38) 65%'));
  assert(!hero03.template.includes('bg-dark hero-03-diagonal-overlay'));
  assert.match(hero03.template, /@media \(max-width: 767\.98px\)/);
  assert(hero03.template.includes('background: rgba(10, 10, 10, .68)'));
  const header01 = components.find((component) => component.id === 'header-01');
  assert(header01);
  assert.match(header01.template, /id="navbarLogo" class="img-fluid" style="width:auto; height:auto; max-width:100%; max-height:64px; object-fit:contain;/);
  assert(header01.template.includes("preset:'300x300-max webp'"));
  assert(header01.preview.html.includes('max-height:64px'));
  const header02 = components.find((component) => component.id === 'header-02');
  assert(header02);
  assert(header02.template.includes('preset:"300x300-max webp"'));
  assert(header02.template.includes('style:"height:auto;max-height:64px;width:auto;max-width:100%;object-fit:contain;"'));
  assert(!header02.template.includes('width:148px;height:68px'));
  assert(header02.preview.html.includes('max-height:64px'));
  for (const header of [header01, header02]) {
    assert(header.template.lastIndexOf('</nav>') < header.template.indexOf('<main>'));
  }
  const footer = components.find(c => c.id === 'footer-01');
  assert.equal(footer.fields.length, 0, 'footer-01 uses shared Page Settings, not page Custom Fields');
  assert.equal(footer.settingsDatastoreId, 'page-settings');
  assert(footer.template.includes('preset:"300x300-max webp"'));
  assert(footer.template.includes('settings.footer_menu_1'));
  const footer02 = components.find(c => c.id === 'footer-02');
  const pageSettings = datastores.find(datastore => datastore.id === 'page-settings');
  assert(!JSON.stringify(pageSettings.fields).includes('footer_free_form'), 'Page Settings must not contain the removed Footer Free Form field');
  assert.doesNotMatch(footer02.template, /footer_free_form|Footer Free Form HTML/);
  for (const footerVariant of components.filter((component) => component.category === 'footer')) {
    assert(footerVariant.template.indexOf('</main>') >= 0 && footerVariant.template.indexOf('</main>') < footerVariant.template.indexOf('<footer'));
    assert(footerVariant.theme && ['light', 'dark'].includes(footerVariant.theme.default), `${footerVariant.id}: missing theme default`);
    assert(footerVariant.preview.html.includes('data-footer-theme-role="root"'), `${footerVariant.id}: preview is missing its theme root`);
    assert.doesNotMatch(footerVariant.template, /footer_theme\s*\|/, `${footerVariant.id}: themes should be rendered by Astro, not Liquid`);
    const alternateTheme = footerVariant.theme.default === 'light' ? 'dark' : 'light';
    const alternateTemplate = footerTemplateForTheme(footerVariant, alternateTheme);
    const alternatePreview = footerMarkupForTheme(footerVariant, footerVariant.preview.html, alternateTheme);
    assert.doesNotMatch(alternateTemplate, /data-footer-theme(?:-role)?=/, `${footerVariant.id}: preview-only theme hooks leaked into copied markup`);
    const copiedRoot = alternateTemplate.match(/<footer[^>]*>/)?.[0] || '';
    for (const colorClass of footerVariant.theme.classVariants.root[alternateTheme].split(/\s+/)) {
      assert(copiedRoot.includes(colorClass), `${footerVariant.id}: Astro theme output did not set ${colorClass}`);
    }
    for (const [role, variants] of Object.entries(footerVariant.theme.classVariants)) {
      for (const output of [alternateTemplate, alternatePreview]) {
        const roleTag = output.match(new RegExp(`<[^>]*data-footer-theme-role="${role}"[^>]*>`))?.[0];
        if (!roleTag) continue;
        for (const colorClass of variants[alternateTheme].split(/\s+/)) {
          assert(roleTag.includes(colorClass), `${footerVariant.id}: ${alternateTheme} ${role} output is missing ${colorClass}`);
        }
        for (const oldColorClass of variants[footerVariant.theme.default].split(/\s+/)) {
          if (!variants[alternateTheme].split(/\s+/).includes(oldColorClass)) {
            assert(!roleTag.includes(oldColorClass), `${footerVariant.id}: ${alternateTheme} ${role} output still has ${oldColorClass}`);
          }
        }
      }
    }
  }
  assert(components.find(c => c.id === 'banner-01').template.includes('entity.banner_01_show_image.on'));
  const titleBackgroundBanner = components.find((component) => component.id === 'banner-05');
  assert(titleBackgroundBanner);
  assert.equal(titleBackgroundBanner.category, 'banner');
  assert.equal(titleBackgroundBanner.customCss, true);
  assert.equal(titleBackgroundBanner.customJs, false);
  assert(titleBackgroundBanner.template.includes('entity.banner_05_background_image preset:"1920x600-crop webp"'));
  assert(titleBackgroundBanner.template.includes('bg-dark opacity-50'));
  assert(titleBackgroundBanner.template.includes('class="container py-2"'));
  assert(titleBackgroundBanner.template.includes('position-relative w-100 px-3 py-5'));
  const fullWidthBanner = components.find((component) => component.id === 'banner-06');
  assert(fullWidthBanner);
  assert.equal(fullWidthBanner.customCss, true);
  assert(fullWidthBanner.template.includes('banner-06--{{ entity.banner_06_height.value | classname }}'));
  assert(fullWidthBanner.template.includes('max-height: 18rem'));
  assert(fullWidthBanner.template.includes('max-height: 42rem'));
  assert(fullWidthBanner.template.includes('1920x600-crop'));
  const logoCarousel = components.find(c => c.id === 'banner-04');
  assert(logoCarousel);
  assert.doesNotMatch(logoCarousel.template, /{%-?\s*(?:id|var)\b|\bid=/, 'banner-04 should use classes rather than generated Liquid IDs or vars');
  assert(logoCarousel.template.includes('logo-carousel--custom-image'));
  assert(logoCarousel.template.includes('filter: grayscale(1)'));
  console.log(`PASS: ${components.length} components, ${total} unique fields; schemas, guarded references, URL escaping, Liquid block balance, previews and accordion targets.`);
})().catch((error) => { console.error(error); process.exit(1); });
