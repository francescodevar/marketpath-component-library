// Run: node tests/theme-edits.mjs — edits made in the Playground must reach the theme import.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const srcRoot = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'src');
const findFiles = (directory, name) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const entryPath = path.join(directory, entry.name);
  if (entry.isDirectory()) return findFiles(entryPath, name);
  return entry.name === name ? [entryPath] : [];
});
const load = (files) => Promise.all(files.map(async (file) => (await import(pathToFileURL(file).href)).default));
const components = await load(findFiles(path.join(srcRoot, 'catalog'), 'component.js'));
const datastores = await load(findFiles(path.join(srcRoot, 'datastores'), 'datastore.js'));
const { createThemeMarketpathImport } = await import(pathToFileURL(path.join(srcRoot, 'lib/marketpath-export.js')).href);

const hero = components.find((component) => component.id === 'hero-03');
const build = ({ values, datastoreEdits } = {}) => JSON.stringify(createThemeMarketpathImport({
  pages: [{ key: 'home', label: 'Home', blocks: [{ id: 'hero-03', ...(values ? { values } : {}) }, { id: 'services-01' }] }],
  headerId: 'header-01',
  footerId: 'footer-01',
  components,
  datastores,
  siteDomain: 'example.com',
  ...(datastoreEdits ? { datastoreEdits } : {}),
}));

const baseline = build();
assert(baseline.includes(hero.mockData.title), 'baseline export uses the component mockData');
assert(!baseline.includes('Edited headline') && !baseline.includes('Edited service title'));

const edited = build({
  values: { ...hero.mockData, title: 'Edited headline' },
  datastoreEdits: { services: { 0: { Title: 'Edited service title', Name: 'Renamed identity', not_a_schema_field: 'Should not appear' } } },
});
assert(edited.includes('Edited headline'), 'block values replace mockData in the page fields');
assert(!edited.includes(hero.mockData.title), 'the original sample title is gone from that block');
assert(edited.includes('Edited service title'), 'datastore edits change the sample datastore item');
assert(!edited.includes('Renamed identity'), 'the item Name is never edited');
assert(!edited.includes('Should not appear'), 'edits for keys the sample item does not have are ignored');
assert(edited.includes('Example Service 1'), 'the item Name keeps its original value');

console.log('PASS: block values and datastore edits reach the theme import; item identity is preserved.');
