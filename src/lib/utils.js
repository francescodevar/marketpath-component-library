import sampleImages from './sample-images.js';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

export const categoryLabel = (value) => ({ services: 'Main Services', projects: 'Main Projects', cta: 'CTA', faq: 'FAQs', 'page-title': 'Page Title', 'inside-services': 'Inside Services', 'inside-projects': 'Inside Projects', 'thank-you': 'Thank You', 'error-404': 'Error 404' }[value] || value[0].toUpperCase() + value.slice(1));

export const categoryGroups = [
  { id: 'services', label: 'Services', categories: ['services', 'inside-services'] },
  { id: 'projects', label: 'Projects', categories: ['projects', 'inside-projects'] },
  { id: 'page-sections', label: 'Specific Section', categories: ['blog', 'faq', 'gallery', 'contact', 'testimonials', 'team', 'thank-you', 'error-404'] },
  { id: 'content', label: 'Content', categories: ['hero', 'banner', 'content'] },
  { id: 'layout', label: 'Layout', categories: ['header', 'page-title', 'cta', 'footer'] },
];

export const categoryGroupsFor = (categories) => categoryGroups
  .map((group) => ({ ...group, categories: group.categories.filter((category) => categories.includes(category)) }))
  .filter((group) => group.categories.length > 0);

const hexToRgb = (hex) => {
  const digits = hex.replace('#', '');
  const full = digits.length === 3 ? [...digits].map((char) => char + char).join('') : digits;
  return [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16));
};
const rgbToHex = (rgb) => `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
const mixHex = (hex, target, weight) => {
  const from = hexToRgb(hex);
  const to = hexToRgb(target);
  return rgbToHex(from.map((value, index) => value + (to[index] - value) * weight));
};
const shadeHex = (hex, weight) => mixHex(hex, '#000000', weight);
const tintHex = (hex, weight) => mixHex(hex, '#ffffff', weight);
const contrastHex = (hex) => {
  const [red, green, blue] = hexToRgb(hex);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#000000' : '#ffffff';
};

// ponytail: theme colors become Bootstrap CSS variables, so authored HTML still has no hardcoded brand values.
const themeColorRules = (name, hex) => {
  const rgb = hexToRgb(hex).join(',');
  const hover = shadeHex(hex, 0.12);
  const active = shadeHex(hex, 0.22);
  const border = shadeHex(hex, 0.26);
  const text = contrastHex(hex);
  return `:root{--bs-${name}:${hex};--bs-${name}-rgb:${rgb}}.btn-${name}{--bs-btn-color:${text};--bs-btn-bg:${hex};--bs-btn-border-color:${hex};--bs-btn-hover-color:${text};--bs-btn-hover-bg:${hover};--bs-btn-hover-border-color:${border};--bs-btn-active-color:${text};--bs-btn-active-bg:${active};--bs-btn-active-border-color:${border};--bs-btn-disabled-color:${text};--bs-btn-disabled-bg:${hex};--bs-btn-disabled-border-color:${hex};--bs-btn-focus-shadow-rgb:${rgb}}.btn-outline-${name}{--bs-btn-color:${hex};--bs-btn-border-color:${hex};--bs-btn-hover-color:${text};--bs-btn-hover-bg:${hex};--bs-btn-hover-border-color:${hex};--bs-btn-active-color:${text};--bs-btn-active-bg:${hex};--bs-btn-active-border-color:${hex};--bs-btn-disabled-color:${hex};--bs-btn-disabled-border-color:${hex};--bs-btn-focus-shadow-rgb:${rgb}}`;
};

// ponytail: the gallery keeps the orange brand default; the Playground passes its own theme variables.
export const galleryThemeVariables = { primary: '#c6530c' };

export function themeStyleSheet({ primary, secondary, dark, light, white, fontFamily } = galleryThemeVariables) {
  const rules = [];
  if (primary) {
    const rgb = hexToRgb(primary).join(',');
    rules.push(`:root{--bs-primary:${primary};--bs-primary-rgb:${rgb};--bs-link-color:${primary};--bs-link-color-rgb:${rgb};--bs-link-hover-color:${shadeHex(primary, 0.12)};--bs-link-hover-color-rgb:${hexToRgb(shadeHex(primary, 0.12)).join(',')};--bs-primary-bg-subtle:${tintHex(primary, 0.9)};--bs-primary-border-subtle:${tintHex(primary, 0.7)};--bs-primary-text-emphasis:${shadeHex(primary, 0.45)}}`);
    rules.push(themeColorRules('primary', primary).replace(/^:root\{[^}]*\}/, ''));
  }
  if (secondary) rules.push(themeColorRules('secondary', secondary));
  if (dark) rules.push(themeColorRules('dark', dark));
  if (light) rules.push(themeColorRules('light', light));
  if (white) rules.push(`:root{--bs-white:${white};--bs-white-rgb:${hexToRgb(white).join(',')}}`);
  if (fontFamily && /^[A-Za-z0-9 ]+$/.test(fontFamily)) rules.push(`:root{--bs-font-sans-serif:"${fontFamily}", system-ui, -apple-system, "Segoe UI", sans-serif}`);
  rules.push('.text-small{font-size:.75rem}');
  return rules.join('');
}

const googleFontLink = (fontFamily) => (fontFamily && /^[A-Za-z0-9 ]+$/.test(fontFamily)
  ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fontFamily.replaceAll(' ', '+')}:ital,wght@0,100..900;1,100..900&display=swap">`
  : '');

// ponytail: previews are authored HTML, never parsed or executed Liquid.
export function previewDocument(component, { bootstrap = component.bootstrapJs, images = sampleImages, allowSameOriginImages = false, theme = galleryThemeVariables } = {}) {
  const html = component.preview.html.replace(/sample-image:(exterior|home|modern|team-female|team-male)/g, (_, name) => images[name] || sampleImages[name]);
  const imageSources = allowSameOriginImages ? "'self' data:" : 'data:';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src https://cdn.jsdelivr.net https://fonts.googleapis.com 'unsafe-inline'; font-src https://cdn.jsdelivr.net https://fonts.gstatic.com data:; img-src ${imageSources}; script-src https://cdn.jsdelivr.net; base-uri 'none'; form-action 'none'"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">${googleFontLink(theme.fontFamily)}<style>${themeStyleSheet(theme)}</style></head><body>${html}${bootstrap ? '<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>' : ""}</body></html>`;
}
