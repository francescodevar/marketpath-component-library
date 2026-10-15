import { components } from '../data/components.js';
import { datastores } from '../data/datastores.js';
import { categoryLabel, previewDocument } from '../lib/utils.js';
import { createMarketpathImport, marketpathSlug } from '../lib/marketpath-export.js';

const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = 'marketpath-playground-v1';
const frame = $('#pageFrame');
const frameSizer = $('#frameSizer');
const canvasStage = $('#canvasStage');
const status = $('#playgroundStatus');
const componentById = new Map(components.map((component) => [component.id, component]));
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
  return previewDocument({ preview: { html: `${styles}${contents}` }, bootstrapJs: bootstrap }, { bootstrap });
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

$('#componentSearch').addEventListener('input', filterComponents);
$('#categoryFilter').addEventListener('change', filterComponents);
$('#exportDialog').addEventListener('click', (event) => {
  if (event.target === $('#exportDialog')) $('#exportDialog').close();
});
window.addEventListener('resize', resizeFrame);

loadPage();
render();
