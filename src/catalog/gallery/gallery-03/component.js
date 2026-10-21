import { galleryFields } from '../shared-fields.js';

export default {
  id: 'gallery-03',
  name: 'Gallery Selectable Images',
  category: 'gallery',
  prefix: 'gallery_',
  sharedFieldsId: 'gallery',
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  description: 'A responsive image viewer with one large selected image and a four-column grid of selectable thumbnails.',
  tags: ['gallery', 'thumbnails', 'image viewer', 'filters'],
  template: `{%- if entity.gallery_images.is_valid -%}
<div class="gallery-selection" data-gallery-selection="gallery-03">
  <section class="py-5" aria-label="Selectable image gallery">
    <div class="container py-2">
      <div class="gallery-selection-heading">
        <div>
          <p class="gallery-selection-eyebrow">Image collection</p>
          {%- if entity.gallery_title.is_valid -%}
          <h2 class="gallery-selection-title">{{ entity.gallery_title }}</h2>
          {%- endif -%}
        </div>
        {%- if entity.gallery_filters.is_valid -%}
        <nav class="gallery-selection-filters{% if entity.gallery_filter_style.is_valid and entity.gallery_filter_style.value == 'active-outline' %} gallery-selection-filters--active-outline{% endif %}" aria-label="Filter gallery images">
          <button class="gallery-selection-filter is-active" type="button" data-gallery-selection-filter="all" aria-pressed="true">All</button>
          {%- for tag in entity.gallery_filters -%}
          <button class="gallery-selection-filter" type="button" data-gallery-selection-filter="{{ tag.title | downcase | replace: ' ', '-' | escape }}" aria-pressed="false">{{ tag.title | escape }}</button>
          {%- endfor -%}
        </nav>
        {%- endif -%}
      </div>

      <div class="gallery-selection-stage" data-gallery-selection-stage>
        {%- for image in entity.gallery_images -%}
        {%- if forloop.first -%}
        <img class="gallery-selection-main" data-gallery-selection-main src="{% image_url = image | preset:'webp' %}" alt="{{ image.alt | default: 'Gallery image' | escape }}" fetchpriority="high">
        {%- endif -%}
        {%- endfor -%}
      </div>

      <div class="gallery-selection-thumbnails" data-gallery-selection-thumbnails>
        {%- for image in entity.gallery_images -%}
        <button class="gallery-selection-thumb{% if forloop.first %} is-active{% endif %}" type="button" data-gallery-selection-thumb data-tags="{%- for tag in image.tags -%}{{ tag.title | downcase | replace: ' ', '-' | escape }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}" data-image-src="{% image_url = image | preset:'webp' %}" data-image-alt="{{ image.alt | default: 'Gallery image' | escape }}" aria-label="Show {{ image.alt | default: 'gallery image' | escape }}" aria-pressed="{% if forloop.first %}true{% else %}false{% endif %}">
          <img src="{% image_url = image | preset:'webp' %}" alt="" loading="lazy">
        </button>
        {%- endfor -%}
      </div>

      <div class="gallery-selection-empty" data-gallery-selection-empty role="status" aria-live="polite" hidden>
        <p>No images found for this filter.</p>
      </div>
    </div>
  </section>
</div>

{%- add_stylesheet inline %}
.gallery-selection {
  --gallery-selection-ink: #172b3a;
  --gallery-selection-muted: #667680;
  color: var(--gallery-selection-ink);
}

.gallery-selection-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.75rem;
}

.gallery-selection-eyebrow {
  margin: 0 0 .55rem;
  color: var(--bs-primary);
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.gallery-selection-title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 650;
  letter-spacing: -.05em;
  line-height: 1;
}

.gallery-selection-filters {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: flex-end;
  gap: .4rem;
  max-width: 100%;
  overflow-x: auto;
  padding: .25rem .1rem .4rem;
  scrollbar-width: none;
}

.gallery-selection-filters::-webkit-scrollbar { display: none; }

.gallery-selection-filter {
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: .62rem .95rem;
  background: transparent;
  color: var(--gallery-selection-muted);
  font: inherit;
  font-size: .86rem;
  font-weight: 600;
  line-height: 1;
  transition: color .2s ease, background-color .2s ease, border-color .2s ease;
}

.gallery-selection-filter:hover,
.gallery-selection-filter:focus-visible { color: var(--bs-primary); }

.gallery-selection-filter:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.gallery-selection-filter.is-active { background: var(--bs-primary); color: #fff; }

.gallery-selection-filters--active-outline .gallery-selection-filter,
.gallery-selection-filters--active-outline .gallery-selection-filter.is-active {
  border-color: transparent;
  background: transparent;
  color: var(--bs-primary);
}

.gallery-selection-filters--active-outline .gallery-selection-filter.is-active {
  border-color: var(--bs-primary);
}

.gallery-selection-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  margin-bottom: 1rem;
  overflow: hidden;
  background: #eef1f2;
}

.gallery-selection-main {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.gallery-selection-thumbnails {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.gallery-selection-thumb {
  display: block;
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: .25rem;
  border: 1px solid #e3e3e3;
  background: #fff;
  cursor: pointer;
  transition: border-color .2s ease, transform .2s ease;
}

.gallery-selection-thumb[hidden] { display: none !important; }

.gallery-selection-thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.gallery-selection-thumb.is-active {
  border-color: var(--bs-primary);
}

.gallery-selection-thumb:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.gallery-selection-thumb:hover { transform: translateY(-2px); }

.gallery-selection-empty {
  padding: 3rem 1rem;
  color: var(--gallery-selection-muted);
  text-align: center;
}

.gallery-selection-empty p { margin: 0; }

@media (max-width: 767.98px) {
  .gallery-selection-heading { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .gallery-selection-filters { justify-content: flex-start; width: 100%; }
  .gallery-selection-thumbnails { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
  .gallery-selection-stage { aspect-ratio: 4 / 3; }
}

@media (max-width: 479.98px) {
  .gallery-selection-thumbnails { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-selection-filter,
  .gallery-selection-thumb { transition: none; }
}
{% end_stylesheet %}

{%- add_javascript inline position:'body' -%}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-gallery-selection="gallery-03"]').forEach(function(root) {
    if (root.dataset.gallerySelectionReady === 'true') return;
    root.dataset.gallerySelectionReady = 'true';

    const filters = Array.from(root.querySelectorAll('[data-gallery-selection-filter]'));
    const thumbnails = Array.from(root.querySelectorAll('[data-gallery-selection-thumb]'));
    const mainImage = root.querySelector('[data-gallery-selection-main]');
    const imageStage = root.querySelector('[data-gallery-selection-stage]');
    const emptyState = root.querySelector('[data-gallery-selection-empty]');

    function selectImage(button) {
      if (!button || !mainImage) return;
      mainImage.src = button.getAttribute('data-image-src') || '';
      mainImage.alt = button.getAttribute('data-image-alt') || 'Gallery image';
      thumbnails.forEach(function(thumb) {
        const isActive = thumb === button;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-pressed', String(isActive));
      });
    }

    function applyFilter(filterValue) {
      const visibleThumbnails = [];

      thumbnails.forEach(function(thumb) {
        const tags = (thumb.getAttribute('data-tags') || '').split(',').filter(Boolean);
        const isVisible = filterValue === 'all' || tags.includes(filterValue);
        thumb.hidden = !isVisible;
        if (isVisible) visibleThumbnails.push(thumb);
      });

      const activeThumb = thumbnails.find(function(thumb) { return thumb.classList.contains('is-active'); });
      if (activeThumb && activeThumb.hidden && visibleThumbnails.length) {
        selectImage(visibleThumbnails[0]);
      }

      filters.forEach(function(button) {
        const isActive = button.getAttribute('data-gallery-selection-filter') === filterValue;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (imageStage) imageStage.hidden = visibleThumbnails.length === 0;
      if (emptyState) emptyState.hidden = visibleThumbnails.length > 0;
    }

    thumbnails.forEach(function(button) {
      button.addEventListener('click', function() { selectImage(button); });
    });

    filters.forEach(function(button) {
      button.addEventListener('click', function() {
        applyFilter(button.getAttribute('data-gallery-selection-filter'));
      });
    });
  });
});
{%- end_javascript -%}
{%- endif -%}`,
  fields: galleryFields,
  notes: [
    'Uses the same Gallery Page Custom Fields as Gallery 01 and Gallery 02.',
    'Choose images with descriptive alt text; the main image keeps a steady 16:9 frame on desktop and 4:3 on mobile, with a consistent thumbnail crop.',
    'Add tags to images that match the Filter Tags list to enable the category filters.',
    'Thumbnail buttons update the large image above and wrap into additional rows after every four cards on desktop.',
    'The selection and filter interactions use inline CSS and JavaScript; Bootstrap JavaScript is not required.',
  ],
  preview: {
    html: `<div class="gallery-selection-preview">
  <style>
    .gallery-selection-preview{color:#172b3a}.gallery-selection-preview-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.25rem}.gallery-selection-preview-kicker{margin:0 0 .5rem;color:#315b79;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.gallery-selection-preview-title{margin:0;font-size:clamp(2rem,5vw,3.3rem);font-weight:650;letter-spacing:-.05em;line-height:1}.gallery-selection-preview-filters{display:flex;gap:.4rem;overflow:auto}.gallery-selection-preview-filter{flex:none;border:1px solid transparent;border-radius:999px;padding:.55rem .9rem;background:transparent;color:#667680;font-weight:600}.gallery-selection-preview-filter.active{border-color:#315b79;background:#315b79;color:#fff}.gallery-selection-preview-grid{display:flex;flex-wrap:wrap;gap:.8rem}.gallery-selection-preview-radio{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.gallery-selection-preview-thumb{display:block;flex:0 0 calc((100% - 2.4rem)/4);order:2;margin:0;padding:.2rem;border:1px solid #e3e3e3;background:#fff;cursor:pointer}.gallery-selection-preview-thumb img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.gallery-selection-preview-main{display:none;flex:0 0 100%;order:1;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;object-position:center}.gallery-selection-preview-radio:checked+.gallery-selection-preview-thumb{border-color:#315b79}.gallery-selection-preview-radio:checked+.gallery-selection-preview-thumb+.gallery-selection-preview-main{display:block}@media(max-width:767px){.gallery-selection-preview-head{align-items:flex-start;flex-direction:column}.gallery-selection-preview-grid{gap:.6rem}.gallery-selection-preview-thumb{flex-basis:calc((100% - 1.2rem)/3)}.gallery-selection-preview-main{aspect-ratio:4/3}}@media(max-width:479px){.gallery-selection-preview-grid{gap:.5rem}.gallery-selection-preview-thumb{flex-basis:calc((100% - .5rem)/2)}}
  </style>
  <section class="py-5" aria-label="Selectable image gallery">
    <div class="container py-2">
      <div class="gallery-selection-preview-head"><div><p class="gallery-selection-preview-kicker">Image collection</p><h2 class="gallery-selection-preview-title">Spaces &amp; details</h2></div><nav class="gallery-selection-preview-filters" aria-label="Filter gallery images"><button class="gallery-selection-preview-filter" type="button" aria-pressed="false">All</button><button class="gallery-selection-preview-filter active" type="button" aria-pressed="true">Interior</button><button class="gallery-selection-preview-filter" type="button" aria-pressed="false">Exterior</button></nav></div>
      <div class="gallery-selection-preview-grid">
        <input class="gallery-selection-preview-radio" type="radio" name="gallery03-preview" id="gallery03-preview-1" checked>
        <label class="gallery-selection-preview-thumb" for="gallery03-preview-1" aria-label="Show bright living room"><img src="sample-image:modern" alt=""></label>
        <img class="gallery-selection-preview-main" src="sample-image:modern" alt="Bright living room">
        <input class="gallery-selection-preview-radio" type="radio" name="gallery03-preview" id="gallery03-preview-2">
        <label class="gallery-selection-preview-thumb" for="gallery03-preview-2" aria-label="Show outdoor gathering space"><img src="sample-image:exterior" alt=""></label>
        <img class="gallery-selection-preview-main" src="sample-image:exterior" alt="Outdoor gathering space">
        <input class="gallery-selection-preview-radio" type="radio" name="gallery03-preview" id="gallery03-preview-3">
        <label class="gallery-selection-preview-thumb" for="gallery03-preview-3" aria-label="Show warm interior detail"><img src="sample-image:home" alt=""></label>
        <img class="gallery-selection-preview-main" src="sample-image:home" alt="Warm interior detail">
        <input class="gallery-selection-preview-radio" type="radio" name="gallery03-preview" id="gallery03-preview-4">
        <label class="gallery-selection-preview-thumb" for="gallery03-preview-4" aria-label="Show quiet architectural detail"><img src="sample-image:modern" alt=""></label>
        <img class="gallery-selection-preview-main" src="sample-image:modern" alt="Quiet architectural detail">
      </div>
    </div>
  </section>
</div>`,
  },
  mockData: {
    filter_tags: ['Interior', 'Exterior'],
    filter_style: 'active-outline',
    title: 'Spaces & details',
    images: [
      { path: '', alt: 'Bright living room', tags: ['Interior'] },
      { path: '', alt: 'Outdoor gathering space', tags: ['Exterior'] },
      { path: '', alt: 'Warm interior detail', tags: ['Interior'] },
      { path: '', alt: 'Quiet architectural detail', tags: ['Exterior'] },
    ],
  },
};
