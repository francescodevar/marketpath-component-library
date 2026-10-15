export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

export const categoryLabel = (value) => ({ cta: 'CTA', faq: 'FAQs', 'page-title': 'Page Title', 'inside-services': 'Inside Services', 'inside-projects': 'Inside Projects', 'thank-you': 'Thank You', 'error-404': 'Error 404' }[value] || value[0].toUpperCase() + value.slice(1));

export const categoryGroups = [
  { id: 'services', label: 'Services', categories: ['services', 'inside-services'] },
  { id: 'projects', label: 'Projects', categories: ['projects', 'inside-projects'] },
  { id: 'layout', label: 'Layout', categories: ['hero', 'header', 'footer', 'banner', 'page-title', 'cta', 'thank-you', 'error-404'] },
  { id: 'resources', label: 'Resources', categories: ['blog', 'faq', 'gallery'] },
  { id: 'content', label: 'Content', categories: ['content', 'contact', 'testimonials', 'team'] },
];

export const categoryGroupsFor = (categories) => categoryGroups
  .map((group) => ({ ...group, categories: group.categories.filter((category) => categories.includes(category)) }))
  .filter((group) => group.categories.length > 0);

// ponytail: previews are authored HTML, never parsed or executed Liquid.
export function previewDocument(component, { bootstrap = component.bootstrapJs } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src https://cdn.jsdelivr.net 'unsafe-inline'; font-src https://cdn.jsdelivr.net data:; img-src data:; script-src https://cdn.jsdelivr.net; base-uri 'none'; form-action 'none'"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><style>.text-small{font-size:.75rem}</style></head><body>${component.preview.html}${bootstrap ? '<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>' : ""}</body></html>`;
}
