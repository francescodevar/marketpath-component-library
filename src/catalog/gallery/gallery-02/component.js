import { galleryFields } from '../shared-fields.js';

export default {
  id: 'gallery-02',
  name: 'Gallery Masonry Project Grid',
  category: 'gallery',
  prefix: 'gallery_',
  sharedFieldsId: 'gallery',
  customCss: true,
  customJs: true,
  bootstrapJs: true,
  description: 'An editorial masonry gallery with responsive tag filters and a fullscreen image viewer.',
  tags: ['gallery', 'masonry', 'editorial', 'filters', 'images'],
  template: `{%- if entity.gallery_images.is_valid -%}
<div class="gallery-modern" data-gallery-modern-component="gallery-02">
  <section class="py-5" aria-label="Project gallery">
    <div class="container py-2">
      <div class="gallery-modern-heading">
        <div>
          <p class="gallery-modern-eyebrow">A closer look</p>
          {%- if entity.gallery_title.is_valid -%}
          <h2 class="gallery-modern-title">{{ entity.gallery_title }}</h2>
          {%- endif -%}
        </div>
        {%- if entity.gallery_filters.is_valid -%}
        <nav class="gallery-modern-filter-bar{% if entity.gallery_filter_style.is_valid and entity.gallery_filter_style.value == 'active-outline' %} gallery-modern-filter-bar--active-outline{% endif %}" aria-label="Filter gallery images">
          <button class="gallery-modern-filter is-active" type="button" data-gallery-filter="all" aria-pressed="true">All</button>
          {%- for tag in entity.gallery_filters -%}
          <button class="gallery-modern-filter" type="button" data-gallery-filter="{{ tag.title | downcase | replace: ' ', '-' | escape }}" aria-pressed="false">{{ tag.title | escape }}</button>
          {%- endfor -%}
        </nav>
        {%- endif -%}
      </div>

      <div class="gallery-modern-grid" data-gallery-grid>
        {%- for image in entity.gallery_images -%}
        <button class="gallery-modern-item" type="button" data-gallery-item data-tags="{%- for tag in image.tags -%}{{ tag.title | downcase | replace: ' ', '-' | escape }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}" data-image-src="{% image_url = image | preset:'webp' %}" data-image-alt="{{ image.alt | default: 'Gallery image' | escape }}" aria-label="Open {{ image.alt | default: 'Gallery image' | escape }} in image viewer">
          <img src="{% image_url = image | preset:'webp' %}" alt="{{ image.alt | default: 'Gallery image' | escape }}" loading="lazy">
          <span class="gallery-modern-open-icon" aria-hidden="true">↗</span>
        </button>
        {%- endfor -%}
      </div>

      <div class="gallery-modern-empty d-none" data-gallery-empty role="status" aria-live="polite">
        <p>No images found for this filter.</p>
      </div>
    </div>
  </section>

  <div class="modal fade gallery-modern-modal" data-gallery-modal role="dialog" tabindex="-1" aria-hidden="true" aria-label="Gallery image viewer">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header border-0 position-absolute top-0 end-0 z-3">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close image viewer"></button>
        </div>
        <div class="modal-body p-0 d-flex align-items-center justify-content-center">
          <div class="carousel slide h-100 w-100" data-gallery-carousel aria-label="Gallery images">
            <div class="carousel-inner h-100" data-gallery-carousel-inner></div>
            <button class="carousel-control-prev" type="button" data-gallery-previous aria-label="Previous image">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-gallery-next aria-label="Next image">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{%- add_stylesheet inline %}
.gallery-modern {
  --gallery-ink: #172b3a;
  --gallery-muted: #63727d;
  --gallery-surface: #f2f4f3;
  color: var(--gallery-ink);
}

.gallery-modern-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.gallery-modern-eyebrow {
  margin: 0 0 .65rem;
  color: var(--bs-primary);
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.gallery-modern-title {
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2rem, 4.8vw, 4rem);
  font-weight: 650;
  letter-spacing: -.055em;
  line-height: .98;
}

.gallery-modern-filter-bar {
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

.gallery-modern-filter-bar::-webkit-scrollbar { display: none; }

.gallery-modern-filter {
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: .65rem 1rem;
  background: transparent;
  color: var(--gallery-muted);
  font: inherit;
  font-size: .86rem;
  font-weight: 600;
  line-height: 1;
  transition: color .2s ease, background-color .2s ease, border-color .2s ease;
}

.gallery-modern-filter:hover,
.gallery-modern-filter:focus-visible {
  border-color: rgba(var(--bs-primary-rgb), .25);
  color: var(--bs-primary);
}

.gallery-modern-filter:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.gallery-modern-filter.is-active {
  background: var(--bs-primary);
  color: #fff;
}

.gallery-modern-filter-bar--active-outline .gallery-modern-filter,
.gallery-modern-filter-bar--active-outline .gallery-modern-filter.is-active {
  border-color: transparent;
  background: transparent;
  color: var(--bs-primary);
}

.gallery-modern-filter-bar--active-outline .gallery-modern-filter.is-active {
  border-color: var(--bs-primary);
}

.gallery-modern-grid {
  columns: 4 16rem;
  column-gap: 1rem;
}

.gallery-modern-item {
  position: relative;
  display: block;
  width: 100%;
  margin: 0 0 1rem;
  padding: 0;
  border: 0;
  break-inside: avoid;
  overflow: hidden;
  background: var(--gallery-surface);
  color: inherit;
  cursor: zoom-in;
  text-align: left;
  -webkit-appearance: none;
  appearance: none;
  isolation: isolate;
}

.gallery-modern-item img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform .65s cubic-bezier(.2, .7, .2, 1);
}

.gallery-modern-item:hover img,
.gallery-modern-item:focus-visible img { transform: scale(1.045); }

.gallery-modern-item:focus-visible {
  outline: 3px solid var(--bs-primary);
  outline-offset: 3px;
}

.gallery-modern-open-icon {
  position: absolute;
  z-index: 1;
  right: 1rem;
  bottom: 1rem;
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .85);
  border-radius: 50%;
  background: rgba(15, 27, 36, .38);
  color: #fff;
  font-size: 1.15rem;
  opacity: 0;
  transform: translateY(4px);
  transition: color .2s ease, background-color .2s ease, opacity .2s ease, transform .2s ease;
}

.gallery-modern-item:hover .gallery-modern-open-icon,
.gallery-modern-item:focus-visible .gallery-modern-open-icon {
  opacity: 1;
  transform: translateY(0);
}

.gallery-modern-open-icon:hover {
  background: #fff;
  color: var(--gallery-ink);
}

.gallery-modern-modal {
  z-index: 10050;
}

.gallery-modern-modal .modal-content { background: rgba(0, 0, 0, .94); }

.gallery-modern-modal .gallery-modal-image {
  width: auto;
  height: auto;
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.gallery-modern-modal .carousel-control-prev,
.gallery-modern-modal .carousel-control-next {
  top: 50%;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, .16);
  opacity: .85;
  transform: translateY(-50%);
}

.gallery-modern-modal .carousel-control-prev { left: 1.5rem; }
.gallery-modern-modal .carousel-control-next { right: 1.5rem; }
.gallery-modern-modal .carousel-control-prev:hover,
.gallery-modern-modal .carousel-control-next:hover { background: rgba(255, 255, 255, .28); opacity: 1; }

.gallery-modern-item.is-filtered { display: none; }

.gallery-modern-item.is-entering { animation: galleryModernReveal .38s ease both; }

.gallery-modern-empty {
  padding: 4rem 1rem;
  color: var(--gallery-muted);
  text-align: center;
}

.gallery-modern-empty p { margin: 0; }

@keyframes galleryModernReveal {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 767.98px) {
  .gallery-modern-heading { align-items: flex-start; flex-direction: column; gap: 1.25rem; }
  .gallery-modern-filter-bar { justify-content: flex-start; width: 100%; }
}

@media (max-width: 575.98px) {
  .gallery-modern-grid { columns: 2 10rem; column-gap: .7rem; }
  .gallery-modern-item { margin-bottom: .7rem; }
  .gallery-modern-open-icon { right: .7rem; bottom: .7rem; width: 2rem; height: 2rem; opacity: 1; transform: none; }
  .gallery-modern-modal .carousel-control-prev { left: .75rem; }
  .gallery-modern-modal .carousel-control-next { right: .75rem; }
  .gallery-modern-modal .carousel-control-prev,
  .gallery-modern-modal .carousel-control-next { width: 2.8rem; height: 2.8rem; }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-modern-item img,
  .gallery-modern-filter,
  .gallery-modern-open-icon,
  .gallery-modern-modal .carousel-control-prev,
  .gallery-modern-modal .carousel-control-next { transition: none; }
  .gallery-modern-item.is-entering { animation: none; }
}
{% end_stylesheet %}

{%- add_javascript inline position:'body' -%}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-gallery-modern-component="gallery-02"]').forEach(function(root) {
    if (root.dataset.galleryModernReady === 'true') return;
    root.dataset.galleryModernReady = 'true';

    const filters = Array.from(root.querySelectorAll('[data-gallery-filter]'));
    const items = Array.from(root.querySelectorAll('[data-gallery-item]'));
    const emptyState = root.querySelector('[data-gallery-empty]');
    const galleryModal = root.querySelector('[data-gallery-modal]');
    const carouselElement = root.querySelector('[data-gallery-carousel]');
    const carouselInner = root.querySelector('[data-gallery-carousel-inner]');
    const previousButton = root.querySelector('[data-gallery-previous]');
    const nextButton = root.querySelector('[data-gallery-next]');
    let carouselInstance = null;

    function applyFilter(filterValue) {
      let visibleCount = 0;

      items.forEach(function(item) {
        const tags = (item.getAttribute('data-tags') || '').split(',').filter(Boolean);
        const isVisible = filterValue === 'all' || tags.includes(filterValue);
        item.classList.toggle('is-filtered', !isVisible);

        if (isVisible) {
          item.classList.remove('is-entering');
          void item.offsetWidth;
          item.classList.add('is-entering');
          window.setTimeout(function() { item.classList.remove('is-entering'); }, 400);
          visibleCount += 1;
        }
      });

      filters.forEach(function(button) {
        const isActive = button.getAttribute('data-gallery-filter') === filterValue;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (emptyState) emptyState.classList.toggle('d-none', visibleCount > 0);
    }

    filters.forEach(function(button) {
      button.addEventListener('click', function() {
        applyFilter(button.getAttribute('data-gallery-filter'));
      });
    });

    function openLightbox(clickedItem) {
      if (!window.bootstrap || !galleryModal || !carouselElement || !carouselInner) return;

      const visibleItems = items.filter(function(item) { return !item.classList.contains('is-filtered'); });
      const clickedIndex = visibleItems.indexOf(clickedItem);
      carouselInner.replaceChildren();

      visibleItems.forEach(function(item, index) {
        const slide = document.createElement('div');
        slide.className = 'carousel-item h-100' + (index === clickedIndex ? ' active' : '');

        const imageFrame = document.createElement('div');
        imageFrame.className = 'd-flex align-items-center justify-content-center h-100';

        const image = document.createElement('img');
        image.src = item.getAttribute('data-image-src') || '';
        image.alt = item.getAttribute('data-image-alt') || 'Gallery image';
        image.className = 'd-block gallery-modal-image';

        imageFrame.appendChild(image);
        slide.appendChild(imageFrame);
        carouselInner.appendChild(slide);
      });

      const controlsDisplay = visibleItems.length > 1 ? '' : 'none';
      if (previousButton) previousButton.style.display = controlsDisplay;
      if (nextButton) nextButton.style.display = controlsDisplay;

      if (carouselInstance) carouselInstance.dispose();
      carouselInstance = new window.bootstrap.Carousel(carouselElement, {
        interval: false,
        keyboard: true,
        wrap: true,
      });
      window.bootstrap.Modal.getOrCreateInstance(galleryModal).show();
      if (clickedIndex > 0) carouselInstance.to(clickedIndex);
    }

    items.forEach(function(item) {
      item.addEventListener('click', function() { openLightbox(item); });
    });

    if (previousButton) previousButton.addEventListener('click', function() { carouselInstance?.prev(); });
    if (nextButton) nextButton.addEventListener('click', function() { carouselInstance?.next(); });

    if (galleryModal) {
      galleryModal.addEventListener('click', function(event) {
        if (event.target.closest('.btn-close') || event.target.closest('img') ||
            event.target.closest('[data-gallery-previous]') || event.target.closest('[data-gallery-next]')) return;
        window.bootstrap?.Modal.getOrCreateInstance(galleryModal).hide();
      });

      galleryModal.addEventListener('hidden.bs.modal', function() {
        if (carouselInstance) {
          carouselInstance.dispose();
          carouselInstance = null;
        }
      });
    }
  });
});
{%- end_javascript -%}
{%- endif -%}`,
  fields: galleryFields,
  notes: [
    'Uses the same Gallery Page Custom Fields as Gallery 01; its Filter Style option is shared between both variants.',
    'Add tags to gallery images that match the Filter Tags list so visitors can filter the masonry grid.',
    'Load the Bootstrap 5.3 bundle once on the page; the fullscreen image viewer uses Bootstrap Modal and Carousel.',
    'Gallery image alt text remains available to screen readers and is shown in the fullscreen viewer.',
  ],
  preview: {
    html: `<div class="gallery-modern">
  <style>
    .gallery-modern-preview{color:#172b3a}.gallery-modern-preview-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.gallery-modern-preview-kicker{margin:0 0 .5rem;color:#315b79;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.gallery-modern-preview-title{margin:0;font-size:clamp(2rem,5vw,3.5rem);font-weight:650;letter-spacing:-.055em;line-height:1}.gallery-modern-preview-filters{display:flex;gap:.4rem;overflow:auto}.gallery-modern-preview-filter{flex:none;border:1px solid transparent;border-radius:999px;padding:.6rem 1rem;background:transparent;color:#63727d;font-weight:600}.gallery-modern-preview-filter.active{border-color:#315b79;background:#315b79;color:white}.gallery-modern-preview-grid{columns:4 15rem;column-gap:1rem}.gallery-modern-preview-card{position:relative;display:block;width:100%;margin:0 0 1rem;break-inside:avoid;overflow:hidden;background:#dce3e4}.gallery-modern-preview-card img{display:block;width:100%;height:auto}.gallery-modern-preview-card:after{display:none}.gallery-modern-preview-card:before{position:absolute;z-index:1;right:.75rem;bottom:.75rem;display:grid;width:2rem;height:2rem;place-items:center;border:1px solid rgba(255,255,255,.85);border-radius:50%;background:rgba(15,27,36,.38);color:#fff;content:'↗'}.gallery-modern-preview-caption{display:none}@media(max-width:767px){.gallery-modern-preview-head{align-items:flex-start;flex-direction:column}}@media(max-width:575px){.gallery-modern-preview-grid{columns:2 10rem;column-gap:.7rem}.gallery-modern-preview-card{margin-bottom:.7rem}}
  </style>
  <section class="py-5 gallery-modern-preview" aria-label="Project gallery">
    <div class="container py-2">
      <div class="gallery-modern-preview-head"><div><p class="gallery-modern-preview-kicker">A closer look</p><h2 class="gallery-modern-preview-title">Spaces &amp; details</h2></div><nav class="gallery-modern-preview-filters" aria-label="Filter gallery images"><button class="gallery-modern-preview-filter" type="button" aria-pressed="false">All</button><button class="gallery-modern-preview-filter active" type="button" aria-pressed="true">Interior</button><button class="gallery-modern-preview-filter" type="button" aria-pressed="false">Exterior</button></nav></div>
      <div class="gallery-modern-preview-grid">
        <figure class="gallery-modern-preview-card"><img src="sample-image:modern" alt="Bright living room"><figcaption class="gallery-modern-preview-caption">Bright living room</figcaption></figure>
        <figure class="gallery-modern-preview-card"><img src="sample-image:exterior" alt="Outdoor gathering space"><figcaption class="gallery-modern-preview-caption">Outdoor gathering space</figcaption></figure>
        <figure class="gallery-modern-preview-card"><img src="sample-image:home" alt="Warm interior detail"><figcaption class="gallery-modern-preview-caption">Warm interior detail</figcaption></figure>
        <figure class="gallery-modern-preview-card"><img src="sample-image:modern" alt="Quiet architectural detail"><figcaption class="gallery-modern-preview-caption">Quiet architectural detail</figcaption></figure>
        <figure class="gallery-modern-preview-card"><img src="sample-image:home" alt="Sunlit reading corner"><figcaption class="gallery-modern-preview-caption">Sunlit reading corner</figcaption></figure>
        <figure class="gallery-modern-preview-card"><img src="sample-image:exterior" alt="Garden path detail"><figcaption class="gallery-modern-preview-caption">Garden path detail</figcaption></figure>
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
      { path: '', alt: 'Sunlit reading corner', tags: ['Interior'] },
      { path: '', alt: 'Garden path detail', tags: ['Exterior'] },
    ],
  },
};
