import assert from 'node:assert/strict';
import { createThemeMarketpathImport } from '../src/lib/marketpath-export.js';
import header01 from '../src/catalog/header/header-01/component.js';
import header02 from '../src/catalog/header/header-02/component.js';
import footer from '../src/catalog/footer/footer-01/component.js';
import settings from '../src/datastores/page-settings/datastore.js';

const stylesheet = '{%- add_stylesheet "/main.scss" -%}';
const bootstrap = '{%- add_javascript "/bootstrap5/js/bootstrap.bundle.min.js" defer:true async:true position:\'body\' -%}';
for (const header of [header01, header02]) {
  const result = createThemeMarketpathImport({
    pages: [{ key: 'home', label: 'Home', blocks: [] }],
    headerId: header.id,
    footerId: footer.id,
    components: [header, footer],
    datastores: [settings],
    siteDomain: 'example.com',
  });
  for (const markup of [header.template, result.Template.find((template) => template.Name === '/_header.liquid').Markup]) {
    assert.equal(markup.split(stylesheet).length - 1, 1);
    assert.equal(markup.split(bootstrap).length - 1, 1);
    assert(!markup.includes('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'));
  }
}
console.log('PASS: Both header variants and Playground exports preserve the required Marketpath stylesheet and Bootstrap tags once.');
