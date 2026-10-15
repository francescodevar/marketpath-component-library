import { galleryFields } from '../shared-fields.js';

export default {
  id: 'gallery-01',
  name: 'Filterable Image Gallery',
  category: 'gallery',
  prefix: 'gallery_',
  sharedFieldsId: 'gallery',
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: true,
  description: 'A responsive image gallery with tag filters and a fullscreen Bootstrap carousel.',
  tags: ['gallery', 'images', 'filters', 'carousel'],
  template: `{%- if entity.gallery_images.is_valid -%}
<div class="gallery-component" data-gallery-component="gallery-01">
  <section class="py-5" aria-label="Image gallery">
    <div class="container py-2">
      {%- if entity.gallery_title.is_valid -%}
      <div class="row mb-4 mb-lg-5">
        <div class="col-12 text-center">
          <h2 class="display-5 fw-bold">{{ entity.gallery_title }}</h2>
        </div>
      </div>
      {%- endif -%}

      {%- if entity.gallery_filters.is_valid -%}
      <div class="row mb-4">
        <div class="col-12">
          <ul class="list-group list-group-horizontal justify-content-center d-none d-md-flex flex-wrap gap-3 border-0 bg-transparent p-0 gallery-filter-list{% if entity.gallery_filter_style.is_valid and entity.gallery_filter_style.value == 'active-outline' %} gallery-filter-list--active-outline{% endif %}" aria-label="Filter gallery images">
            <li class="list-group-item border-0 bg-transparent p-0">
              <button class="btn btn-primary rounded-0 filter-btn" type="button" data-filter="all" aria-pressed="true">All</button>
            </li>
            {%- for tag in entity.gallery_filters -%}
            <li class="list-group-item border-0 bg-transparent p-0">
              <button class="btn btn-outline-primary rounded-0 filter-btn" type="button" data-filter="{{ tag.title | downcase | replace: ' ', '-' | escape }}" aria-pressed="false">{{ tag.title }}</button>
            </li>
            {%- endfor -%}
          </ul>
          <div class="d-md-none">
            <label class="visually-hidden" for="galleryMobileFilter">Filter gallery images</label>
            <select class="form-select rounded-0" id="galleryMobileFilter">
              <option value="all">All Categories</option>
              {%- for tag in entity.gallery_filters -%}
              <option value="{{ tag.title | downcase | replace: ' ', '-' | escape }}">{{ tag.title }}</option>
              {%- endfor -%}
            </select>
          </div>
        </div>
      </div>
      {%- endif -%}

      <div class="row g-4" id="galleryGrid">
        {%- for image in entity.gallery_images -%}
        <div class="col-12 col-md-6 col-lg-4 gallery-item-wrapper" data-tags="{%- for tag in image.tags -%}{{ tag.title | downcase | replace: ' ', '-' | escape }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}" data-image-src="{% image_url = image | preset:'webp' %}" data-image-alt="{{ image.alt | default: 'Gallery image' | escape }}">
          <button class="gallery-item w-100 border-0 p-0 text-start" type="button" aria-label="Open {{ image.alt | default: 'Gallery image' | escape }} in image viewer">
            <span class="ratio ratio-4x3 d-block">
              <img src="{% image_url = image | preset:'webp' %}" alt="{{ image.alt | default: 'Gallery image' | escape }}" class="w-100 h-100 object-fit-cover" loading="lazy">
            </span>
          </button>
        </div>
        {%- endfor -%}
      </div>

      <div id="galleryNoResults" class="row d-none" role="status" aria-live="polite">
        <div class="col-12 text-center py-5">
          <i class="bi bi-images text-muted gallery-empty-icon" aria-hidden="true"></i>
          <p class="text-muted fs-5 mt-3 mb-0">No images found for this filter.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="modal fade" id="galleryModal" role="dialog" tabindex="-1" aria-hidden="true" data-bs-keyboard="true" aria-label="Image gallery viewer">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content gallery-modal-content">
        <div class="modal-header border-0 position-absolute top-0 end-0 z-3">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close image viewer"></button>
        </div>
        <div class="modal-body p-0 d-flex align-items-center justify-content-center">
          <div id="galleryCarousel" class="carousel slide h-100 w-100" aria-label="Gallery images">
            <div class="carousel-inner h-100" id="galleryCarouselInner"></div>
            <button class="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev" aria-label="Previous image">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next" aria-label="Next image">
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
.gallery-component .gallery-item {
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.gallery-component .gallery-filter-list--active-outline .filter-btn {
  color: var(--bs-primary);
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  font-weight: 600;
}

.gallery-component .gallery-filter-list--active-outline .filter-btn[aria-pressed="true"] {
  border-color: var(--bs-primary);
}

.gallery-component .gallery-filter-list--active-outline .filter-btn:hover:not([aria-pressed="true"]),
.gallery-component .gallery-filter-list--active-outline .filter-btn:focus-visible:not([aria-pressed="true"]) {
  border-color: var(--bs-gray-300);
}

.gallery-component .gallery-item img {
  transition: transform .4s ease;
}

.gallery-component .gallery-item:hover img,
.gallery-component .gallery-item:focus-visible img {
  transform: scale(1.05);
}

.gallery-component .gallery-item:focus-visible {
  outline: 3px solid var(--bs-primary);
  outline-offset: 3px;
}

.gallery-component .gallery-modal-content {
  background-color: rgba(0, 0, 0, .92);
}

.gallery-component .gallery-modal-image {
  max-height: 90vh;
  max-width: 90vw;
  width: auto;
  height: auto;
  object-fit: contain;
}

.gallery-component .gallery-empty-icon {
  font-size: 4rem;
}

.gallery-component .carousel-control-prev,
.gallery-component .carousel-control-next {
  width: 60px;
  height: 60px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, .15);
  border-radius: 50%;
  opacity: .8;
  transition: background-color .3s ease, opacity .3s ease;
}

.gallery-component .carousel-control-prev:hover,
.gallery-component .carousel-control-next:hover,
.gallery-component .carousel-control-prev:focus-visible,
.gallery-component .carousel-control-next:focus-visible {
  background-color: rgba(255, 255, 255, .25);
  opacity: 1;
}

.gallery-component .carousel-control-prev {
  left: 30px;
}

.gallery-component .carousel-control-next {
  right: 30px;
}

.gallery-component .animate-in {
  animation: galleryFadeInUp .5s ease forwards;
}

@keyframes galleryFadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .gallery-component .carousel-control-prev,
  .gallery-component .carousel-control-next {
    width: 45px;
    height: 45px;
  }

  .gallery-component .carousel-control-prev { left: 15px; }
  .gallery-component .carousel-control-next { right: 15px; }
}
{% end_stylesheet %}

{%- add_javascript inline position:'body' -%}
document.addEventListener('DOMContentLoaded', function() {
  const root = document.querySelector('[data-gallery-component="gallery-01"]');
  if (!root) return;

  const filterButtons = Array.from(root.querySelectorAll('.filter-btn'));
  const mobileFilter = root.querySelector('#galleryMobileFilter');
  const galleryItems = Array.from(root.querySelectorAll('.gallery-item-wrapper'));
  const galleryGrid = root.querySelector('#galleryGrid');
  const noResults = root.querySelector('#galleryNoResults');
  const galleryModal = root.querySelector('#galleryModal');
  const carouselInner = root.querySelector('#galleryCarouselInner');
  const carouselEl = root.querySelector('#galleryCarousel');
  const activeOutlineFilters = Boolean(root.querySelector('.gallery-filter-list--active-outline'));
  let carouselInstance = null;

  function filterGallery(filterValue) {
    let visibleCount = 0;

    galleryItems.forEach(function(item) {
      const tags = (item.getAttribute('data-tags') || '').split(',').filter(Boolean);
      const isVisible = filterValue === 'all' || tags.includes(filterValue);
      item.classList.toggle('d-none', !isVisible);
      if (isVisible) {
        item.classList.add('animate-in');
        window.setTimeout(function() { item.classList.remove('animate-in'); }, 500);
        visibleCount += 1;
      }
    });

    galleryGrid.classList.toggle('d-none', visibleCount === 0);
    noResults.classList.toggle('d-none', visibleCount > 0);
  }

  function setActiveFilter(filterValue) {
    filterButtons.forEach(function(button) {
      const isActive = button.getAttribute('data-filter') === filterValue;
      if (activeOutlineFilters) {
        button.classList.toggle('is-active', isActive);
      } else {
        button.classList.toggle('btn-primary', isActive);
        button.classList.toggle('btn-outline-primary', !isActive);
      }
      button.setAttribute('aria-pressed', String(isActive));
    });
    if (mobileFilter) mobileFilter.value = filterValue;
    filterGallery(filterValue);
  }

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      setActiveFilter(button.getAttribute('data-filter'));
    });
  });

  if (mobileFilter) {
    mobileFilter.addEventListener('change', function() {
      setActiveFilter(mobileFilter.value);
    });
  }

  galleryItems.forEach(function(wrapper) {
    const galleryItem = wrapper.querySelector('.gallery-item');
    if (!galleryItem) return;

    galleryItem.addEventListener('click', function() {
      if (!window.bootstrap || !galleryModal || !carouselEl) return;
      const visibleItems = galleryItems.filter(function(item) { return !item.classList.contains('d-none'); });
      const clickedIndex = visibleItems.indexOf(wrapper);
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

      const showControls = visibleItems.length > 1 ? '' : 'none';
      carouselEl.querySelector('.carousel-control-prev').style.display = showControls;
      carouselEl.querySelector('.carousel-control-next').style.display = showControls;

      if (carouselInstance) carouselInstance.dispose();
      carouselInstance = new window.bootstrap.Carousel(carouselEl, { interval: false, keyboard: true, wrap: true });
      window.bootstrap.Modal.getOrCreateInstance(galleryModal).show();
      if (clickedIndex > 0) carouselInstance.to(clickedIndex);
    });
  });

  galleryModal.addEventListener('click', function(event) {
    if (event.target.closest('.btn-close') || event.target.closest('img') ||
        event.target.closest('.carousel-control-prev') || event.target.closest('.carousel-control-next')) return;
    window.bootstrap.Modal.getOrCreateInstance(galleryModal).hide();
  });
});
{%- end_javascript -%}
{%- endif -%}`,
  fields: galleryFields,
  notes: [
    'Add the Bootstrap 5.3 bundle to the page; this component uses Bootstrap Modal and Carousel.',
    'Bootstrap Icons CSS is used for the no-results icon.',
    'Add tags to gallery images that match the Filter Tags list so visitors can filter the gallery.',
    'Choose Buttons or Text with active outline in Filter Style to control the desktop filter appearance.',
    'JavaScript and component styles are included inline in this single template. customJs and customCss are both enabled.',
    'The cards and filters are responsive. On mobile, filters use a select menu; selecting an image opens a fullscreen carousel of the currently visible images.',
  ],
  preview: {
    html: `<div class="gallery-component" data-gallery-component="gallery-01">
  <style>.gallery-component .filter-btn{color:var(--bs-primary);background:transparent;border-color:transparent;box-shadow:none;font-weight:600}.gallery-component .filter-btn[aria-pressed="true"]{border-color:var(--bs-primary)}</style>
  <section class="py-5" aria-label="Image gallery">
    <div class="container py-2">
      <div class="row mb-4 mb-lg-5"><div class="col-12 text-center"><h2 class="display-5 fw-bold">Spaces &amp; details</h2></div></div>
      <div class="row mb-4"><div class="col-12"><ul class="list-group list-group-horizontal justify-content-center d-none d-md-flex flex-wrap gap-3 border-0 bg-transparent p-0"><li class="list-group-item border-0 bg-transparent p-0"><button class="btn btn-primary rounded-0 filter-btn" type="button" data-filter="all" aria-pressed="true">All</button></li><li class="list-group-item border-0 bg-transparent p-0"><button class="btn btn-outline-primary rounded-0 filter-btn" type="button" data-filter="interior" aria-pressed="false">Interior</button></li><li class="list-group-item border-0 bg-transparent p-0"><button class="btn btn-outline-primary rounded-0 filter-btn" type="button" data-filter="exterior" aria-pressed="false">Exterior</button></li></ul><div class="d-md-none"><select class="form-select rounded-0" aria-label="Filter gallery images"><option>All Categories</option><option>Interior</option><option>Exterior</option></select></div></div></div>
      <div class="row g-4" id="galleryGrid">
        <div class="col-12 col-md-6 col-lg-4 gallery-item-wrapper" data-tags="interior" data-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23dbe6ee'/%3E%3Cpath d='M0 480 220 250 410 430 580 190 800 460v140H0z' fill='%2397aebc'/%3E%3C/svg%3E" data-image-alt="Bright living room">
          <button class="gallery-item w-100 border-0 p-0 text-start" type="button" aria-label="Open Bright living room in image viewer"><span class="ratio ratio-4x3 d-block"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23dbe6ee'/%3E%3Cpath d='M0 480 220 250 410 430 580 190 800 460v140H0z' fill='%2397aebc'/%3E%3C/svg%3E" alt="Bright living room" class="w-100 h-100 object-fit-cover" loading="lazy"></span></button>
        </div>
        <div class="col-12 col-md-6 col-lg-4 gallery-item-wrapper" data-tags="exterior" data-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e4e6dc'/%3E%3Cpath d='M0 500 200 300 400 420 610 210 800 440v160H0z' fill='%2399a891'/%3E%3C/svg%3E" data-image-alt="Outdoor gathering space">
          <button class="gallery-item w-100 border-0 p-0 text-start" type="button" aria-label="Open Outdoor gathering space in image viewer"><span class="ratio ratio-4x3 d-block"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e4e6dc'/%3E%3Cpath d='M0 500 200 300 400 420 610 210 800 440v160H0z' fill='%2399a891'/%3E%3C/svg%3E" alt="Outdoor gathering space" class="w-100 h-100 object-fit-cover" loading="lazy"></span></button>
        </div>
        <div class="col-12 col-md-6 col-lg-4 gallery-item-wrapper" data-tags="interior" data-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23ebe2d8'/%3E%3Cpath d='M0 470 240 260 430 420 620 170 800 450v150H0z' fill='%23c2a98f'/%3E%3C/svg%3E" data-image-alt="Warm interior detail">
          <button class="gallery-item w-100 border-0 p-0 text-start" type="button" aria-label="Open Warm interior detail in image viewer"><span class="ratio ratio-4x3 d-block"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23ebe2d8'/%3E%3Cpath d='M0 470 240 260 430 420 620 170 800 450v150H0z' fill='%23c2a98f'/%3E%3C/svg%3E" alt="Warm interior detail" class="w-100 h-100 object-fit-cover" loading="lazy"></span></button>
        </div>
      </div>
      <div id="galleryNoResults" class="row d-none"><div class="col-12 text-center py-5"><i class="bi bi-images text-muted gallery-empty-icon" aria-hidden="true"></i><p class="text-muted fs-5 mt-3 mb-0">No images found for this filter.</p></div></div>
    </div>
  </section>
  <div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true" data-bs-keyboard="true" aria-label="Image gallery viewer"><div class="modal-dialog modal-fullscreen"><div class="modal-content gallery-modal-content"><div class="modal-header border-0 position-absolute top-0 end-0 z-3"><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close image viewer"></button></div><div class="modal-body p-0 d-flex align-items-center justify-content-center"><div id="galleryCarousel" class="carousel slide h-100 w-100"><div class="carousel-inner h-100" id="galleryCarouselInner"></div><button class="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div></div></div></div></div>
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
    ],
  },
};
