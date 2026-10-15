import { components } from '../data/components.js';
import { datastores } from '../data/datastores.js';
import { imagePresets, imagePresetImport } from '../data/presets.js';
import { escapeHtml, categoryLabel, previewDocument } from '../lib/utils.js';
import { footerMarkupForTheme, footerTemplateForTheme } from '../lib/footer-theme.js';
import { createServicesComponentImport, marketpathSlug } from '../lib/marketpath-export.js';

const $ = (selector) => document.querySelector(selector);
const dialog = $('#componentDialog');
const datastoreDialog = $('#datastoreDialog');
const imagePresetsDialog = $('#imagePresetsDialog');
const datastoreSelect = $('#datastoreSelect');
const search = $('#searchInput');
const grid = $('#componentGrid');
const emptyState = $('#emptyState');
const cards = [...grid.querySelectorAll('[data-component]')];
let activeFilter = 'all';
let activeComponent;
let previewWidth = 1200;
let returnFocus;
let datastoreReturnFocus;
let imagePresetsReturnFocus;
let activeDatastore;
let activeFooterTheme;

const frameObserver = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const frame = target.querySelector('iframe');
    if (frame) frame.style.transform = `scale(${target.clientWidth / 1200})`;
  }
});

const datastoreIdsFor = (component) => [...new Set([
  component.datastoreId,
  ...(component.datastoreIds || []),
  component.entityDatastoreId,
].filter(Boolean))];
grid.querySelectorAll('.card-preview').forEach((el) => frameObserver.observe(el));

document.querySelectorAll('[data-filter-group]').forEach((group) => {
  group.addEventListener('toggle', () => {
    if (!group.open) return;
    document.querySelectorAll('[data-filter-group][open]').forEach((otherGroup) => {
      if (otherGroup !== group) otherGroup.open = false;
    });
  });
});

function renderComponents() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const match = (activeFilter === 'all' || card.dataset.category === activeFilter) && card.dataset.search.includes(query);
    card.hidden = !match;
    if (match) visible++;
  }
  emptyState.hidden = visible !== 0;
  $('#componentCount').innerHTML = `<strong>${visible} component${visible === 1 ? '' : 's'}</strong> ${activeFilter === 'all' ? 'in the collection' : `in ${escapeHtml(categoryLabel(activeFilter))}`}`;
  document.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.filter === activeFilter));
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const groupCategories = group.dataset.filterGroup.split(',');
    group.open = activeFilter !== 'all' && groupCategories.includes(activeFilter);
    group.querySelector('summary').setAttribute('aria-current', String(activeFilter !== 'all' && groupCategories.includes(activeFilter)));
  });
}

function updatePreviewFrame() {
  if (!activeComponent) return;
  const frame = $('#previewFrame');
  const theme = activeComponent.theme ? activeFooterTheme : 'default';
  if (frame.dataset.component === activeComponent.id && frame.dataset.theme === theme) return;
  const previewComponent = activeComponent.theme
    ? {
        ...activeComponent,
        preview: {
          ...activeComponent.preview,
          html: footerMarkupForTheme(activeComponent, activeComponent.preview.html, theme),
        },
      }
    : activeComponent;
  frame.srcdoc = previewDocument(previewComponent);
  frame.dataset.component = activeComponent.id;
  frame.dataset.theme = theme;
}

function setFooterTheme(theme) {
  if (!activeComponent?.theme || !activeComponent.theme.classVariants.root[theme]) return;
  activeFooterTheme = theme;
  document.querySelectorAll('[data-footer-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.footerThemeChoice === theme));
  });
  $('#templateCode').textContent = footerTemplateForTheme(activeComponent, theme);
  if (window.Prism?.languages.liquid && window.Prism.languages['markup-templating']) window.Prism.highlightElement($('#templateCode'));
  if (!$('#panel-preview').hidden) updatePreviewFrame();
}

function setTab(name) {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', selected);
    tab.tabIndex = selected ? 0 : -1;
    $(`#panel-${tab.dataset.tab}`).hidden = !selected;
  });
  if (name === 'preview') requestAnimationFrame(() => {
    resizePreview();
    // Load after the panel is visible so hidden iframes receive a real viewport.
    updatePreviewFrame();
  });
}

function resizePreview() {
  const stage = $('#previewStage');
  if (!stage.clientWidth) return;
  const padding = parseFloat(getComputedStyle(stage).paddingLeft) * 2;
  const scale = Math.min(1, (stage.clientWidth - padding - 2) / previewWidth);
  const height = 650;
  const frame = $('#previewFrame');
  frame.style.width = `${previewWidth}px`;
  frame.style.height = `${height}px`;
  frame.style.transform = `scale(${scale})`;
  $('#previewSizer').style.width = `${previewWidth * scale}px`;
  $('#previewSizer').style.height = `${height * scale}px`;
  $('#previewWidth').textContent = `${previewWidth} px`;
  document.querySelectorAll('[data-width]').forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.width) === previewWidth));
}
new ResizeObserver(resizePreview).observe($('#previewStage'));

function openComponent(id, tab = 'preview') {
  activeComponent = components.find((item) => item.id === id);
  if (!activeComponent) return;
  returnFocus = document.activeElement;
  $('#dialogTitle').textContent = activeComponent.name;
  $('#dialogCategory').textContent = `${activeComponent.category.toUpperCase()} / ${activeComponent.id}`;
  $('#dialogDescription').textContent = activeComponent.description;
  $('#componentMeta').innerHTML = [['Component', activeComponent.id],['Field prefix', activeComponent.prefix],['Bootstrap', '5.3'],['Custom CSS', activeComponent.customCss ? 'Yes · inline' : 'No'],['Custom JS', activeComponent.customJs ? 'Yes' : 'No']].map(([label,value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  $('#servicePackageActions').hidden = activeComponent.category !== 'services' || activeComponent.datastoreId !== 'services';
  $('#footerThemePicker').hidden = !activeComponent.theme;
  activeFooterTheme = activeComponent.theme?.default;
  $('#templateCode').textContent = footerTemplateForTheme(activeComponent, activeFooterTheme);
  if (activeComponent.theme) setFooterTheme(activeFooterTheme);
  $('#fieldsCode').textContent = JSON.stringify(activeComponent.fields, null, 2);
  if (window.Prism?.languages.liquid && window.Prism.languages['markup-templating']) window.Prism.highlightElement($('#templateCode'));
  if (window.Prism?.languages.json) window.Prism.highlightElement($('#fieldsCode'));
  $('#notesList').innerHTML = activeComponent.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('');
  $('#tab-notes').hidden = !activeComponent.notes.length;
  $('#copyStatus').textContent = '';
  previewWidth = 1200;
  dialog.showModal();
  dialog.scrollTop = 0;
  setTab(tab);
}

function renderDatastore(id) {
  activeDatastore = datastores.find((datastore) => datastore.id === id);
  if (!activeDatastore) return;
  const users = components.filter((component) => datastoreIdsFor(component).includes(id) || component.settingsDatastoreId === id).map((component) => component.name);
  $('#datastoreDialogTitle').textContent = `${activeDatastore.name} Datastore`;
  $('#datastoreDescription').textContent = activeDatastore.description;
  $('#datastoreUsage').textContent = users.length ? `Shared by: ${users.join(', ')}` : 'No catalog components currently reference this datastore.';
  $('#datastoreGuid').textContent = activeDatastore.guidPlaceholder;
  $('#datastoreCodeTitle').textContent = `${activeDatastore.name} item fields / JSON`;
  $('#datastoreCode').textContent = JSON.stringify(activeDatastore.fields, null, 2);
  if (window.Prism?.languages.json) window.Prism.highlightElement($('#datastoreCode'));
  $('#datastoreCopyStatus').textContent = '';
}

function openDatastore(id) {
  const filteredComponent = components.find((component) => component.category === activeFilter && datastoreIdsFor(component).length);
  const filteredDatastoreId = filteredComponent && datastoreIdsFor(filteredComponent)[0];
  id ||= filteredDatastoreId || datastores[0]?.id;
  if (!id) return;
  datastoreReturnFocus = document.activeElement;
  datastoreSelect.value = id;
  renderDatastore(id);
  datastoreDialog.showModal();
}

function renderImagePresets() {
  $('#imagePresetsCount').textContent = `${imagePresets.length} unique presets found in component templates.`;
  $('#imagePresetList').innerHTML = imagePresets.map((preset) => `<article class="image-preset-row">
    <div class="image-preset-code"><strong>${escapeHtml(preset.code)}</strong><code>${escapeHtml(preset.queryString)}</code></div>
    <div><span class="image-preset-used-label">Used by</span><div class="image-preset-components">${preset.components.map((component) => `<span class="image-preset-component" title="${escapeHtml(component.id)}">${escapeHtml(component.name)}</span>`).join('')}</div></div>
  </article>`).join('');
}

function openImagePresets() {
  imagePresetsReturnFocus = document.activeElement;
  renderImagePresets();
  $('#imagePresetsStatus').textContent = '';
  imagePresetsDialog.showModal();
}

function downloadImagePresets() {
  const blob = new Blob([JSON.stringify(imagePresetImport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'marketpath-image-presets.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#imagePresetsStatus').textContent = `Downloaded ${imagePresets.length} image presets for Marketpath.`;
}

async function copyContent(kind) {
  const isDatastore = kind === 'datastore';
  const targetDialog = isDatastore ? datastoreDialog : dialog;
  const codeSelector = kind === 'template' ? '#templateCode' : isDatastore ? '#datastoreCode' : '#fieldsCode';
  const text = kind === 'template'
    ? footerTemplateForTheme(activeComponent, activeFooterTheme)
    : JSON.stringify(isDatastore ? activeDatastore.fields : activeComponent.fields, null, 2);
  const status = $(isDatastore ? '#datastoreCopyStatus' : '#copyStatus');
  status.classList.remove('is-error');
  try {
    try { await navigator.clipboard.writeText(text); }
    catch {
      // ponytail: native fallback keeps double-clicked file:// demos usable.
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('aria-label', 'Content to copy');
      input.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
      const focused = document.activeElement;
      targetDialog.append(input); input.select();
      try { if (!document.execCommand('copy')) throw new Error('Copy unavailable'); }
      finally { input.remove(); focused?.focus(); }
    }
    const label = kind === 'template' ? 'Template' : isDatastore ? 'Datastore fields' : 'Fields';
    status.textContent = `Copied ${label} to clipboard`;
  } catch {
    status.classList.add('is-error');
    status.textContent = 'Copy unavailable. Select the code and press Ctrl+C (or Cmd+C).';
    const range = document.createRange();
    range.selectNodeContents($(codeSelector));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
}

function downloadServicesPackage(createFiles) {
  if (!activeComponent || activeComponent.category !== 'services') return;
  const status = $('#copyStatus');
  status.classList.remove('is-error');
  try {
    const packageData = createServicesComponentImport({ component: activeComponent, datastores, createFiles });
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${marketpathSlug(activeComponent.id)}-${createFiles ? 'create-files' : 'empty-package'}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = createFiles
      ? 'Downloaded package with 3 example Services and a ready-to-preview page.'
      : 'Downloaded empty package with the template, Fields, and Services datastore.';
  } catch (error) {
    status.classList.add('is-error');
    status.textContent = error.message || 'Could not create the Services import package.';
  }
}

document.addEventListener('click', (event) => {
  const open = event.target.closest('[data-open]');
  if (open) openComponent(open.dataset.open, open.dataset.openTab || 'preview');
  const filter = event.target.closest('[data-filter]');
  if (filter) { activeFilter = filter.dataset.filter; renderComponents(); }
  if (event.target.closest('#resetFilters')) { search.value = ''; activeFilter = 'all'; renderComponents(); search.focus(); }
  const tab = event.target.closest('[data-tab]');
  if (tab) setTab(tab.dataset.tab);
  const footerTheme = event.target.closest('[data-footer-theme-choice]');
  if (footerTheme) setFooterTheme(footerTheme.dataset.footerThemeChoice);
  const device = event.target.closest('[data-width]');
  if (device) { previewWidth = Number(device.dataset.width); resizePreview(); }
  const copy = event.target.closest('[data-copy]');
  if (copy) copyContent(copy.dataset.copy);
  const servicePackage = event.target.closest('[data-service-package]');
  if (servicePackage) downloadServicesPackage(servicePackage.dataset.servicePackage === 'create');
});
$('#viewDatastore')?.addEventListener('click', (event) => {
  event.preventDefault();
  openDatastore();
});
$('#viewPresets')?.addEventListener('click', (event) => {
  event.preventDefault();
  openImagePresets();
});
$('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => returnFocus?.focus());
$('#closeDatastoreDialog').addEventListener('click', () => datastoreDialog.close());
datastoreDialog.addEventListener('close', () => datastoreReturnFocus?.focus());
$('#closeImagePresetsDialog').addEventListener('click', () => imagePresetsDialog.close());
imagePresetsDialog.addEventListener('close', () => imagePresetsReturnFocus?.focus());
$('#downloadImagePresets').addEventListener('click', downloadImagePresets);
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
datastoreDialog.addEventListener('click', (event) => {
  if (event.target !== datastoreDialog) return;
  const rect = datastoreDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) datastoreDialog.close();
});
imagePresetsDialog.addEventListener('click', (event) => {
  if (event.target !== imagePresetsDialog) return;
  const rect = imagePresetsDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imagePresetsDialog.close();
});
datastoreSelect.addEventListener('change', () => renderDatastore(datastoreSelect.value));
$('.detail-tabs').addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...document.querySelectorAll('[data-tab]:not([hidden])')];
  const current = tabs.indexOf(document.activeElement);
  const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[index].focus(); setTab(tabs[index].dataset.tab);
});
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !dialog.open && !datastoreDialog.open && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
});
search.addEventListener('input', renderComponents);

renderComponents();
