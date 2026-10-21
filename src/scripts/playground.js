import { components } from '../data/components.js';
import { datastores } from '../data/datastores.js';
import { categoryLabel, categoryGroups, categoryGroupsFor, escapeHtml, previewDocument } from '../lib/utils.js';
import { createMarketpathImport, createThemeImportZip, createThemeMarketpathImport, createThemeVariablesScss, exampleDatastoreItems, marketpathSlug } from '../lib/marketpath-export.js';

const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = 'marketpath-playground-v1';
const frame = $('#pageFrame');
const frameSizer = $('#frameSizer');
const canvasStage = $('#canvasStage');
const status = $('#playgroundStatus');
const componentById = new Map(components.map((component) => [component.id, component]));
const themeFiles = Object.entries(import.meta.glob('../assets/themes/*/*', { eager: true, query: '?url', import: 'default' }))
  .map(([path, url]) => ({ theme: path.split('/').at(-2), name: path.split('/').at(-1), url }));
const exportThemes = [...new Set(themeFiles.map((file) => file.theme))].map((name) => {
  const files = themeFiles.filter((file) => file.theme === name).map(({ name: fileName, url }) => ({ name: fileName, url }));
  return {
    id: name.toLowerCase().replaceAll(' ', '-'),
    name,
    files,
    logoName: 'logo.png',
    teamMemberNames: files.map((file) => file.name).filter((fileName) => /^team member/i.test(fileName)),
    photoNames: files.map((file) => file.name).filter((fileName) => /^\d+\.jpg$/i.test(fileName)),
  };
});
const themePreviewImageNames = { exterior: '1.jpg', home: '2.jpg', modern: '3.jpg', 'team-female': 'team member female.jpg', 'team-male': 'team member male.jpg' };
const themeCategoryGroups = categoryGroupsFor([...new Set(components.map((component) => component.category))]);
const insertPreviewObserver = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const preview = target.querySelector('iframe');
    if (preview) preview.style.transform = `scale(${target.clientWidth / 1200})`;
  }
});
let activeInsertGroup = 'layout';
let activeInsertCategory = 'all';
let pendingThemeInsertIndex = 0;
// The insert dialog adds a section ('add') or swaps one for another of the same category ('change').
let insertMode = 'add';
let changeBlockIndex = -1;
const originalStarterIds = ['hero-02', 'content-01', 'cta-01', 'footer-01'];
const thumbnailObserver = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const thumbnail = target.querySelector('iframe');
    if (thumbnail) thumbnail.style.transform = `scale(${target.clientWidth / 1200})`;
  }
});
document.querySelectorAll('.pg-component-thumbnail').forEach((thumbnail) => thumbnailObserver.observe(thumbnail));

let pageName = 'Untitled page';
let createTextExamples = false;
let viewportWidth = 1200;
let selectedIndex = -1;
let blocks = [];
let saveTimer;
let statusTimer;

const themePages = [
  { key: 'home', label: 'Home', shortLabel: 'Home', mark: 'H', type: 'HOME PAGE', category: 'hero' },
  { key: 'generic', label: 'Generic Page', shortLabel: 'Generic', mark: 'P', type: 'GENERIC PAGE', category: 'content' },
  { key: 'about', label: 'About', shortLabel: 'About', mark: 'A', type: 'ABOUT PAGE', category: 'content' },
  { key: 'contact', label: 'Contact', shortLabel: 'Contact', mark: 'C', type: 'CONTACT PAGE', category: 'contact' },
  { key: 'error', label: 'Error 404', shortLabel: 'Error 404', mark: '404', type: 'SYSTEM PAGE', category: 'error-404' },
  { key: 'services', label: 'Services', shortLabel: 'Services', mark: 'S', type: 'SERVICES', category: 'services' },
  { key: 'inside-services', label: 'Inside Services', shortLabel: 'Inside Services', mark: 'S↗', type: 'SERVICE DETAIL', category: 'inside-services' },
  { key: 'projects', label: 'Projects', shortLabel: 'Projects', mark: 'P', type: 'PROJECTS', category: 'projects' },
  { key: 'inside-projects', label: 'Inside Projects', shortLabel: 'Inside Projects', mark: 'P↗', type: 'PROJECT DETAIL', category: 'inside-projects' },
  { key: 'blog', label: 'Blog', shortLabel: 'Blog', mark: 'B', type: 'BLOG', category: 'blog' },
  { key: 'testimonials', label: 'Testimonials', shortLabel: 'Testimonials', mark: '“', type: 'TESTIMONIALS', category: 'testimonials' },
  { key: 'team', label: 'Team Members', shortLabel: 'Team', mark: 'T', type: 'TEAM MEMBERS', category: 'team' },
  { key: 'gallery', label: 'Gallery', shortLabel: 'Gallery', mark: '▦', type: 'GALLERY', category: 'gallery' },
  { key: 'faqs', label: 'FAQs', shortLabel: 'FAQs', mark: '?', type: 'FAQS', category: 'faq' },
];
const themePageKeys = new Set(themePages.map((page) => page.key));
const pagesWithoutPageTitle = new Set(['home', 'blog', 'error', 'thankyou']);
const migrateThemePageKey = (key) => key === 'insight' ? 'blog' : key;
const themeWorkspaceDefaults = {
  name: 'Example theme',
  assetTheme: 'contractor',
  projectCount: 3,
  variables: { primary: '#063B6F', secondary: '#232323', dark: '#212529', light: '#F8F9FA', white: '#FFFFFF', fontFamily: 'Exo 2' },
  pages: ['home', 'contact', 'error'],
  header: 'header-01',
  footer: 'footer-01',
  pageTitle: 'page-title-01',
  cta: 'cta-01',
  siteDomain: '',
  pageBlocks: {},
};
let themeWorkspace;
try {
  const savedTheme = JSON.parse(localStorage.getItem('marketpath-theme-workspace-v1'));
  themeWorkspace = {
    ...themeWorkspaceDefaults,
    ...(savedTheme && typeof savedTheme === 'object' ? savedTheme : {}),
    pages: Array.isArray(savedTheme?.pages) ? [...new Set(savedTheme.pages.map(migrateThemePageKey).filter((key) => themePageKeys.has(key)))] : themeWorkspaceDefaults.pages,
    pageBlocks: savedTheme?.pageBlocks && typeof savedTheme.pageBlocks === 'object' ? savedTheme.pageBlocks : {},
    variables: { ...themeWorkspaceDefaults.variables, ...(savedTheme?.variables && typeof savedTheme.variables === 'object' ? savedTheme.variables : {}) },
  };
} catch {
  themeWorkspace = { ...themeWorkspaceDefaults, pages: [...themeWorkspaceDefaults.pages], pageBlocks: {} };
}
if (themeWorkspace.pages.length === 0) themeWorkspace.pages = [...themeWorkspaceDefaults.pages];
if (typeof themeWorkspace.name !== 'string' || !themeWorkspace.name.trim()) themeWorkspace.name = themeWorkspaceDefaults.name;
if (!exportThemes.some((theme) => theme.id === themeWorkspace.assetTheme)) themeWorkspace.assetTheme = themeWorkspaceDefaults.assetTheme;
themeWorkspace.projectCount = Math.max(1, Math.min(3, Number(themeWorkspace.projectCount) || 3));
// Edits to the sample datastore items (service cards, projects…), keyed by datastore id and item index.
if (!themeWorkspace.datastoreEdits || typeof themeWorkspace.datastoreEdits !== 'object' || Array.isArray(themeWorkspace.datastoreEdits)) themeWorkspace.datastoreEdits = {};
for (const key of ['primary', 'secondary', 'dark', 'light', 'white']) {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(themeWorkspace.variables[key])) themeWorkspace.variables[key] = themeWorkspaceDefaults.variables[key];
}
if (!['Exo 2', 'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Poppins', 'Inter'].includes(themeWorkspace.variables.fontFamily)) themeWorkspace.variables.fontFamily = 'Exo 2';
if (typeof themeWorkspace.siteDomain !== 'string') themeWorkspace.siteDomain = '';
for (const [key, category] of Object.entries({ header: 'header', footer: 'footer', pageTitle: 'page-title', cta: 'cta' })) {
  if (componentById.get(themeWorkspace[key])?.category !== category) themeWorkspace[key] = themeWorkspaceDefaults[key];
}
if (themeWorkspace.pageBlocks.insight && !themeWorkspace.pageBlocks.blog) themeWorkspace.pageBlocks.blog = themeWorkspace.pageBlocks.insight;
for (const key of ['ctaDefaultsApplied', 'pageTitleDefaultsApplied']) {
  themeWorkspace[key] = themeWorkspace[key] && typeof themeWorkspace[key] === 'object' && !Array.isArray(themeWorkspace[key]) ? themeWorkspace[key] : {};
}
for (const page of themePages) {
  const blocksForPage = themeWorkspace.pageBlocks[page.key];
  themeWorkspace.pageBlocks[page.key] = Array.isArray(blocksForPage)
    ? blocksForPage.filter((block) => componentById.has(block.id) && typeof block.html === 'string').map((block, index) => ({
        uid: block.uid || `${page.key}-${Date.now()}-${index}`,
        id: block.id,
        html: block.html,
        editing: false,
        defaultLayout: Boolean(block.defaultLayout),
      }))
    : [];
}
if (!themeWorkspace.homeStarterApplied) {
  if (!themeWorkspace.pageBlocks.home.length) themeWorkspace.pageBlocks.home.push({
    uid: 'starter-home-hero',
    id: 'hero-02',
    html: componentById.get('hero-02').preview.html,
    editing: false,
    defaultLayout: false,
  });
  themeWorkspace.homeStarterApplied = true;
}
if (!themeWorkspace.globalElementsVersion) {
  if (!themeWorkspace.pageBlocks.contact.some((block) => componentById.get(block.id)?.category === 'cta')) {
    delete themeWorkspace.ctaDefaultsApplied.contact;
  }
  themeWorkspace.globalElementsVersion = 1;
}
function ensureDefaultThemeElementsForPage(pageKey) {
  let pageBlocks = themeWorkspace.pageBlocks[pageKey] || (themeWorkspace.pageBlocks[pageKey] = []);
  if (pagesWithoutPageTitle.has(pageKey)) {
    pageBlocks = themeWorkspace.pageBlocks[pageKey] = pageBlocks.filter((block) => componentById.get(block.id)?.category !== 'page-title');
    themeWorkspace.pageTitleDefaultsApplied[pageKey] = true;
  }
  if (!pagesWithoutPageTitle.has(pageKey) && !themeWorkspace.pageTitleDefaultsApplied[pageKey]) {
    if (!pageBlocks.some((block) => componentById.get(block.id)?.category === 'page-title')) pageBlocks.unshift({
      uid: `default-page-title-${pageKey}`,
      id: themeWorkspace.pageTitle,
      html: componentById.get(themeWorkspace.pageTitle).preview.html,
      editing: false,
      defaultLayout: true,
    });
    themeWorkspace.pageTitleDefaultsApplied[pageKey] = true;
  }
  if (!themeWorkspace.ctaDefaultsApplied[pageKey]) {
    if (!pageBlocks.some((block) => componentById.get(block.id)?.category === 'cta')) pageBlocks.push({
      uid: `default-cta-${pageKey}`,
      id: themeWorkspace.cta,
      html: componentById.get(themeWorkspace.cta).preview.html,
      editing: false,
      defaultLayout: true,
    });
    themeWorkspace.ctaDefaultsApplied[pageKey] = true;
  }
  const pageTitleIndex = pageBlocks.findIndex((block) => componentById.get(block.id)?.category === 'page-title');
  if (pageTitleIndex > 0) pageBlocks.unshift(pageBlocks.splice(pageTitleIndex, 1)[0]);
}
themeWorkspace.pages.forEach(ensureDefaultThemeElementsForPage);
let activeThemePage = themeWorkspace.pages[0];
let selectedThemeIndex = -1;
let openThemeMenuIndex = -1;
// Preview text linked to data, rebuilt whenever the canvas loads: element → binding, and the bindings of each block.
const previewBindings = new Map();
let blockBindings = [];
let openThemeSiteMenu = null;
let themeViewportWidth = 1200;
let activeThemePanel = 'page';
let themeSaveTimer;
let themeStatusTimer;

function updateDefaultGlobalBlocks(key, componentId) {
  const category = key === 'pageTitle' ? 'page-title' : key;
  const component = componentById.get(componentId);
  for (const blocks of Object.values(themeWorkspace.pageBlocks)) {
    for (const block of blocks) {
      if (block.defaultLayout && componentById.get(block.id)?.category === category) {
        block.id = componentId;
        block.html = component.preview.html;
        block.editing = false;
      }
    }
  }
}

function globalElementCategory(key) {
  return { pageTitle: 'page-title' }[key] || key;
}

// A global is on the site when it has a component and is not disabled from the Page structure menu.
const themeGlobalOn = (key) => componentById.has(themeWorkspace[key]) && !themeWorkspace[`${key}Disabled`];

function globalElementLabel(key, componentId) {
  const label = { header: 'Header', footer: 'Footer', pageTitle: 'Page Title', cta: 'CTA' }[key];
  if (!componentId) return `${label} · None`;
  return `${label} ${componentId.match(/(\d+)$/)?.[1] || componentId}`;
}

function scaleThemeGlobalPreviews() {
  document.querySelectorAll('.pg-theme-global-preview').forEach((stage) => {
    const frame = stage.querySelector('iframe');
    if (frame) frame.style.transform = `scale(${stage.clientWidth / 1200})`;
  });
}

function renderThemeGlobalPickers() {
  for (const [key, category] of Object.entries({ header: 'header', footer: 'footer', pageTitle: 'page-title', cta: 'cta' })) {
    $(`[data-theme-global-label="${key}"]`).textContent = globalElementLabel(key, themeWorkspace[key]);
  }
}

function openThemeGlobalPicker(key) {
  const category = globalElementCategory(key);
  const label = { header: 'Header', footer: 'Footer', pageTitle: 'Page Title', cta: 'CTA' }[key];
  $('#themeGlobalTitle').textContent = `Choose ${label}`;
  $('#themeGlobalDescription').textContent = key === 'header' || key === 'footer'
    ? `Select the ${label.toLowerCase()} used across your site.`
    : `Select the default ${label} for each page. Remove it from any page in the page editor.`;
  const choices = $('#themeGlobalChoices');
  choices.replaceChildren();
  for (const component of components.filter((item) => item.category === category)) {
    const selected = component.id === themeWorkspace[key];
    const card = document.createElement('article');
    card.className = `pg-theme-global-choice${selected ? ' is-selected' : ''}`;
    const preview = document.createElement('div');
    preview.className = 'pg-theme-global-preview';
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', '');
    frame.setAttribute('title', `${globalElementLabel(key, component.id)} preview`);
    frame.srcdoc = previewDocument(component, { bootstrap: false, theme: themeWorkspace.variables });
    preview.append(frame);
    const details = document.createElement('div');
    details.className = 'pg-theme-global-choice-details';
    const name = document.createElement('strong');
    name.textContent = globalElementLabel(key, component.id);
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.dataset.themeGlobalChoice = component.id;
    choose.dataset.themeGlobalKind = key;
    choose.textContent = selected ? 'Selected' : 'Select';
    details.append(name, choose);
    card.append(preview, details);
    choices.append(card);
  }
  $('#themeGlobalDialog').showModal();
  requestAnimationFrame(scaleThemeGlobalPreviews);
}

function pageInfo(key = activeThemePage) {
  return themePages.find((page) => page.key === key) || themePages[0];
}

function currentThemeBlocks(key = activeThemePage) {
  return themeWorkspace.pageBlocks[key] || (themeWorkspace.pageBlocks[key] = []);
}

function saveThemeWorkspace(message = 'Saved') {
  $('#themeSaveState').textContent = 'Saving…';
  clearTimeout(themeSaveTimer);
  themeSaveTimer = setTimeout(() => {
    try {
      localStorage.setItem('marketpath-theme-workspace-v1', JSON.stringify(themeWorkspace));
      $('#themeSaveState').textContent = message;
      $('#themeBuilderStatus').textContent = message === 'Saved' ? 'Changes saved in this browser' : message;
    } catch {
      $('#themeSaveState').textContent = 'Not saved';
      $('#themeBuilderStatus').textContent = 'Could not save in this browser';
    }
    clearTimeout(themeStatusTimer);
    themeStatusTimer = setTimeout(() => { $('#themeBuilderStatus').textContent = ''; }, 1800);
  }, 120);
}

async function exportThemePackage(button) {
  const defaultLabel = 'Export theme <span aria-hidden="true">↓</span>';
  button.disabled = true;
  button.textContent = 'Preparing ZIP…';
  $('#themeSaveState').textContent = 'Saving…';
  try {
    localStorage.setItem('marketpath-theme-workspace-v1', JSON.stringify(themeWorkspace));
    const assetTheme = exportThemes.find((theme) => theme.id === themeWorkspace.assetTheme);
    const themeImages = await Promise.all(assetTheme.files.map(async ({ name, url }) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${name} from the ${assetTheme.name} theme.`);
      return { name, bytes: new Uint8Array(await response.arrayBuffer()) };
    }));
    const packageData = createThemeMarketpathImport({
      pages: selectedThemePages().map((page) => ({
        key: page.key,
        label: page.label,
        blocks: currentThemeBlocks(page.key).map(({ id, uid, defaultLayout, values }) => ({ id, uid, defaultLayout, values })),
      })),
      themeName: themeWorkspace.name,
      headerId: themeWorkspace.header,
      footerId: themeWorkspace.footer,
      components,
      datastores,
      siteDomain: themeWorkspace.siteDomain,
      imageName: assetTheme.logoName,
      themeAssets: {
        logoName: assetTheme.logoName,
        teamMemberNames: assetTheme.teamMemberNames,
        photoNames: assetTheme.photoNames,
      },
      projectCount: themeWorkspace.projectCount,
      datastoreEdits: themeWorkspace.datastoreEdits,
    });
    const archive = createThemeImportZip({ packageData, themeImages, themeVariables: createThemeVariablesScss(themeWorkspace.variables) });
    const blob = new Blob([archive], { type: 'application/zip' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${marketpathSlug(themeWorkspace.name)}-marketpath-import.zip`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    const datastoreCount = packageData.Datastore?.length || 0;
    const itemCount = packageData.DatastoreItem?.length || 0;
    $('#themeSaveState').textContent = 'Saved';
    $('#themeBuilderStatus').textContent = `Theme ZIP downloaded · ${packageData.Template.length} templates · ${datastoreCount} datastores · ${itemCount} sample records`;
    clearTimeout(themeStatusTimer);
    themeStatusTimer = setTimeout(() => { $('#themeBuilderStatus').textContent = ''; }, 6000);
  } catch (error) {
    $('#themeSaveState').textContent = 'Export failed';
    $('#themeBuilderStatus').textContent = error.message || 'Could not create the Marketpath import ZIP.';
    clearTimeout(themeStatusTimer);
    themeStatusTimer = setTimeout(() => { $('#themeBuilderStatus').textContent = ''; }, 6000);
  } finally {
    button.disabled = false;
    button.innerHTML = defaultLabel;
  }
}

function selectedThemePages() {
  return themePages.filter((page) => themeWorkspace.pages.includes(page.key));
}

function renderThemeSetup() {
  renderThemeGlobalPickers();
  document.querySelectorAll('[data-theme-page-toggle]').forEach((input) => {
    const selected = themeWorkspace.pages.includes(input.dataset.themePageToggle);
    input.checked = selected;
    input.closest('[data-theme-page-card]')?.classList.toggle('is-selected', selected);
  });
  $('#themeSiteDomain').value = themeWorkspace.siteDomain;
  $('#themeSiteDomainField').hidden = false;
  const count = themeWorkspace.pages.length;
  $('#themeSelectedPageCount').textContent = `${count} ${count === 1 ? 'page' : 'pages'}`;
  $('#themeContinue').disabled = count === 0;
}

function themeComponentUsage(componentId) {
  if (componentId === themeWorkspace.header || componentId === themeWorkspace.footer) return ['All pages'];
  return selectedThemePages()
    .filter((page) => page.key !== activeThemePage && currentThemeBlocks(page.key).some((block) => block.id === componentId))
    .map((page) => page.label);
}

function themeSiteComponentUsage() {
  const usage = new Map();
  const add = (id, pageLabel) => {
    if (!componentById.has(id)) return;
    if (!usage.has(id)) usage.set(id, { id, pages: [], count: 0, global: false });
    const entry = usage.get(id);
    if (pageLabel && !entry.pages.includes(pageLabel)) entry.pages.push(pageLabel);
    entry.count++;
  };
  add(themeWorkspace.header, 'All pages');
  add(themeWorkspace.footer, 'All pages');
  if (usage.has(themeWorkspace.header)) usage.get(themeWorkspace.header).global = true;
  if (usage.has(themeWorkspace.footer)) usage.get(themeWorkspace.footer).global = true;
  for (const page of selectedThemePages()) {
    for (const block of currentThemeBlocks(page.key)) add(block.id, page.label);
  }
  return usage;
}

function renderThemeTabs() {
  const tabs = $('#themePageTabs');
  tabs.replaceChildren();
  selectedThemePages().forEach((page) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pg-theme-page-tab';
    button.dataset.themePageTab = page.key;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(page.key === activeThemePage));
    const mark = document.createElement('span');
    mark.className = 'pg-theme-tab-mark';
    mark.textContent = page.mark;
    const title = document.createElement('span');
    title.textContent = page.shortLabel;
    const count = document.createElement('small');
    count.textContent = currentThemeBlocks(page.key).length;
    button.append(mark, title, count);
    tabs.append(button);
  });
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'pg-theme-add-page';
  add.dataset.themeAddPage = '';
  add.textContent = '+ Page';
  tabs.append(add);
  const info = pageInfo();
  $('#themeCurrentMark').textContent = info.mark;
  $('#themeCurrentTitle').textContent = info.label;
  $('#themeCurrentType').textContent = info.type;
  $('#themeBlockCount').textContent = `${currentThemeBlocks().length} ${currentThemeBlocks().length === 1 ? 'component' : 'components'}`;
  $('#themeUsedCount').textContent = currentThemeBlocks().length;
  $('#themeSiteCount').textContent = themeSiteComponentUsage().size;
}

function renderThemeComponentList() {
  const list = $('#themeComponentList');
  const query = $('#themeComponentSearch').value.trim().toLowerCase();
  const pageCategory = pageInfo().category;
  const preferred = components.filter((component) => component.category === pageCategory);
  const ordered = [...preferred, ...components.filter((component) => component.category !== pageCategory)];
  list.replaceChildren();
  let shown = 0;
  for (const component of ordered) {
    if (pagesWithoutPageTitle.has(activeThemePage) && component.category === 'page-title') continue;
    const searchText = `${component.name} ${component.id} ${component.category} ${component.description} ${component.tags.join(' ')}`.toLowerCase();
    if (!searchText.includes(query)) continue;
    shown++;
    const usedElsewhere = themeComponentUsage(component.id);
    const usedHere = currentThemeBlocks().filter((block) => block.id === component.id).length;
    const card = document.createElement('article');
    card.className = 'pg-theme-component-card';
    const content = document.createElement('div');
    content.className = 'pg-theme-component-copy';
    const heading = document.createElement('div');
    heading.className = 'pg-theme-component-heading';
    const name = document.createElement('strong');
    name.textContent = component.name;
    const id = document.createElement('code');
    id.textContent = component.id;
    heading.append(name, id);
    const categoryLine = document.createElement('span');
    categoryLine.className = 'pg-theme-component-category';
    categoryLine.textContent = categoryLabel(component.category);
    content.append(heading, categoryLine);
    if (usedElsewhere.length) {
      const reuse = document.createElement('span');
      reuse.className = 'pg-theme-reuse-badge';
      reuse.textContent = `Used on ${usedElsewhere.join(', ')}`;
      content.append(reuse);
    } else if (usedHere) {
      const used = document.createElement('span');
      used.className = 'pg-theme-used-badge';
      used.textContent = usedHere === 1 ? 'Already on this page' : `${usedHere} times on this page`;
      content.append(used);
    }
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'pg-theme-component-add';
    add.dataset.themeAddComponent = component.id;
    add.setAttribute('aria-label', `${usedElsewhere.length ? 'Reuse' : 'Add'} ${component.name} on ${pageInfo().label}`);
    add.textContent = usedElsewhere.length ? 'Reuse here' : usedHere ? 'Add another' : 'Add';
    if (component.id === themeWorkspace.header || component.id === themeWorkspace.footer) {
      add.disabled = true;
      add.textContent = 'Global';
    }
    card.append(content, add);
    list.append(card);
  }
  $('#themeLibraryEmpty').hidden = shown > 0;
}

// The category already shows as the card title, so a leading copy of it ("Hero Diagonal Overlay") is dropped.
function themeVariantName(component) {
  const category = categoryLabel(component.category);
  return component.name.replace(new RegExp(`^${category}\\s+`, 'i'), '') || component.name;
}

function renderThemeUsedList() {
  const list = $('#themePageList');
  const blocksInPage = currentThemeBlocks();
  list.replaceChildren();
  $('#themeNoPageComponents').hidden = blocksInPage.length > 0;
  list.append(themeGlobalRow('header', 'Header'));
  blocksInPage.forEach((block, index) => {
    const component = componentById.get(block.id);
    const card = document.createElement('article');
    card.className = `pg-theme-used-card${index === selectedThemeIndex ? ' is-active' : ''}`;
    card.draggable = true;
    card.dataset.themeIndex = index;
    const grip = document.createElement('span');
    grip.className = 'pg-theme-used-grip';
    grip.setAttribute('aria-hidden', 'true');
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'pg-theme-used-head';
    head.dataset.themeSelectBlock = index;
    head.setAttribute('aria-pressed', String(index === selectedThemeIndex));
    const number = document.createElement('span');
    number.className = 'pg-theme-used-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const copy = document.createElement('span');
    copy.className = 'pg-theme-used-copy';
    const category = document.createElement('span');
    category.className = 'pg-theme-used-category';
    category.textContent = categoryLabel(component.category);
    // The component name tells apart several sections from the same category (e.g. two banners).
    const variant = document.createElement('span');
    variant.className = 'pg-theme-used-name';
    variant.textContent = themeVariantName(component);
    copy.append(category, variant);
    head.append(number, copy);
    if (block.defaultLayout) {
      const layoutBadge = document.createElement('small');
      layoutBadge.className = 'pg-theme-layout-badge';
      layoutBadge.textContent = 'Default';
      head.append(layoutBadge);
    }
    const menu = document.createElement('span');
    menu.className = 'pg-theme-used-menu-wrap';
    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'pg-theme-used-menu-button';
    menuButton.dataset.themeMenuToggle = index;
    menuButton.setAttribute('aria-haspopup', 'menu');
    menuButton.setAttribute('aria-expanded', String(index === openThemeMenuIndex));
    menuButton.setAttribute('aria-label', `Options for ${component.name}`);
    menuButton.textContent = '⋮';
    menu.append(menuButton);
    if (index === openThemeMenuIndex) {
      const popover = document.createElement('div');
      popover.className = 'pg-theme-used-menu';
      popover.setAttribute('role', 'menu');
      popover.innerHTML = `<button type="button" role="menuitem" data-theme-menu-action="duplicate" data-theme-menu-index="${index}">Duplicate</button><button type="button" role="menuitem" class="is-danger" data-theme-menu-action="delete" data-theme-menu-index="${index}">Delete</button>`;
      menu.append(popover);
    }
    card.append(grip, head, menu);
    list.append(card);
  });
  list.append(themeGlobalRow('footer', 'Footer'));
  const addSection = document.createElement('button');
  addSection.type = 'button';
  addSection.className = 'pg-theme-add-section';
  addSection.dataset.themeAddSection = '';
  addSection.innerHTML = '<span aria-hidden="true">＋</span> Add new section';
  list.append(addSection);
}

// Header and footer are always part of the site. Clicking them scrolls the canvas; the eye hides them, which
// keeps them out of the preview and the export as if they were never added. The row stays so they can be shown again.
const EYE_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

function themeGlobalRow(key, label) {
  if (!componentById.has(themeWorkspace[key])) return document.createDocumentFragment();
  const hidden = Boolean(themeWorkspace[`${key}Disabled`]);
  const card = document.createElement('article');
  card.className = `pg-theme-used-card is-global${hidden ? ' is-disabled' : ''}`;
  const head = document.createElement('button');
  head.type = 'button';
  head.className = 'pg-theme-used-head';
  head.dataset.themeGlobalScroll = key;
  const category = document.createElement('span');
  category.className = 'pg-theme-used-category';
  category.textContent = label;
  const tag = document.createElement('span');
  tag.className = 'pg-theme-global-tag';
  tag.textContent = hidden ? 'Hidden' : 'Global';
  head.append(category, tag);
  const eye = document.createElement('button');
  eye.type = 'button';
  eye.className = 'pg-theme-global-eye';
  eye.dataset.themeGlobalVisibility = key;
  eye.setAttribute('aria-pressed', String(!hidden));
  eye.setAttribute('aria-label', `${hidden ? 'Show' : 'Hide'} ${label}`);
  eye.title = `${hidden ? 'Show' : 'Hide'} ${label}`;
  eye.innerHTML = hidden ? EYE_OFF_ICON : EYE_ICON;
  card.append(head, eye);
  return card;
}

function renderThemeSiteList() {
  const list = $('#themeSiteList');
  const usage = themeSiteComponentUsage();
  list.replaceChildren();
  $('#themeNoSiteComponents').hidden = usage.size > 0;
  // Group by the same layout groups as the library (Layout, Content, Services…); anything else goes to "Other".
  const groups = new Map(categoryGroups.map((group) => [group.id, { label: group.label, entries: [] }]));
  const groupIdByCategory = new Map(categoryGroups.flatMap((group) => group.categories.map((category) => [category, group.id])));
  for (const entry of usage.values()) {
    const groupId = groupIdByCategory.get(componentById.get(entry.id).category) || 'other';
    if (!groups.has(groupId)) groups.set(groupId, { label: 'Other', entries: [] });
    groups.get(groupId).entries.push(entry);
  }
  for (const { label, entries } of groups.values()) {
    if (!entries.length) continue;
    const heading = document.createElement('p');
    heading.className = 'pg-theme-site-group';
    heading.textContent = label;
    list.append(heading);
    // One sub-heading per category (Testimonials, Blog, Contact… or Hero, Banner, Content) inside each group.
    const byCategory = [...entries].sort((a, b) => categoryLabel(componentById.get(a.id).category).localeCompare(categoryLabel(componentById.get(b.id).category)));
    let shownCategory = null;
    for (const entry of byCategory) {
      const component = componentById.get(entry.id);
      if (component.category !== shownCategory) {
        shownCategory = component.category;
        const subheading = document.createElement('p');
        subheading.className = 'pg-theme-site-subgroup';
        subheading.textContent = categoryLabel(component.category);
        list.append(subheading);
      }
      // Same card as "On this page": category on top, component variant below.
      const row = document.createElement('article');
      row.className = 'pg-theme-used-card pg-theme-site-card';
      const head = document.createElement('div');
      head.className = 'pg-theme-used-head';
      const copy = document.createElement('span');
      copy.className = 'pg-theme-used-copy';
      // The category is already the sub-heading, so the card only needs the variant name.
      const variant = document.createElement('span');
      variant.className = 'pg-theme-used-category';
      variant.textContent = themeVariantName(component);
      copy.append(variant);
      head.append(copy);
      row.append(head);
      if (entry.global) {
        const tag = document.createElement('span');
        tag.className = 'pg-theme-global-tag';
        tag.textContent = 'Global';
        head.append(tag);
      } else {
        const menu = document.createElement('span');
        menu.className = 'pg-theme-used-menu-wrap';
        const menuButton = document.createElement('button');
        menuButton.type = 'button';
        menuButton.className = 'pg-theme-used-menu-button';
        menuButton.dataset.themeSiteMenuToggle = entry.id;
        menuButton.setAttribute('aria-haspopup', 'menu');
        menuButton.setAttribute('aria-expanded', String(openThemeSiteMenu === entry.id));
        menuButton.setAttribute('aria-label', `Options for ${component.name}`);
        menuButton.textContent = '⋮';
        menu.append(menuButton);
        if (openThemeSiteMenu === entry.id) {
          const popover = document.createElement('div');
          popover.className = 'pg-theme-used-menu';
          popover.setAttribute('role', 'menu');
          popover.innerHTML = `<button type="button" role="menuitem" data-theme-reuse-component="${escapeHtml(entry.id)}">Add in this page</button>`;
          menu.append(popover);
        }
        row.append(menu);
      }
      list.append(row);
    }
  }
  $('#themeNoSiteComponents').hidden = usage.size > 0;
}

const fieldTypeLabels = {
  text: 'Text', textarea: 'Text area', url: 'Link', image: 'Image', imagelist: 'Images', taglist: 'Tags', toggle: 'Toggle',
  html: 'Rich text', select: 'Select', radio: 'Radio', datastoreitem: 'Item', datastoreitemlist: 'Items', fieldset: 'Repeatable',
};

// The component's schema: the Page Custom Fields it exposes in Marketpath (Eyebrow, Title, Description, Button…).
// Repeatable fieldsets list their own fields indented underneath.
function themeFieldsMarkup(component) {
  const bindings = blockBindings[selectedThemeIndex] || [];
  const shortKey = (field) => (field.FieldID.startsWith(component.prefix) ? field.FieldID.slice(component.prefix.length) : field.FieldID);
  const datastoreIdFor = (field) => {
    const guid = Array.isArray(field.DatastoreGUID) ? field.DatastoreGUID[0] : field.DatastoreGUID;
    return datastores.find((datastore) => datastore.guidPlaceholder === guid)?.id;
  };
  // A row is editable only when its sample text was found in the preview, so it can be recorded against the field.
  const editSpec = (field, parentKey) => {
    if (parentKey) {
      return bindings.some((binding) => binding.kind === 'field' && binding.path[0] === parentKey && binding.path.at(-1) === field.FieldID)
        ? { t: 'child', k: parentKey, c: field.FieldID } : null;
    }
    const key = shortKey(field);
    if (field.Type === 'fieldset') {
      return bindings.some((binding) => binding.kind === 'field' && binding.path[0] === key) ? { t: 'list', k: key } : null;
    }
    if (field.Type === 'datastoreitemlist' || field.Type === 'datastoreitem') {
      const datastoreId = datastoreIdFor(field);
      return datastoreId && bindings.some((binding) => binding.kind === 'datastore' && binding.datastoreId === datastoreId) ? { t: 'store', d: datastoreId } : null;
    }
    if (textFieldTypes.has(field.Type)) {
      return bindings.some((binding) => binding.kind === 'field' && binding.path.length === 1 && binding.path[0] === key) ? { t: 'field', k: key } : null;
    }
    return null;
  };
  const rows = (fields, nested = false, parentKey = null) => fields.map((field) => {
    if (field.Type === 'group') return `<li class="pg-theme-field-group">${escapeHtml(field.Label || '')}</li>${rows(field.Fields || [], nested, parentKey)}`;
    const children = field.Type === 'fieldset' ? rows(field.Fields || [], true, shortKey(field)) : '';
    const content = `<span>${escapeHtml(field.Label || field.FieldID)}</span><small>${escapeHtml(fieldTypeLabels[field.Type] || field.Type)}</small>`;
    // Text, items and service cards found in the preview can be edited there. Images, links, selects and the like are
    // shown disabled, with a tooltip saying so.
    const spec = editSpec(field, nested ? parentKey : null);
    if (spec) {
      return `<li class="pg-theme-field-row is-editable${nested ? ' is-nested' : ''}"><button type="button" data-theme-edit-field="${escapeHtml(JSON.stringify(spec))}">${content}</button></li>${children}`;
    }
    return `<li class="pg-theme-field-row is-locked${nested ? ' is-nested' : ''}" aria-disabled="true" data-tip="This can't be changed in the preview">${content}</li>${children}`;
  }).join('');
  const list = rows(component.fields || []);
  const empty = component.settingsDatastoreId ? 'No page fields. This component reads the global Page Settings.' : 'No page fields on this component.';
  const hint = list.includes('data-theme-edit-field') ? '<p class="pg-theme-fields-hint">Click a field to edit it in the preview. Edits are included in the import. Greyed fields can\'t be changed there.</p>' : '';
  return `<div class="pg-theme-fields"><span class="pg-theme-fields-kicker">FIELDS</span>${hint}${list ? `<ul>${list}</ul>` : `<p>${empty}</p>`}</div>`;
}

function renderThemeInspector() {
  const body = $('#themeInspectorBody');
  const component = currentThemeBlocks()[selectedThemeIndex] && componentById.get(currentThemeBlocks()[selectedThemeIndex].id);
  const info = pageInfo();
  if (!component) {
    $('#themeInspectorTitle').textContent = 'This page';
    body.innerHTML = `<div class="pg-theme-page-summary"><span class="pg-theme-inspector-mark">${info.mark}</span><div><strong>${info.label}</strong><small>${info.type}</small></div></div><p class="pg-theme-inspector-hint">Select a section to see its fields and change it. Each page keeps its own structure.</p>`;
    return;
  }
  $('#themeInspectorTitle').textContent = component.name;
  const isDefaultLayout = Boolean(currentThemeBlocks()[selectedThemeIndex].defaultLayout);
  const layoutNote = isDefaultLayout ? '<div class="pg-theme-default-layout-note"><strong>Default layout section</strong><span>Included automatically on this page. You can remove it at any time.</span></div>' : '';
  const categoryName = categoryLabel(component.category);
  body.innerHTML = `<button type="button" class="pg-theme-selected-component pg-theme-swap-toggle" data-theme-swap-toggle aria-haspopup="dialog"><span class="pg-theme-inspector-mark">${categoryName.slice(0, 1)}</span><div><strong>${escapeHtml(component.name)}</strong><small>${escapeHtml(component.id)}</small></div><span class="pg-theme-swap-hint">Change</span></button><p class="pg-theme-inspector-description">${component.description}</p>${themeFieldsMarkup(component)}${layoutNote}<div class="pg-theme-inspector-actions"><button type="button" data-theme-action="edit">${currentThemeBlocks()[selectedThemeIndex].editing ? '✓  Finish editing' : '✎  Edit text in preview'}</button></div>`;
}

function renderThemePanel() {
  document.querySelectorAll('[data-theme-panel]').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.themePanel === activeThemePanel));
  });
  $('#themeLibraryPanel').hidden = activeThemePanel !== 'library';
  $('#themePagePanel').hidden = activeThemePanel !== 'page';
  $('#themeSitePanel').hidden = activeThemePanel !== 'site';
}

function renderThemeBuilder() {
  if (!themeWorkspace.pages.includes(activeThemePage)) activeThemePage = themeWorkspace.pages[0];
  $('#themeName').textContent = themeWorkspace.name;
  $('#themeAssetTheme').value = themeWorkspace.assetTheme;
  $('#themeProjectCount').value = String(themeWorkspace.projectCount);
  renderThemeVariables();
  const exportButton = $('[data-theme-export]');
  const missingShell = !themeGlobalOn('header') || !themeGlobalOn('footer');
  exportButton.disabled = !themeWorkspace.siteDomain || missingShell;
  exportButton.title = missingShell
    ? 'Enable a header and a footer before exporting.'
    : exportButton.disabled ? 'Enter the Marketpath site domain in Edit pages before exporting.' : 'Download this theme as a Marketpath import ZIP.';
  $('#themeExportDomainHint').textContent = missingShell ? 'Enable a header and footer' : 'Set the site domain';
  $('#themeExportDomainHint').hidden = !exportButton.disabled;
  renderThemeTabs();
  renderThemeComponentList();
  renderThemeUsedList();
  renderThemeSiteList();
  renderThemeInspector();
  renderThemePanel();
  renderThemeCanvas();
}

function renderThemeVariables() {
  document.querySelectorAll('[data-theme-token]').forEach((input) => {
    input.value = themeWorkspace.variables[input.dataset.themeToken];
  });
  $('#themeVariablesCode').textContent = createThemeVariablesScss(themeWorkspace.variables);
}

function emptyThemePageCopy(page) {
  const copy = {
    home: ['Build your homepage', 'Start with a hero, then add the sections your site needs.', 'Add a hero section'],
    generic: ['Build your generic page', 'Add content sections to shape this page for its purpose.', 'Add page content'],
    about: ['Build your About page', 'Introduce your company, your approach, and the people behind your work.', 'Add About content'],
    contact: ['Build your contact page', 'Add contact information and the sections visitors need to reach you.', 'Add contact content'],
    error: ['Build your 404 page', 'Choose a helpful error page layout and guide visitors back to your site.', 'Add an error page section'],
    services: ['Build your Services page', 'Add a service listing or another section to introduce your services.', 'Add Services content'],
    'inside-services': ['Build your service detail page', 'Add the sections used to describe an individual service.', 'Add service detail content'],
    projects: ['Build your Projects page', 'Add project cards or a visual section to showcase your work.', 'Add Projects content'],
    'inside-projects': ['Project Details', 'Add the project detail layout and supporting content for this page.', 'Build Your Detail Page'],
    blog: ['Build your Blog page', 'Add a blog layout to introduce articles and editorial content.', 'Add Blog content'],
    testimonials: ['This is your Testimonials page', 'Add a testimonial section to feature customer stories and reviews.', 'Add testimonial content'],
    team: ['Build your Team Members page', 'Add a team layout to introduce the people behind the business.', 'Add team content'],
    thankyou: ['Build your Thank You page', 'Add a confirmation message and helpful next steps.', 'Add Thank You content'],
    gallery: ['Build your Gallery page', 'Add an image gallery to showcase visual work and project photos.', 'Add Gallery content'],
    faqs: ['Build your FAQs page', 'Add an FAQ section to answer common questions.', 'Add FAQ content'],
  };
  return copy[page.key] || [`Build your ${page.label} page`, `Add ${categoryLabel(page.category)} sections to get started.`, `Add ${page.label} content`];
}

function renderThemeInsertGroups() {
  const nav = $('#themeInsertGroups');
  nav.replaceChildren();
  for (const group of themeCategoryGroups) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.themeInsertGroup = group.id;
    button.setAttribute('aria-pressed', String(group.id === activeInsertGroup));
    button.textContent = group.label;
    const count = document.createElement('small');
    count.textContent = components.filter((component) => group.categories.includes(component.category)).length;
    button.append(count);
    nav.append(button);
  }
}

function renderThemeInsertCategories() {
  const group = themeCategoryGroups.find((item) => item.id === activeInsertGroup) || themeCategoryGroups[0];
  const nav = $('#themeInsertCategories');
  nav.replaceChildren();
  const categories = [{ id: 'all', label: `All ${group.label}` }, ...group.categories.map((category) => ({ id: category, label: categoryLabel(category) }))];
  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.themeInsertCategory = category.id;
    button.setAttribute('aria-pressed', String(category.id === activeInsertCategory));
    button.textContent = category.label;
    nav.append(button);
  }
}

function renderThemeInsertComponents() {
  const grid = $('#themeInsertComponents');
  const group = themeCategoryGroups.find((item) => item.id === activeInsertGroup) || themeCategoryGroups[0];
  const query = $('#themeInsertSearch').value.trim().toLowerCase();
  const changing = insertMode === 'change';
  const changingComponent = changing ? componentById.get(currentThemeBlocks()[changeBlockIndex]?.id) : null;
  const categoryIds = changing ? [changingComponent?.category] : activeInsertCategory === 'all' ? group.categories : [activeInsertCategory];
  $('#themeInsertGroups').hidden = changing || Boolean(query);
  $('#themeInsertCategories').hidden = changing || Boolean(query);
  const pageCategory = pageInfo().category;
  const filtered = components.filter((component) => {
    if (pagesWithoutPageTitle.has(activeThemePage) && component.category === 'page-title') return false;
    const matchesCategory = changing ? categoryIds.includes(component.category) : query || categoryIds.includes(component.category);
    const searchText = `${component.name} ${component.id} ${component.category} ${component.description} ${component.tags.join(' ')}`.toLowerCase();
    return matchesCategory && searchText.includes(query);
  });
  const ordered = [...filtered.filter((component) => component.category === pageCategory), ...filtered.filter((component) => component.category !== pageCategory)];
  for (const stage of insertPreviewObserverStages) insertPreviewObserver.unobserve(stage);
  insertPreviewObserverStages = [];
  grid.replaceChildren();
  for (const component of ordered) {
    const card = document.createElement('article');
    card.className = 'pg-theme-insert-card';
    const previewStage = document.createElement('div');
    previewStage.className = 'pg-theme-insert-preview';
    const preview = document.createElement('iframe');
    preview.setAttribute('sandbox', '');
    preview.setAttribute('title', `${component.name} preview`);
    preview.loading = 'lazy';
    preview.srcdoc = previewDocument(component, { bootstrap: false, theme: themeWorkspace.variables });
    previewStage.append(preview);
    const details = document.createElement('div');
    details.className = 'pg-theme-insert-card-details';
    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = component.name;
    const meta = document.createElement('small');
    meta.textContent = `${categoryLabel(component.category)} · ${component.id}`;
    copy.append(name, meta);
    const add = document.createElement('button');
    add.type = 'button';
    if (changing && component.id === changingComponent?.id) {
      add.disabled = true;
      add.textContent = 'Current';
    } else {
      add.dataset.themeInsertComponent = component.id;
      add.setAttribute('aria-label', changing ? `Use ${component.name} for this section` : `Add ${component.name} after the selected section`);
      add.innerHTML = changing ? 'Use this' : '<span aria-hidden="true">＋</span> Add';
    }
    details.append(copy, add);
    card.append(previewStage, details);
    grid.append(card);
    insertPreviewObserverStages.push(previewStage);
    insertPreviewObserver.observe(previewStage);
  }
  $('#themeInsertEmpty').hidden = ordered.length > 0;
  $('#themeInsertEmpty').textContent = query ? 'No components match your search.' : 'No components found in this group.';
}

let insertPreviewObserverStages = [];

// Opens the same picker as "Add section", limited to the selected section's category, to swap it for another one.
function openThemeChangeDialog(index) {
  const current = componentById.get(currentThemeBlocks()[index]?.id);
  if (!current) return;
  insertMode = 'change';
  changeBlockIndex = index;
  const category = categoryLabel(current.category);
  $('#themeInsertTitle').textContent = `Change ${category}`;
  $('#themeInsertContext').textContent = `Choose another ${category} for this section of ${pageInfo().label}.`;
  $('#themeInsertFooterNote').textContent = 'Choose a preview to replace this section.';
  $('#themeInsertSearch').value = '';
  renderThemeInsertComponents();
  const dialog = $('#themeInsertDialog');
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => $('#themeInsertSearch').focus());
}

function openThemeInsertDialog(insertIndex, afterName = '', preferredCategory = pageInfo().category) {
  insertMode = 'add';
  $('#themeInsertTitle').textContent = 'Add a section';
  $('#themeInsertFooterNote').textContent = 'Choose a preview to insert it at the selected point on this page.';
  pendingThemeInsertIndex = Math.max(0, Math.min(insertIndex, currentThemeBlocks().length));
  const page = pageInfo();
  $('#themeInsertContext').textContent = afterName
    ? `Add a component after ${afterName} on ${page.label}.`
    : `Add the first component to ${page.label}.`;
  const matchingGroup = themeCategoryGroups.find((group) => group.categories.includes(preferredCategory));
  activeInsertGroup = matchingGroup?.id || 'layout';
  activeInsertCategory = matchingGroup?.categories.includes(preferredCategory) ? preferredCategory : 'all';
  $('#themeInsertSearch').value = '';
  renderThemeInsertGroups();
  renderThemeInsertCategories();
  renderThemeInsertComponents();
  const dialog = $('#themeInsertDialog');
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => $('#themeInsertSearch').focus());
}

// editable: false drops the selection outline and the "Add section" slots, for the large preview and the new tab.
function themeDocumentForPage({ editable = true, pageKey = activeThemePage } = {}) {
  const blocksInPage = currentThemeBlocks(pageKey);
  const page = pageInfo(pageKey);
  const [emptyTitle, emptyDescription, emptyAction] = emptyThemePageCopy(page);
  const renderBlock = (block, index) => {
    const imageSources = [...(componentById.get(block.id)?.preview.html.matchAll(/<img\b[^>]*\bsrc="(sample-image:[^"]+)"/g) || [])].map((match) => match[1]);
    const template = document.createElement('template');
    template.innerHTML = block.html;
    [...template.content.querySelectorAll('img')].forEach((image, imageIndex) => {
      if (imageSources[imageIndex]) image.setAttribute('src', imageSources[imageIndex]);
    });
    const html = template.innerHTML;
    if (!editable) return `<div class="theme-component" data-theme-block="${index}">${html}</div>`;
    return `<div class="theme-component${index === selectedThemeIndex ? ' is-selected' : ''}${block.editing ? ' is-editing' : ''}" data-theme-block="${index}">${html}</div><div class="theme-insert-slot${index === selectedThemeIndex ? ' is-after-selected' : ''}" data-theme-insert-slot="${index}"><button type="button" data-theme-insert-after="${index}" aria-label="Add a component after ${componentById.get(block.id).name}"><b aria-hidden="true">＋</b><span>Add section below</span></button></div>`;
  };
  const header = themeGlobalOn('header') ? headerWithThemeMenu(componentById.get(themeWorkspace.header).preview.html) : '';
  const footer = themeGlobalOn('footer') ? componentById.get(themeWorkspace.footer).preview.html : '';
  const hasPageContent = blocksInPage.some((block) => !block.defaultLayout);
  const welcome = !hasPageContent && editable
    ? `<section class="py-3"><div class="container py-2"><div class="theme-empty-page text-center py-5"><p class="small text-uppercase text-primary fw-semibold mb-2">${page.type}</p><h1 class="h2 fw-semibold text-dark">${emptyTitle}</h1><p class="text-secondary mb-4">${emptyDescription}</p><button type="button" data-theme-add-category="${page.category}" class="theme-empty-action"><b aria-hidden="true">＋</b> ${emptyAction}</button></div></div></section>`
    : '';
  const pageTitles = blocksInPage.map((block, index) => [block, index]).filter(([block]) => componentById.get(block.id)?.category === 'page-title');
  const otherBlocks = blocksInPage.map((block, index) => [block, index]).filter(([block]) => componentById.get(block.id)?.category !== 'page-title');
  const sections = [...pageTitles.map(([block, index]) => renderBlock(block, index)), welcome, ...otherBlocks.map(([block, index]) => renderBlock(block, index))].filter(Boolean).join('\n');
  const styles = '<style>html{scroll-behavior:smooth}body{margin:0}.theme-component{position:relative}.theme-component.is-selected>*{outline:2px solid #4767ed;outline-offset:-2px}.theme-component.is-editing>*{cursor:text}.theme-component.is-editing *{cursor:text}.theme-insert-slot{position:relative;z-index:20;display:flex;align-items:center;justify-content:center;height:20px;margin-top:-10px;opacity:.42;transition:height .15s,margin .15s,opacity .15s}.theme-insert-slot button{display:flex;align-items:center;gap:8px;padding:3px 9px;border:1px solid #cbd5ef;border-radius:999px;background:#fff;color:#4262cf;font:600 12px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px #263b641b;cursor:pointer}.theme-insert-slot button b,.theme-empty-action b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#315cf3;color:#fff;font:400 17px/1 system-ui,sans-serif}.theme-insert-slot button span{display:none}.theme-insert-slot.is-after-selected,.theme-insert-slot:hover,.theme-insert-slot:focus-within{height:40px;margin-top:-20px;opacity:1}.theme-insert-slot.is-after-selected button span,.theme-insert-slot:hover button span,.theme-insert-slot:focus-within button span{display:inline}.theme-insert-slot button:hover{border-color:#315cf3;box-shadow:0 4px 12px #263b6433}.theme-empty-action{display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border:1px solid #d7def3;border-radius:999px;background:#fff;color:#395ac3;font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 3px 12px #263b6414;cursor:pointer}.theme-empty-action:hover{border-color:#315cf3;background:#f7f8ff}.theme-field-target{outline:2px solid #c6530c!important;outline-offset:4px;border-radius:3px}.theme-field-target[contenteditable=true]{cursor:text}</style>';
  const globalsUseBootstrap = componentById.get(themeWorkspace.header)?.bootstrapJs || componentById.get(themeWorkspace.footer)?.bootstrapJs;
  const bootstrap = Boolean(globalsUseBootstrap || blocksInPage.some((block) => componentById.get(block.id)?.bootstrapJs));
  const theme = exportThemes.find(({ id }) => id === themeWorkspace.assetTheme);
  const images = Object.fromEntries(Object.entries(themePreviewImageNames).flatMap(([key, name]) => {
    const asset = themeFiles.find((file) => file.theme === theme?.name && file.name.toLowerCase() === name.toLowerCase());
    return asset ? [[key, asset.url]] : [];
  }));
  return previewDocument({ preview: { html: `${styles}<div data-theme-global="header">${header}</div>${sections}<div data-theme-global="footer">${footer}</div>` }, bootstrapJs: bootstrap }, { bootstrap, images, allowSameOriginImages: true, theme: themeWorkspace.variables });
}

function getThemeFrameHeight() {
  return Math.max(440, $('#themeCanvasStage').clientHeight - 38);
}

function resizeThemeFrame() {
  const stage = $('#themeCanvasStage');
  if (!stage.clientWidth) return;
  const height = getThemeFrameHeight();
  const scale = Math.min(1, (stage.clientWidth - 38) / themeViewportWidth);
  const frame = $('#themePageFrame');
  frame.style.width = `${themeViewportWidth}px`;
  frame.style.height = `${height}px`;
  frame.style.transform = `scale(${scale})`;
  $('#themeFrameSizer').style.width = `${themeViewportWidth * scale}px`;
  $('#themeFrameSizer').style.height = `${height * scale}px`;
  $('#themeCanvasWidth').textContent = `${themeViewportWidth} px`;
  document.querySelectorAll('[data-theme-viewport]').forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.themeViewport) === themeViewportWidth));
}

// The canvas iframe scrolls itself, so bringing a section into view is a plain scrollIntoView inside it.
function scrollThemeCanvasTo(index) {
  const doc = $('#themePageFrame').contentDocument;
  doc?.querySelector(`[data-theme-block="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// The header's example menu is built from the pages chosen in "Edit pages", grouped like the export's Main Menu.
// A group with a single page collapses to a plain link; Error 404 is never listed.
function themeMenuItems() {
  const has = (key) => themeWorkspace.pages.includes(key);
  const group = (label, page, children) => {
    const kids = children.filter(([, key]) => has(key)).map(([childLabel, key]) => ({ label: childLabel, page: key }));
    if (kids.length < 2) return kids[0] || null;
    return { label, page: page && has(page) ? page : null, children: kids };
  };
  return [
    has('home') && { label: 'Home', page: 'home' },
    group('About', 'about', [['About', 'about'], ['Testimonials', 'testimonials'], ['Generic Page', 'generic'], ['Team', 'team']]),
    group('Services', 'services', [['Services', 'services'], ['Service specific', 'inside-services']]),
    group('Projects', 'projects', [['Projects', 'projects'], ['Project specific', 'inside-projects']]),
    group('Resources', null, [['FAQs', 'faqs'], ['Blog', 'blog'], ['Gallery', 'gallery']]),
    has('contact') && { label: 'Contact', page: 'contact' },
  ].filter(Boolean);
}

// Rewrites the header sample's nav lists with the theme menu, reusing the header's own link and dropdown markup
// so each header keeps its styling. Links carry data-theme-page so the preview knows where they go.
function headerWithThemeMenu(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const items = themeMenuItems();
  template.content.querySelectorAll('ul.navbar-nav').forEach((list) => {
    const linkTemplate = list.querySelector(':scope > li:not(.dropdown)');
    const dropdownTemplate = list.querySelector(':scope > li.dropdown');
    if (!linkTemplate) return;
    const setLink = (anchor, label, page) => {
      anchor.textContent = label;
      anchor.setAttribute('href', '#');
      if (page) anchor.dataset.themePage = page;
      else delete anchor.dataset.themePage;
    };
    const makeLink = ({ label, page }) => {
      const item = linkTemplate.cloneNode(true);
      setLink(item.querySelector('a'), label, page);
      return item;
    };
    const makeDropdown = ({ label, page, children }) => {
      const menu = dropdownTemplate?.querySelector('.dropdown-menu');
      const childTemplate = menu?.querySelector('li');
      if (!menu || !childTemplate) return children.map(makeLink);
      const item = dropdownTemplate.cloneNode(true);
      setLink(item.querySelector(':scope > a'), label, page);
      item.querySelector('.dropdown-menu').replaceChildren(...children.map((child) => {
        const childItem = childTemplate.cloneNode(true);
        setLink(childItem.querySelector('a'), child.label, child.page);
        return childItem;
      }));
      return [item];
    };
    list.replaceChildren(...items.flatMap((item) => (item.children ? makeDropdown(item) : [makeLink(item)])));
  });
  return template.innerHTML;
}

// Footer links and any other sample link are matched to a theme page by their text ("Our projects" → projects).
const previewLinkRules = [
  [/^home$/, 'home'],
  [/residential|commercial|windows|doors|outdoor|home improvements/, 'inside-services'],
  [/about|our story/, 'about'],
  [/contact/, 'contact'],
  [/service/, 'services'],
  [/project|our work|recent/, 'projects'],
  [/blog|news|insight/, 'blog'],
  [/gallery/, 'gallery'],
  [/team/, 'team'],
  [/testimonial|review/, 'testimonials'],
  [/faq/, 'faqs'],
];

function previewPageForLink(link) {
  if (link.dataset.themePage) return link.dataset.themePage;
  if (link.getAttribute('href') === '/') return 'home';
  const label = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  return previewLinkRules.find(([pattern]) => pattern.test(label))?.[1] || null;
}

// Preview links must never navigate the preview into the app itself. Dropdowns open on hover like a real site.
// With onNavigate, a link that matches a theme page goes there; same-page anchors (#section) still work.
function blockPreviewNavigation(doc, onNavigate) {
  if (!doc) return;
  const closeMenus = (except) => doc.querySelectorAll('.dropdown-menu.show').forEach((menu) => {
    if (!except?.contains(menu)) menu.classList.remove('show');
  });
  doc.addEventListener('mouseover', (event) => {
    const dropdown = event.target.closest('.dropdown');
    closeMenus(dropdown);
    dropdown?.querySelector(':scope > .dropdown-menu')?.classList.add('show');
  });
  doc.documentElement.addEventListener('mouseleave', () => closeMenus());
  doc.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (/^(tel|mailto):/i.test(href)) {
      event.preventDefault();
      return;
    }
    const pageKey = onNavigate && previewPageForLink(link);
    if (pageKey) {
      event.preventDefault();
      onNavigate(pageKey);
      return;
    }
    if (!href.startsWith('#')) event.preventDefault();
  });
}

let previewPageKey = null;
let previewNoteTimer;

function renderLargePreview() {
  const frame = $('#themePreviewFrame');
  const select = $('#themePreviewPage');
  select.replaceChildren(...selectedThemePages().map((page) => new Option(page.label, page.key, false, page.key === previewPageKey)));
  frame.onload = () => blockPreviewNavigation(frame.contentDocument, goToPreviewPage);
  frame.srcdoc = themeDocumentForPage({ editable: false, pageKey: previewPageKey });
}

function goToPreviewPage(key) {
  if (!themeWorkspace.pages.includes(key)) {
    const note = $('#themePreviewNote');
    note.textContent = `${themePages.find((page) => page.key === key)?.label || 'That page'} isn't in this theme`;
    clearTimeout(previewNoteTimer);
    previewNoteTimer = setTimeout(() => { note.textContent = ''; }, 2200);
    return;
  }
  ensureDefaultThemeElementsForPage(key);
  previewPageKey = key;
  renderLargePreview();
}

// ---- Linking preview text to the data the import uses ----------------------------------------------------------
// Preview HTML has no per-field markup. Each sample text (a component's mockData, or a sample datastore item such as a
// service card) is matched to the smallest preview element with exactly that text. Typing in a matched element records
// the new value: on the block (block.values, a copy of mockData) or in themeWorkspace.datastoreEdits. The export reads
// both, so an edit made in the preview is also what gets imported.
const textFieldTypes = new Set(['text', 'textarea', 'html']);

const isBindableText = (key, value) => typeof value === 'string' && value.trim()
  && !/^(https?:|\/|#|mailto:|tel:|bi |sample-image)/.test(value.trim())
  && !/(link|url|image|icon|^name$)/i.test(String(key));

const entityText = (value) => String(value ?? '')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const compactText = (value) => entityText(value).replace(/\s+/g, '');
const elementCompactText = (element) => element.textContent.replace(/\s+/g, '');
const cleanInnerHtml = (element) => {
  const clone = element.cloneNode(true);
  clone.querySelectorAll('[contenteditable]').forEach((node) => node.removeAttribute('contenteditable'));
  clone.querySelectorAll('.theme-field-target').forEach((node) => node.classList.remove('theme-field-target'));
  return clone.innerHTML;
};

function componentDatastoreIds(component) {
  return [...new Set([...(component.datastoreIds || []), ...(component.datastoreId ? [component.datastoreId] : [])])];
}

function currentDatastoreItems(datastoreId) {
  const edits = themeWorkspace.datastoreEdits?.[datastoreId] || {};
  return (exampleDatastoreItems[datastoreId] || []).map((item, index) => ({ ...item, ...(edits[index] || {}) }));
}

// Fallback for a title/eyebrow/description/button text whose sample text no longer appears in the preview (for example
// because it was edited before edits were recorded): find the element by its place in the markup.
function themeFieldRole(field) {
  const id = field.FieldID || '';
  if (/(button|cta)_text$/.test(id)) return 'buttonText';
  if (/eyebrow$/.test(id)) return 'eyebrow';
  if (/title$/.test(id)) return 'title';
  if (/description$/.test(id) && field.Type !== 'html') return 'description';
  return null;
}

function previewFieldElement(root, role) {
  const isTextLeaf = (element) => element
    && /^(P|SPAN|DIV|SMALL|H[1-6])$/.test(element.tagName)
    && element.textContent.trim()
    && !element.querySelector('p, div, h1, h2, h3, ul, a');
  const title = root.querySelector('h1, h2, h3');
  switch (role) {
    case 'title':
      return title;
    case 'eyebrow':
      return isTextLeaf(title?.previousElementSibling) ? title.previousElementSibling : null;
    case 'description': {
      const lead = root.querySelector('p.lead');
      if (lead) return lead;
      for (let element = title?.nextElementSibling; element; element = element.nextElementSibling) {
        if (element.tagName === 'P') return element;
      }
      return null;
    }
    case 'buttonText':
      return root.querySelector('a.btn, button.btn, a[class*="btn-"]');
    default:
      return null;
  }
}

const themeFieldShortKey = (component, field) => (field.FieldID.startsWith(component.prefix) ? field.FieldID.slice(component.prefix.length) : field.FieldID);

function datastoreIdForField(field) {
  const guid = Array.isArray(field.DatastoreGUID) ? field.DatastoreGUID[0] : field.DatastoreGUID;
  return datastores.find((datastore) => datastore.guidPlaceholder === guid)?.id;
}

function buildBlockBindings(root, block, component) {
  const elements = [...root.querySelectorAll('*')];
  const claimed = new Set();
  const bindings = [];
  const claim = (binding, text) => {
    const target = compactText(text);
    if (!target) return;
    // The smallest element with exactly this text, so a paragraph wins over the wrapper that only contains it.
    const element = elements.find((candidate) => !claimed.has(candidate)
      && elementCompactText(candidate) === target
      && ![...candidate.children].some((child) => elementCompactText(child) === target));
    if (!element) return;
    claimed.add(element);
    bindings.push({ ...binding, element, original: text, syncedText: element.textContent });
  };
  const walk = (value, path) => {
    if (typeof value === 'string') {
      if (isBindableText(path.at(-1), value)) claim({ kind: 'field', path, html: /<\w+/.test(value) }, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, [...path, index]));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => walk(item, [...path, key]));
    }
  };
  const shortKey = (field) => themeFieldShortKey(component, field);
  // A mockData list that stands for a datastore field (service cards…) is shown in the preview as the datastore's
  // items, so its texts are recorded against those items by position instead of as a field value.
  const storeByKey = new Map();
  const collectStores = (fields) => {
    for (const field of fields || []) {
      if (field.Type === 'group') collectStores(field.Fields);
      else if (['datastoreitemlist', 'datastoreitem'].includes(field.Type) && field.FieldID) storeByKey.set(shortKey(field), datastoreIdForField(field));
    }
  };
  collectStores(component.fields);
  const values = block.values || component.mockData || {};
  Object.entries(values).forEach(([key, value]) => {
    const datastoreId = storeByKey.get(key);
    if (!datastoreId || !Array.isArray(value)) {
      walk(value, [key]);
      return;
    }
    value.forEach((item, index) => {
      for (const [childKey, childValue] of Object.entries(item || {})) {
        if (isBindableText(childKey, childValue)) claim({ kind: 'datastore', datastoreId, index, path: [childKey], html: /<\w+/.test(childValue) }, childValue);
      }
    });
  });
  // The card title has no mockData entry: take it from the first heading of the card that holds each item's text.
  const anchors = new Map();
  for (const binding of bindings) {
    if (binding.kind !== 'datastore') continue;
    if (!anchors.has(binding.datastoreId)) anchors.set(binding.datastoreId, new Map());
    if (!anchors.get(binding.datastoreId).has(binding.index)) anchors.get(binding.datastoreId).set(binding.index, binding.element);
  }
  for (const [datastoreId, byIndex] of anchors) {
    const indexes = [...byIndex.keys()].sort((a, b) => a - b);
    if (indexes.length < 2) continue;
    let container = byIndex.get(indexes[0]).parentElement;
    while (container && !indexes.every((index) => container.contains(byIndex.get(index)))) container = container.parentElement;
    if (!container) continue;
    for (const index of indexes) {
      const card = [...container.children].find((child) => child.contains(byIndex.get(index)));
      const heading = card && [...card.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title')].find((element) => !claimed.has(element));
      if (!heading) continue;
      claimed.add(heading);
      bindings.push({ kind: 'datastore', datastoreId, index, path: ['Title'], html: false, element: heading, original: currentDatastoreItems(datastoreId)[index]?.Title ?? '', syncedText: heading.textContent });
    }
  }
  // Datastores without a mockData list (testimonials, FAQs…): match the sample items' own texts.
  for (const datastoreId of componentDatastoreIds(component)) {
    if (anchors.has(datastoreId)) continue;
    currentDatastoreItems(datastoreId).forEach((item, index) => {
      for (const [key, value] of Object.entries(item)) {
        if (isBindableText(key, value)) claim({ kind: 'datastore', datastoreId, index, path: [key], html: /<\w+/.test(value) }, value);
      }
    });
  }
  const visit = (fields) => {
    for (const field of fields || []) {
      if (field.Type === 'group') visit(field.Fields);
      else if (textFieldTypes.has(field.Type) && field.FieldID) {
        const key = shortKey(field);
        if (bindings.some((binding) => binding.kind === 'field' && binding.path.length === 1 && binding.path[0] === key)) continue;
        const role = themeFieldRole(field);
        const element = role && previewFieldElement(root, role);
        if (!element || claimed.has(element)) continue;
        claimed.add(element);
        bindings.push({ kind: 'field', path: [key], html: field.Type === 'html', element, original: values[key] ?? '', syncedText: element.textContent });
      }
    }
  };
  visit(component.fields);
  return bindings;
}

function rebuildPreviewBindings(doc) {
  previewBindings.clear();
  blockBindings = [];
  doc.querySelectorAll('[data-theme-block]').forEach((root) => {
    const index = Number(root.dataset.themeBlock);
    const block = currentThemeBlocks()[index];
    const component = block && componentById.get(block.id);
    if (!component) return;
    const bindings = buildBlockBindings(root, block, component);
    bindings.forEach((binding) => {
      binding.blockIndex = index;
      previewBindings.set(binding.element, binding);
    });
    blockBindings[index] = bindings;
  });
  renderThemeInspector();
}

// The binding for whatever the caret is in, or for the element the event came from.
function bindingAtCaret(doc, blockElement, fallbackTarget) {
  const node = doc.getSelection()?.anchorNode;
  for (let element = node?.nodeType === 1 ? node : node?.parentElement; element && element !== blockElement; element = element.parentElement) {
    if (previewBindings.has(element)) return previewBindings.get(element);
  }
  for (let element = fallbackTarget; element && element !== blockElement; element = element.parentElement) {
    if (previewBindings.has(element)) return previewBindings.get(element);
  }
  return null;
}

function bindingValue(binding) {
  const { element } = binding;
  if (!binding.html) return element.textContent.replace(/\s+/g, ' ').trim();
  // Keep the shape of the original rich text: a value that is a single <p>…</p> stays a single paragraph, whether
  // the preview shows it inside that <p> or inside a wrapper such as a div.lead.
  const original = String(binding.original).trim();
  const wrapper = original.match(/^<(\w+)([^>]*)>[\s\S]*<\/\1>$/);
  const single = wrapper && (original.match(new RegExp(`<${wrapper[1]}[\\s>]`, 'g')) || []).length === 1;
  const inner = cleanInnerHtml(element);
  return single ? `<${wrapper[1]}${wrapper[2]}>${inner}</${wrapper[1]}>` : inner;
}

function setPath(target, path, value) {
  let cursor = target;
  for (const key of path.slice(0, -1)) cursor = cursor[key];
  cursor[path.at(-1)] = value;
}

function recordBinding(block, binding) {
  const value = bindingValue(binding);
  if (binding.kind === 'field') {
    if (!block.values) block.values = structuredClone(componentById.get(block.id).mockData || {});
    setPath(block.values, binding.path, value);
  } else {
    const itemEdits = (themeWorkspace.datastoreEdits[binding.datastoreId] ||= {});
    (itemEdits[binding.index] ||= {})[binding.path[0]] = value;
    binding.dirty = true;
  }
  binding.original = value;
}

// A datastore item is shared by every block that shows it. Once an edit is finished, the same sample text is updated
// in the other blocks (on every page) so the preview matches what will be imported.
function flushDatastoreEdits() {
  let refreshCanvas = false;
  for (const bindings of blockBindings) {
    for (const binding of bindings || []) {
      if (!binding.dirty) continue;
      binding.dirty = false;
      const oldText = compactText(binding.syncedText);
      binding.syncedText = binding.element.textContent;
      if (oldText === elementCompactText(binding.element)) continue;
      const inner = cleanInnerHtml(binding.element);
      for (const pageKey of themeWorkspace.pages) {
        currentThemeBlocks(pageKey).forEach((other, otherIndex) => {
          const component = componentById.get(other.id);
          if (!component || !componentDatastoreIds(component).includes(binding.datastoreId)) return;
          if (pageKey === activeThemePage && otherIndex === binding.blockIndex) return;
          // Blocks on the open page are in the canvas: update the element that shows the same item and field.
          if (pageKey === activeThemePage) {
            const peers = (blockBindings[otherIndex] || []).filter((peer) => peer.kind === 'datastore'
              && peer.datastoreId === binding.datastoreId && peer.index === binding.index && peer.path[0] === binding.path[0]);
            if (peers.length) {
              for (const peer of peers) {
                if (binding.html) peer.element.innerHTML = inner;
                else peer.element.textContent = binding.syncedText;
                peer.syncedText = peer.element.textContent;
              }
              other.html = blockHtmlForStorage($('#themePageFrame').contentDocument.querySelector(`[data-theme-block="${otherIndex}"]`));
              return;
            }
          }
          // Otherwise (other pages) look for the old sample text in the stored markup.
          const template = document.createElement('template');
          template.innerHTML = other.html;
          const matches = [...template.content.querySelectorAll('*')].filter((candidate) => elementCompactText(candidate) === oldText);
          const element = matches.find((candidate) => ![...candidate.children].some((child) => elementCompactText(child) === oldText));
          if (!element) return;
          if (binding.html) element.innerHTML = inner;
          else element.textContent = binding.syncedText;
          other.html = template.innerHTML;
          if (pageKey === activeThemePage) refreshCanvas = true;
        });
      }
    }
  }
  if (refreshCanvas) renderThemeCanvas();
}

// What gets stored for a block: its markup without the editing helpers the canvas adds.
function blockHtmlForStorage(blockElement) {
  return cleanInnerHtml(blockElement);
}

function flashThemeStatus(message) {
  $('#themeBuilderStatus').textContent = message;
  clearTimeout(themeStatusTimer);
  themeStatusTimer = setTimeout(() => { $('#themeBuilderStatus').textContent = ''; }, 2200);
}

let finishFieldEdit = null;

// Clicking a text field puts the caret in its element in the preview. Clicking a list (repeatable items or a
// datastore such as services) highlights all of its elements and turns on inline editing for the block.
function editThemeField(spec) {
  finishFieldEdit?.();
  const index = selectedThemeIndex;
  const block = currentThemeBlocks()[index];
  const doc = $('#themePageFrame').contentDocument;
  const root = doc?.querySelector(`[data-theme-block="${index}"]`);
  const bindings = blockBindings[index] || [];
  doc?.querySelectorAll('.theme-field-target').forEach((element) => element.classList.remove('theme-field-target'));
  if (!block || !root) return;
  const isField = (binding) => binding.kind === 'field';
  const single = {
    field: () => bindings.find((binding) => isField(binding) && binding.path.length === 1 && binding.path[0] === spec.k),
    child: () => bindings.find((binding) => isField(binding) && binding.path[0] === spec.k && binding.path.at(-1) === spec.c),
  }[spec.t]?.();
  const group = spec.t === 'list'
    ? bindings.filter((binding) => isField(binding) && binding.path[0] === spec.k)
    : spec.t === 'store' ? bindings.filter((binding) => binding.kind === 'datastore' && binding.datastoreId === spec.d) : [];
  if (group.length) {
    group.forEach((binding) => binding.element.classList.add('theme-field-target'));
    group[0].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!block.editing) toggleThemeEditing();
    flashThemeStatus('Click any highlighted text in the preview to edit it.');
    setTimeout(() => group.forEach((binding) => binding.element.classList.remove('theme-field-target')), 2600);
    return;
  }
  if (!single) {
    flashThemeStatus('That field is not visible in the preview.');
    return;
  }
  const target = single.element;
  target.classList.add('theme-field-target');
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.contentEditable = 'true';
  target.focus({ preventScroll: true });
  const range = doc.createRange();
  range.selectNodeContents(target);
  const selection = doc.defaultView.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    finishFieldEdit = null;
    target.removeEventListener('keydown', onKeyDown);
    target.removeEventListener('blur', finish);
    target.blur();
    target.removeAttribute('contenteditable');
    target.classList.remove('theme-field-target');
    block.html = blockHtmlForStorage(root);
    flushDatastoreEdits();
    saveThemeWorkspace('Content saved');
  };
  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      finish();
    }
  };
  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('blur', finish);
  finishFieldEdit = finish;
}

function scrollThemeCanvasToGlobal(key) {
  const doc = $('#themePageFrame').contentDocument;
  doc?.querySelector(`[data-theme-global="${key}"]`)?.scrollIntoView({ behavior: 'smooth', block: key === 'footer' ? 'end' : 'start' });
}

function syncThemeFrameSelection() {
  const doc = $('#themePageFrame').contentDocument;
  if (!doc) return;
  doc.querySelectorAll('[data-theme-block]').forEach((element, index) => {
    element.classList.toggle('is-selected', index === selectedThemeIndex);
    element.classList.toggle('is-editing', Boolean(currentThemeBlocks()[index]?.editing));
    [...element.children].forEach((child) => { child.contentEditable = currentThemeBlocks()[index]?.editing ? 'true' : 'false'; });
  });
  doc.querySelectorAll('[data-theme-insert-slot]').forEach((slot) => {
    slot.classList.toggle('is-after-selected', Number(slot.dataset.themeInsertSlot) === selectedThemeIndex);
  });
}

function bindThemeFrame() {
  const frame = $('#themePageFrame');
  const doc = frame.contentDocument;
  if (!doc) return;
  syncThemeFrameSelection();
  rebuildPreviewBindings(doc);
  doc.addEventListener('click', (event) => {
    const contextAdd = event.target.closest('[data-theme-add-category]');
    if (contextAdd) {
      event.preventDefault();
      openThemeInsertDialog(0, '', contextAdd.dataset.themeAddCategory);
      return;
    }
    const insertButton = event.target.closest('[data-theme-insert-after]');
    if (insertButton) {
      event.preventDefault();
      const afterIndex = Number(insertButton.dataset.themeInsertAfter);
      const afterBlock = currentThemeBlocks()[afterIndex];
      const afterComponent = afterBlock && componentById.get(afterBlock.id);
      openThemeInsertDialog(afterIndex + 1, afterComponent?.name || '', afterComponent?.category || pageInfo().category);
      return;
    }
    const block = event.target.closest('[data-theme-block]');
    if (!block) return;
    const index = Number(block.dataset.themeBlock);
    if (!currentThemeBlocks()[index]?.editing && event.target.closest('a,button')) event.preventDefault();
    selectedThemeIndex = index;
  renderThemeUsedList();
    renderThemeInspector();
    syncThemeFrameSelection();
  });
  doc.addEventListener('input', (event) => {
    const blockElement = event.target.closest('[data-theme-block]');
    if (!blockElement) return;
    const index = Number(blockElement.dataset.themeBlock);
    const block = currentThemeBlocks()[index];
    if (!block) return;
    block.html = blockHtmlForStorage(blockElement);
    // Text linked to a field is recorded as that field's value, so it ends up in the import.
    const binding = bindingAtCaret(doc, blockElement, event.target);
    if (binding) recordBinding(block, binding);
    saveThemeWorkspace(binding ? 'Content saved' : 'Saved in the preview only. This text is not linked to a field.');
  });
  doc.addEventListener('focusout', flushDatastoreEdits);
  resizeThemeFrame();
}

function renderThemeCanvas() {
  const frame = $('#themePageFrame');
  frame.onload = bindThemeFrame;
  frame.srcdoc = themeDocumentForPage();
}

function selectThemePage(key) {
  if (!themeWorkspace.pages.includes(key)) return;
  activeThemePage = key;
  selectedThemeIndex = -1;
  activeThemePanel = 'page';
  renderThemeBuilder();
}

function addThemeComponent(id, insertionIndex = currentThemeBlocks().length) {
  if (!componentById.has(id) || (pagesWithoutPageTitle.has(activeThemePage) && componentById.get(id).category === 'page-title')) return;
  const scrollState = ['.pg-theme-builder', '.pg-theme-library-panel', '.pg-theme-canvas-stage'].map((selector) => {
    const element = $(selector);
    return element ? [element, element.scrollTop] : null;
  }).filter(Boolean);
  const windowScroll = window.scrollY;
  const blocksInPage = currentThemeBlocks();
  const pageTitleIndex = blocksInPage.findIndex((block) => componentById.get(block.id)?.category === 'page-title');
  const safeIndex = componentById.get(id).category === 'page-title'
    ? 0
    : Math.max(pageTitleIndex >= 0 ? pageTitleIndex + 1 : 0, Math.min(insertionIndex, blocksInPage.length));
  blocksInPage.splice(safeIndex, 0, { uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, id, html: componentById.get(id).preview.html, editing: false });
  selectedThemeIndex = safeIndex;
  activeThemePanel = 'page';
  renderThemeBuilder();
  requestAnimationFrame(() => {
    window.scrollTo(0, windowScroll);
    for (const [element, top] of scrollState) element.scrollTop = top;
  });
  saveThemeWorkspace(`${componentById.get(id).name} added`);
}

// Keeps the Page Title first and keeps the moved section selected.
function reorderThemeBlock(from, to) {
  const blocksInPage = currentThemeBlocks();
  if (from < 0 || from >= blocksInPage.length) return;
  const [moved] = blocksInPage.splice(from, 1);
  blocksInPage.splice(Math.max(0, Math.min(to, blocksInPage.length)), 0, moved);
  const pageTitleIndex = blocksInPage.findIndex((block) => componentById.get(block.id)?.category === 'page-title');
  if (pageTitleIndex > 0) blocksInPage.unshift(blocksInPage.splice(pageTitleIndex, 1)[0]);
  selectedThemeIndex = blocksInPage.findIndex((block) => block.uid === moved.uid);
  renderThemeBuilder();
  saveThemeWorkspace('Order updated');
}

function duplicateThemeBlock(index) {
  const blocksInPage = currentThemeBlocks();
  const source = blocksInPage[index];
  if (!source) return;
  // The copy gets its own values, so editing one section never changes the other.
  blocksInPage.splice(index + 1, 0, { ...source, values: source.values ? structuredClone(source.values) : undefined, uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, editing: false });
  selectedThemeIndex = index + 1;
  renderThemeBuilder();
  saveThemeWorkspace('Section duplicated');
}

function swapThemeBlock(index, id) {
  const block = currentThemeBlocks()[index];
  const component = componentById.get(id);
  if (!block || !component || componentById.get(block.id)?.category !== component.category) return;
  block.id = id;
  block.html = component.preview.html;
  block.editing = false;
  // Another component has other fields, so values edited for the previous one no longer apply.
  delete block.values;
  renderThemeBuilder();
  saveThemeWorkspace('Section changed');
}

function removeThemeBlock(index) {
  const blocksInPage = currentThemeBlocks();
  if (index < 0 || index >= blocksInPage.length) return;
  blocksInPage.splice(index, 1);
  selectedThemeIndex = blocksInPage.length ? Math.min(index, blocksInPage.length - 1) : -1;
  renderThemeBuilder();
  saveThemeWorkspace('Section removed');
}

function toggleThemeEditing() {
  const block = currentThemeBlocks()[selectedThemeIndex];
  if (!block) return;
  block.editing = !block.editing;
  renderThemeInspector();
  syncThemeFrameSelection();
  if (block.editing) $('#themePageFrame').contentWindow.focus();
  else saveThemeWorkspace();
}

function startThemeBuilder() {
  if (!themeWorkspace.pages.length) return;
  activeThemePage = themeWorkspace.pages[0];
  selectedThemeIndex = -1;
  $('#themeSetup').hidden = true;
  $('#themeBuilder').hidden = false;
  renderThemeBuilder();
  requestAnimationFrame(resizeThemeFrame);
}

function choosePlaygroundMode(mode) {
  $('#modeChooser').hidden = true;
  $('#themeSetup').hidden = mode !== 'theme';
  $('#themeBuilder').hidden = true;
  $('#freePlayground').hidden = mode !== 'free';
  if (mode === 'theme') renderThemeSetup();
  else requestAnimationFrame(() => {
    resizeFrame();
    if (blocks.length) renderCanvas();
  });
}

function newBlock(id) {
  const component = componentById.get(id);
  if (!component) return null;
  return { id, html: component.preview.html, editing: false };
}

function loadPage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.blocks)) {
      pageName = typeof saved.pageName === 'string' ? saved.pageName : pageName;
      createTextExamples = Boolean(saved.createTextExamples);
      blocks = saved.blocks.filter((block) => componentById.has(block.id) && typeof block.html === 'string').map((block) => ({
        id: block.id,
        html: block.html,
        editing: false,
      }));
      const untouchedStarter = blocks.length === originalStarterIds.length && blocks.every((block, index) =>
        block.id === originalStarterIds[index] && block.html === componentById.get(block.id).preview.html,
      );
      if (untouchedStarter) blocks = [];
      selectedIndex = blocks.length ? 0 : -1;
      return;
    }
  } catch {
    // Ignore invalid saved data and start with a blank page.
  }
  blocks = [];
  selectedIndex = -1;
}

function savePage(message = 'All changes saved') {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pageName, createTextExamples, blocks: blocks.map(({ id, html }) => ({ id, html })) }));
      status.textContent = message;
    } catch {
      status.textContent = 'Could not save in this browser';
    }
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = ''; }, 1500);
  }, 120);
}

function announce(message) {
  status.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { status.textContent = ''; }, 1800);
}

function documentForPage() {
  const contents = blocks.map((block, index) => `<div class="playground-block${index === selectedIndex ? ' is-selected' : ''}" data-playground-block="${index}">${block.html}</div>`).join('\n');
  const styles = '<style>html{scroll-behavior:smooth}body{margin:0}.playground-block{display:contents}.playground-block.is-selected>*{outline:2px solid #4767ed;outline-offset:-2px}.playground-block.is-editing>*{cursor:text}.playground-block.is-editing *{cursor:text}</style>';
  const bootstrap = blocks.some((block) => componentById.get(block.id)?.bootstrapJs);
  return previewDocument({ preview: { html: `${styles}${contents}` }, bootstrapJs: bootstrap }, { bootstrap, theme: themeWorkspace.variables });
}

function getFrameHeight() {
  return Math.max(440, canvasStage.clientHeight - 38);
}

function resizeFrame() {
  if (!blocks.length || !canvasStage.clientWidth) return;
  const height = getFrameHeight();
  const scale = Math.min(1, (canvasStage.clientWidth - 38) / viewportWidth);
  frame.style.width = `${viewportWidth}px`;
  frame.style.height = `${height}px`;
  frame.style.transform = `scale(${scale})`;
  frameSizer.style.width = `${viewportWidth * scale}px`;
  frameSizer.style.height = `${height * scale}px`;
  $('#canvasDimensions').textContent = `${viewportWidth} px wide`;
  document.querySelectorAll('[data-viewport]').forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.viewport) === viewportWidth));
}

function syncFrameSelection() {
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.querySelectorAll('[data-playground-block]').forEach((element, index) => {
    element.classList.toggle('is-selected', index === selectedIndex);
    element.classList.toggle('is-editing', Boolean(blocks[index]?.editing));
    [...element.children].forEach((child) => { child.contentEditable = blocks[index]?.editing ? 'true' : 'false'; });
  });
}

function bindFrame() {
  const doc = frame.contentDocument;
  if (!doc) return;
  syncFrameSelection();
  doc.addEventListener('click', (event) => {
    const block = event.target.closest('[data-playground-block]');
    if (!block) return;
    const index = Number(block.dataset.playgroundBlock);
    if (!blocks[index]?.editing && event.target.closest('a,button')) event.preventDefault();
    setSelected(index);
  });
  doc.addEventListener('input', (event) => {
    const blockElement = event.target.closest('[data-playground-block]');
    if (!blockElement) return;
    const index = Number(blockElement.dataset.playgroundBlock);
    if (!blocks[index]) return;
    blocks[index].html = blockElement.innerHTML;
    savePage('Text updated');
  });
  resizeFrame();
}

function renderCanvas() {
  const isEmpty = blocks.length === 0;
  $('#canvasEmpty').hidden = !isEmpty;
  frameSizer.hidden = isEmpty;
  if (isEmpty) {
    frame.srcdoc = '';
    $('#canvasDimensions').textContent = '—';
    return;
  }
  frame.onload = bindFrame;
  frame.srcdoc = documentForPage();
}

function renderLayers() {
  const list = $('#pageLayers');
  if (!blocks.length) {
    list.innerHTML = '<p class="pg-no-layers">Your sections will appear here as you build.</p>';
    return;
  }
  list.innerHTML = blocks.map((block, index) => {
    const component = componentById.get(block.id);
    const active = index === selectedIndex ? ' is-active' : '';
    return `<div class="pg-layer${active}" data-layer-index="${index}"><button type="button" class="pg-layer-select" data-select-layer="${index}" aria-pressed="${index === selectedIndex}"><span class="pg-layer-grip" aria-hidden="true">⠿</span><span class="pg-layer-label"><strong>${component.name}</strong><small>${categoryLabel(component.category)}</small></span></button><div class="pg-layer-actions"><button type="button" data-move-layer="${index}" data-direction="-1" aria-label="Move ${component.name} up" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move-layer="${index}" data-direction="1" aria-label="Move ${component.name} down" ${index === blocks.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="pg-layer-delete" data-remove-layer="${index}" aria-label="Remove ${component.name}">×</button></div></div>`;
  }).join('');
}

function renderInspector() {
  const component = blocks[selectedIndex] && componentById.get(blocks[selectedIndex].id);
  $('#inspectorName').textContent = component ? component.name : 'Nothing selected';
  const content = $('#inspectorContent');
  if (!component) {
    content.innerHTML = '<div class="pg-inspector-placeholder"><span aria-hidden="true">⌖</span><p>Select a section in your canvas or layers panel to see its options.</p></div>';
    return;
  }
  const editing = blocks[selectedIndex].editing;
  content.innerHTML = `<div class="pg-selected-card"><span class="pg-selected-glyph">${component.category.slice(0, 1).toUpperCase()}</span><div><strong>${component.name}</strong><small>${component.id}</small></div></div><p class="pg-option-label">CONTENT</p><button type="button" class="pg-edit-toggle${editing ? ' is-enabled' : ''}" data-block-action="edit">${editing ? '✓  Done editing text' : '✎  Edit text in canvas'}</button><p class="pg-edit-hint">${editing ? 'Click inside the blue-outlined section and type to change its text.' : 'Text changes stay in your browser and do not change the original component.'}</p><p class="pg-option-label">ARRANGE</p><div class="pg-arrange-buttons"><button type="button" data-block-action="up" ${selectedIndex === 0 ? 'disabled' : ''}>↑ <span>Move up</span></button><button type="button" data-block-action="down" ${selectedIndex === blocks.length - 1 ? 'disabled' : ''}>↓ <span>Move down</span></button></div><div class="pg-section-actions"><button type="button" data-block-action="duplicate">⧉ <span>Duplicate section</span></button><button type="button" data-block-action="reset">↺ <span>Reset content</span></button><button type="button" class="pg-delete-action" data-block-action="delete">⌫ <span>Remove section</span></button></div>`;
}

function render() {
  $('#blockCount').textContent = `${blocks.length} section${blocks.length === 1 ? '' : 's'}`;
  $('#pageTitle').textContent = pageName;
  $('#exportMarketpath').disabled = blocks.length === 0;
  $('#createTextExamples').setAttribute('aria-pressed', String(createTextExamples));
  $('#createTextExamples').classList.toggle('is-enabled', createTextExamples);
  renderLayers();
  renderInspector();
  renderCanvas();
  savePage();
}

function setSelected(index) {
  if (index < 0 || index >= blocks.length) return;
  if (index === selectedIndex) return;
  if (selectedIndex >= 0 && blocks[selectedIndex]) blocks[selectedIndex].editing = false;
  selectedIndex = index;
  renderLayers();
  renderInspector();
  syncFrameSelection();
}

function addComponent(id) {
  const block = newBlock(id);
  if (!block) return;
  blocks.push(block);
  selectedIndex = blocks.length - 1;
  render();
  announce(`${componentById.get(id).name} added`);
}

function moveBlock(index, offset) {
  const target = index + offset;
  if (target < 0 || target >= blocks.length) return;
  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
  selectedIndex = target;
  render();
}

function removeBlock(index) {
  if (index < 0 || index >= blocks.length) return;
  blocks.splice(index, 1);
  if (!blocks.length) selectedIndex = -1;
  else if (index === selectedIndex) selectedIndex = Math.min(index, blocks.length - 1);
  else if (index < selectedIndex) selectedIndex--;
  render();
  announce('Section removed');
}

function toggleInlineEditing() {
  const block = blocks[selectedIndex];
  if (!block) return;
  block.editing = !block.editing;
  renderInspector();
  syncFrameSelection();
  if (block.editing) frame.contentWindow.focus();
  else savePage();
}

function fullHtml() {
  const bootstrap = blocks.some((block) => componentById.get(block.id)?.bootstrapJs);
  return previewDocument({ preview: { html: blocks.map((block) => block.html).join('\n') }, bootstrapJs: bootstrap }, { bootstrap });
}

function downloadMarketpathPackage() {
  try {
    const packageData = createMarketpathImport({ blocks, pageName, components, datastores, createTextExamples });
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${marketpathSlug(pageName)}-marketpath-import.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const sectionCount = packageData.Template.filter((template) => template.Type === 'partial').length;
    const datastoreCount = packageData.Datastore?.length || 0;
    const exampleCount = packageData.DatastoreItem?.length || 0;
    announce(`Downloaded ${sectionCount} section${sectionCount === 1 ? '' : 's'}${datastoreCount ? `, ${datastoreCount} datastore${datastoreCount === 1 ? '' : 's'}` : ''}${createTextExamples ? `, 1 example page and ${exampleCount} content items` : ''} for Marketpath`);
  } catch (error) {
    announce(error.message || 'Could not create the Marketpath import file');
  }
}

function filterComponents() {
  const search = $('#componentSearch').value.trim().toLowerCase();
  const category = $('#categoryFilter').value;
  let visible = 0;
  document.querySelectorAll('.pg-component-entry').forEach((entry) => {
    const matches = (category === 'all' || entry.dataset.category === category) && entry.dataset.search.includes(search);
    entry.hidden = !matches;
    if (matches) visible++;
  });
  $('#libraryEmpty').hidden = visible > 0;
}

document.addEventListener('click', async (event) => {
  const modeChoice = event.target.closest('[data-mode-choice]');
  if (modeChoice) {
    if (modeChoice.dataset.modeChoice === 'saved') openSavedTheme();
    else choosePlaygroundMode(modeChoice.dataset.modeChoice);
    return;
  }

  if (event.target.closest('[data-theme-save]')) {
    saveThemeSnapshot();
    return;
  }

  if (event.target.closest('[data-mode-back]')) {
    $('#themeSetup').hidden = true;
    $('#modeChooser').hidden = false;
    return;
  }

  const globalPicker = event.target.closest('[data-theme-global-picker]');
  if (globalPicker) {
    openThemeGlobalPicker(globalPicker.dataset.themeGlobalPicker);
    return;
  }

  const globalChoice = event.target.closest('[data-theme-global-choice]');
  if (globalChoice) {
    const key = globalChoice.dataset.themeGlobalKind;
    const component = componentById.get(globalChoice.dataset.themeGlobalChoice);
    if (component?.category === globalElementCategory(key)) {
      themeWorkspace[key] = component.id;
      if (key === 'header' || key === 'footer') themeWorkspace[`${key}Disabled`] = false;
      if (key === 'pageTitle' || key === 'cta') updateDefaultGlobalBlocks(key, component.id);
      renderThemeSetup();
      if (!$('#themeBuilder').hidden) renderThemeBuilder();
      saveThemeWorkspace(`${globalElementLabel(key, component.id)} selected`);
    }
    $('#themeGlobalDialog').close();
    return;
  }

  if (event.target.closest('[data-theme-global-close]')) {
    $('#themeGlobalDialog').close();
    return;
  }

  if (event.target.closest('[data-theme-variables-open]')) {
    renderThemeVariables();
    $('#themeVariablesDialog').showModal();
    return;
  }
  if (event.target.closest('[data-theme-variables-close]')) {
    $('#themeVariablesDialog').close();
    return;
  }

  const insertGroup = event.target.closest('[data-theme-insert-group]');
  if (insertGroup) {
    activeInsertGroup = insertGroup.dataset.themeInsertGroup;
    activeInsertCategory = 'all';
    renderThemeInsertGroups();
    renderThemeInsertCategories();
    renderThemeInsertComponents();
    return;
  }

  const insertCategory = event.target.closest('[data-theme-insert-category]');
  if (insertCategory) {
    activeInsertCategory = insertCategory.dataset.themeInsertCategory;
    renderThemeInsertCategories();
    renderThemeInsertComponents();
    return;
  }

  const insertComponent = event.target.closest('[data-theme-insert-component]');
  if (insertComponent) {
    if (insertMode === 'change') swapThemeBlock(changeBlockIndex, insertComponent.dataset.themeInsertComponent);
    else addThemeComponent(insertComponent.dataset.themeInsertComponent, pendingThemeInsertIndex);
    $('#themeInsertDialog').close();
    return;
  }

  if (event.target.closest('#themeOpenComponentTypes')) {
    openThemeInsertDialog(currentThemeBlocks().length);
    return;
  }

  if (event.target.closest('[data-theme-insert-close]')) {
    $('#themeInsertDialog').close();
    return;
  }

  if (event.target.closest('#themeContinue')) {
    startThemeBuilder();
    return;
  }

  if (event.target.closest('[data-theme-edit-pages], [data-theme-add-page]')) {
    $('#themeBuilder').hidden = true;
    $('#themeSetup').hidden = false;
    renderThemeSetup();
    return;
  }

  const themeExport = event.target.closest('[data-theme-export]');
  if (themeExport) {
    await exportThemePackage(themeExport);
    return;
  }

  const themeTab = event.target.closest('[data-theme-page-tab]');
  if (themeTab) {
    selectThemePage(themeTab.dataset.themePageTab);
    return;
  }

  const themePanel = event.target.closest('[data-theme-panel]');
  if (themePanel) {
    activeThemePanel = themePanel.dataset.themePanel;
    renderThemePanel();
    return;
  }

  if (event.target.closest('[data-theme-add-section]')) {
    openThemeInsertDialog(currentThemeBlocks().length);
    return;
  }

  if (event.target.closest('[data-theme-show-library]')) {
    activeThemePanel = 'library';
    renderThemePanel();
    $('#themeComponentSearch').focus();
    return;
  }

  const themeAdd = event.target.closest('[data-theme-add-component]');
  if (themeAdd) {
    addThemeComponent(themeAdd.dataset.themeAddComponent);
    return;
  }

  const themeSiteMenuToggle = event.target.closest('[data-theme-site-menu-toggle]');
  if (themeSiteMenuToggle) {
    const id = themeSiteMenuToggle.dataset.themeSiteMenuToggle;
    openThemeSiteMenu = openThemeSiteMenu === id ? null : id;
    renderThemeSiteList();
    return;
  }

  const themeReuse = event.target.closest('[data-theme-reuse-component]');
  if (themeReuse) {
    openThemeSiteMenu = null;
    addThemeComponent(themeReuse.dataset.themeReuseComponent);
    return;
  }

  if (event.target.closest('[data-theme-swap-toggle]') && currentThemeBlocks()[selectedThemeIndex]) {
    openThemeChangeDialog(selectedThemeIndex);
    return;
  }

  const themeEditField = event.target.closest('[data-theme-edit-field]');
  if (themeEditField && currentThemeBlocks()[selectedThemeIndex]) {
    try {
      editThemeField(JSON.parse(themeEditField.dataset.themeEditField));
    } catch {
      flashThemeStatus('That field could not be edited.');
    }
    return;
  }

  const themeGlobalScrollTarget = event.target.closest('[data-theme-global-scroll]');
  if (themeGlobalScrollTarget) {
    scrollThemeCanvasToGlobal(themeGlobalScrollTarget.dataset.themeGlobalScroll);
    return;
  }

  const themeSelect = event.target.closest('[data-theme-select-block]');
  if (themeSelect) {
    selectedThemeIndex = Number(themeSelect.dataset.themeSelectBlock);
    renderThemeUsedList();
    renderThemeInspector();
    syncThemeFrameSelection();
    scrollThemeCanvasTo(selectedThemeIndex);
    return;
  }

  const themeMenuToggle = event.target.closest('[data-theme-menu-toggle]');
  if (themeMenuToggle) {
    const index = Number(themeMenuToggle.dataset.themeMenuToggle);
    openThemeMenuIndex = openThemeMenuIndex === index ? -1 : index;
    renderThemeUsedList();
    return;
  }

  const themeMenuAction = event.target.closest('[data-theme-menu-action]');
  if (themeMenuAction) {
    const index = Number(themeMenuAction.dataset.themeMenuIndex);
    openThemeMenuIndex = -1;
    if (themeMenuAction.dataset.themeMenuAction === 'duplicate') duplicateThemeBlock(index);
    else removeThemeBlock(index);
    return;
  }

  const themeGlobalEye = event.target.closest('[data-theme-global-visibility]');
  if (themeGlobalEye) {
    const key = themeGlobalEye.dataset.themeGlobalVisibility;
    const nowHidden = !themeWorkspace[`${key}Disabled`];
    themeWorkspace[`${key}Disabled`] = nowHidden;
    renderThemeBuilder();
    saveThemeWorkspace(`${key === 'header' ? 'Header' : 'Footer'} ${nowHidden ? 'hidden' : 'shown'}`);
    return;
  }

  if ((openThemeMenuIndex >= 0 || openThemeSiteMenu) && !event.target.closest('.pg-theme-used-menu-wrap')) {
    openThemeMenuIndex = -1;
    openThemeSiteMenu = null;
    renderThemeUsedList();
    renderThemeSiteList();
  }

  const themeAction = event.target.closest('[data-theme-action]');
  if (themeAction && currentThemeBlocks()[selectedThemeIndex]) {
    const kind = themeAction.dataset.themeAction;
    if (kind === 'edit') toggleThemeEditing();
    return;
  }

  const visitPage = event.target.closest('[data-theme-visit-page]');
  if (visitPage) {
    selectThemePage(visitPage.dataset.themeVisitPage);
    return;
  }

  const themeViewport = event.target.closest('[data-theme-viewport]');
  if (themeViewport) {
    themeViewportWidth = Number(themeViewport.dataset.themeViewport);
    resizeThemeFrame();
    return;
  }

  if (event.target.closest('[data-theme-clear-page]')) {
    if (currentThemeBlocks().length && window.confirm(`Remove all components from ${pageInfo().label}?`)) {
      themeWorkspace.pageBlocks[activeThemePage] = [];
      selectedThemeIndex = -1;
      renderThemeBuilder();
      saveThemeWorkspace('Page cleared');
    }
    return;
  }

  if (event.target.closest('#themeLargePreview')) {
    previewPageKey = activeThemePage;
    renderLargePreview();
    $('#themePreviewDialog').showModal();
    return;
  }

  if (event.target.closest('[data-theme-preview-close]')) {
    $('#themePreviewDialog').close();
    return;
  }

  if (event.target.closest('#themeOpenPreview')) {
    const preview = window.open('', '_blank');
    if (preview) {
      preview.document.open();
      preview.document.write(themeDocumentForPage({ editable: false }));
      preview.document.close();
      blockPreviewNavigation(preview.document);
    }
    return;
  }

  const add = event.target.closest('[data-add-component]');
  if (add) addComponent(add.dataset.addComponent);

  const layer = event.target.closest('[data-select-layer]');
  if (layer) setSelected(Number(layer.dataset.selectLayer));

  const moveLayer = event.target.closest('[data-move-layer]');
  if (moveLayer) moveBlock(Number(moveLayer.dataset.moveLayer), Number(moveLayer.dataset.direction));

  const removeLayer = event.target.closest('[data-remove-layer]');
  if (removeLayer) removeBlock(Number(removeLayer.dataset.removeLayer));

  const action = event.target.closest('[data-block-action]');
  if (action && blocks[selectedIndex]) {
    const kind = action.dataset.blockAction;
    if (kind === 'edit') toggleInlineEditing();
    if (kind === 'up') moveBlock(selectedIndex, -1);
    if (kind === 'down') moveBlock(selectedIndex, 1);
    if (kind === 'duplicate') {
      blocks.splice(selectedIndex + 1, 0, { ...blocks[selectedIndex], editing: false });
      selectedIndex++;
      render();
    }
    if (kind === 'reset') {
      blocks[selectedIndex].html = componentById.get(blocks[selectedIndex].id).preview.html;
      blocks[selectedIndex].editing = false;
      render();
      announce('Section content reset');
    }
    if (kind === 'delete') {
      removeBlock(selectedIndex);
    }
  }

  const viewport = event.target.closest('[data-viewport]');
  if (viewport) {
    viewportWidth = Number(viewport.dataset.viewport);
    resizeFrame();
  }

  if (event.target.closest('#addSection, #addFirstSection')) {
    $('#componentSearch').focus();
    $('.pg-components-panel').scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (event.target.closest('#clearPage')) {
    if (blocks.length && window.confirm('Remove every section from this page?')) {
      blocks = [];
      selectedIndex = -1;
      render();
      announce('Canvas cleared');
    }
  }

  if (event.target.closest('#renamePage')) {
    const nextName = window.prompt('Name this page', pageName);
    if (nextName?.trim()) {
      pageName = nextName.trim().slice(0, 60);
      render();
    }
  }

  if (event.target.closest('#exportPage')) {
    $('#exportCode').value = fullHtml();
    $('#exportDialog').showModal();
  }

  if (event.target.closest('#exportMarketpath')) downloadMarketpathPackage();

  if (event.target.closest('#createTextExamples')) {
    createTextExamples = !createTextExamples;
    $('#createTextExamples').setAttribute('aria-pressed', String(createTextExamples));
    $('#createTextExamples').classList.toggle('is-enabled', createTextExamples);
    savePage();
    announce(createTextExamples ? 'Example page and datastore content will be included in the CMS JSON' : 'CMS JSON will contain templates and datastore schemas only');
  }

  if (event.target.closest('#copyExport')) {
    try {
      await navigator.clipboard.writeText($('#exportCode').value);
      announce('HTML copied to clipboard');
    } catch {
      $('#exportCode').focus();
      $('#exportCode').select();
      announce('Select the HTML and copy it');
    }
  }

  if (event.target.closest('#openPreview')) {
    const preview = window.open('', '_blank');
    if (preview) {
      preview.document.open();
      preview.document.write(fullHtml());
      preview.document.close();
    }
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'themePreviewPage') {
    goToPreviewPage(event.target.value);
    return;
  }

  const tokenInput = event.target.closest('[data-theme-token]');
  if (tokenInput) {
    themeWorkspace.variables[tokenInput.dataset.themeToken] = tokenInput.value;
    renderThemeVariables();
    renderThemeCanvas();
    if (!$('#freePlayground').hidden && blocks.length) renderCanvas();
    saveThemeWorkspace('Theme variables updated');
    return;
  }

  const assetThemeSelect = event.target.closest('#themeAssetTheme');
  if (assetThemeSelect) {
    if (exportThemes.some((theme) => theme.id === assetThemeSelect.value)) {
      themeWorkspace.assetTheme = assetThemeSelect.value;
      renderThemeCanvas();
      saveThemeWorkspace(`${exportThemes.find((theme) => theme.id === assetThemeSelect.value).name} theme selected`);
    }
    return;
  }

  const projectCountSelect = event.target.closest('#themeProjectCount');
  if (projectCountSelect) {
    themeWorkspace.projectCount = Math.max(1, Math.min(3, Number(projectCountSelect.value) || 3));
    saveThemeWorkspace(`${themeWorkspace.projectCount} projects selected`);
    return;
  }

  const siteDomainInput = event.target.closest('#themeSiteDomain');
  if (siteDomainInput) {
    themeWorkspace.siteDomain = siteDomainInput.value.trim().replace(/^(?:https?:)?\/\//i, '').split('/')[0];
    renderThemeSetup();
    saveThemeWorkspace();
    if (!$('#themeBuilder').hidden) renderThemeBuilder();
    return;
  }

  const pageToggle = event.target.closest('[data-theme-page-toggle]');
  if (pageToggle) {
    const key = pageToggle.dataset.themePageToggle;
    if (pageToggle.checked && !themeWorkspace.pages.includes(key)) themeWorkspace.pages.push(key);
    if (pageToggle.checked) ensureDefaultThemeElementsForPage(key);
    if (!pageToggle.checked) themeWorkspace.pages = themeWorkspace.pages.filter((page) => page !== key);
    renderThemeSetup();
    saveThemeWorkspace();
    return;
  }

});

$('#componentSearch').addEventListener('input', filterComponents);
$('#categoryFilter').addEventListener('change', filterComponents);
$('#themeComponentSearch').addEventListener('input', renderThemeComponentList);
$('#themeInsertSearch').addEventListener('input', renderThemeInsertComponents);

// Drag-and-drop reordering for "On this page". Listeners sit on the list because it is rebuilt on every render.
const themePageList = $('#themePageList');
let draggedThemeIndex = -1;
const clearThemeDropMarks = () => {
  themePageList.querySelectorAll('.is-drop-before, .is-drop-after, .is-dragging').forEach((element) => element.classList.remove('is-drop-before', 'is-drop-after', 'is-dragging'));
};
themePageList.addEventListener('dragstart', (event) => {
  const card = event.target.closest('.pg-theme-used-card[data-theme-index]');
  if (!card) return;
  draggedThemeIndex = Number(card.dataset.themeIndex);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', String(draggedThemeIndex));
  // Add the class on the next tick so the drag image is captured before the card scales.
  setTimeout(() => card.classList.add('is-dragging'), 0);
});
themePageList.addEventListener('dragover', (event) => {
  const card = event.target.closest('.pg-theme-used-card[data-theme-index]');
  if (draggedThemeIndex < 0 || !card) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const rect = card.getBoundingClientRect();
  const before = event.clientY < rect.top + rect.height / 2;
  themePageList.querySelectorAll('.is-drop-before, .is-drop-after').forEach((element) => element.classList.remove('is-drop-before', 'is-drop-after'));
  card.classList.add(before ? 'is-drop-before' : 'is-drop-after');
});
themePageList.addEventListener('drop', (event) => {
  const card = event.target.closest('.pg-theme-used-card[data-theme-index]');
  if (draggedThemeIndex < 0 || !card) return;
  event.preventDefault();
  const from = draggedThemeIndex;
  const targetIndex = Number(card.dataset.themeIndex);
  const insertAt = card.classList.contains('is-drop-before') ? targetIndex : targetIndex + 1;
  draggedThemeIndex = -1;
  clearThemeDropMarks();
  reorderThemeBlock(from, insertAt > from ? insertAt - 1 : insertAt);
});
themePageList.addEventListener('dragend', () => {
  draggedThemeIndex = -1;
  clearThemeDropMarks();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && (openThemeMenuIndex >= 0 || openThemeSiteMenu)) {
    openThemeMenuIndex = -1;
    openThemeSiteMenu = null;
    renderThemeUsedList();
    renderThemeSiteList();
  }
});
$('#themeInsertDialog').addEventListener('click', (event) => {
  if (event.target === $('#themeInsertDialog')) $('#themeInsertDialog').close();
});
$('#themePreviewDialog').addEventListener('click', (event) => {
  if (event.target === $('#themePreviewDialog')) $('#themePreviewDialog').close();
});
$('#themeGlobalDialog').addEventListener('click', (event) => {
  if (event.target === $('#themeGlobalDialog')) $('#themeGlobalDialog').close();
});
$('#exportDialog').addEventListener('click', (event) => {
  if (event.target === $('#exportDialog')) $('#exportDialog').close();
});
window.addEventListener('resize', resizeFrame);
window.addEventListener('resize', resizeThemeFrame);
window.addEventListener('resize', scaleThemeGlobalPreviews);
new ResizeObserver(resizeThemeFrame).observe($('#themeCanvasStage'));

// Saved theme: an explicit snapshot, separate from the autosave, that the start screen can reopen.
const SAVED_THEME_KEY = 'marketpath-saved-theme-v1';
const OPEN_BUILDER_KEY = 'marketpath-open-theme-builder';

function readSavedTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_THEME_KEY));
    return saved && typeof saved === 'object' && saved.workspace && typeof saved.workspace === 'object' ? saved : null;
  } catch {
    return null;
  }
}

function renderSavedThemeCard() {
  const saved = readSavedTheme();
  $('#savedThemeCard').disabled = !saved;
  if (!saved) {
    $('#savedThemeInfo').textContent = 'No saved theme yet. Use “Save theme” while building to keep one here.';
    return;
  }
  const { workspace } = saved;
  const pages = Array.isArray(workspace.pages) ? workspace.pages : [];
  const sections = pages.reduce((total, key) => total + (Array.isArray(workspace.pageBlocks?.[key]) ? workspace.pageBlocks[key].length : 0), 0);
  const when = new Date(saved.savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  $('#savedThemeInfo').textContent = `${workspace.name || 'Untitled theme'} · ${pages.length} pages · ${sections} sections · saved ${when}`;
}

function saveThemeSnapshot() {
  try {
    localStorage.setItem(SAVED_THEME_KEY, JSON.stringify({ savedAt: new Date().toISOString(), workspace: themeWorkspace }));
    renderSavedThemeCard();
    saveThemeWorkspace('Theme saved');
  } catch {
    $('#themeSaveState').textContent = 'Not saved';
    $('#themeBuilderStatus').textContent = 'Could not save in this browser';
  }
}

// The theme workspace is normalized once when the script loads, so opening a saved theme restores it and reloads
// straight into the builder instead of duplicating that normalization.
function openSavedTheme() {
  const saved = readSavedTheme();
  if (!saved) return;
  if (JSON.stringify(saved.workspace) !== JSON.stringify(themeWorkspace) && !window.confirm('Replace your current work with the saved theme?')) return;
  try {
    localStorage.setItem('marketpath-theme-workspace-v1', JSON.stringify(saved.workspace));
    sessionStorage.setItem(OPEN_BUILDER_KEY, '1');
    window.location.reload();
  } catch {
    $('#savedThemeInfo').textContent = 'Could not open the saved theme in this browser.';
  }
}

loadPage();
render();
renderThemeSetup();
renderSavedThemeCard();
try {
  if (sessionStorage.getItem(OPEN_BUILDER_KEY)) {
    sessionStorage.removeItem(OPEN_BUILDER_KEY);
    choosePlaygroundMode('theme');
    startThemeBuilder();
  }
} catch {
  // sessionStorage can be unavailable; the start screen still works.
}
