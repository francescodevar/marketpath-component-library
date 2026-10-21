export default {
  id: 'content-07',
  name: 'Content Dark Reels',
  category: 'content',
  prefix: 'content_07_',
  bootstrap: true,
  customCss: true,
  customJs: true,
  bootstrapJs: false,
  description: 'A dark section with an eyebrow, title, and description above repeatable Instagram reels, each with a product link.',
  tags: ['content', 'instagram', 'reels', 'video', 'dark', 'product'],
  template: `{%- if entity.content_07_eyebrow.is_valid or entity.content_07_title.is_valid or entity.content_07_description.is_valid or entity.content_07_reels.is_valid -%}
<section class="content-07 bg-dark text-white py-5">
  <div class="container py-2">
    {%- if entity.content_07_eyebrow.is_valid or entity.content_07_title.is_valid or entity.content_07_description.is_valid -%}
    <div class="text-center mx-auto mb-5" style="max-width:720px;">
      {%- if entity.content_07_eyebrow.is_valid -%}
      <p class="text-uppercase small fw-semibold text-white-50 mb-2">{{ entity.content_07_eyebrow }}</p>
      {%- endif -%}
      {%- if entity.content_07_title.is_valid -%}
      <h2 class="display-5 fw-bold mb-3">{{ entity.content_07_title }}</h2>
      {%- endif -%}
      {%- if entity.content_07_description.is_valid -%}
      <p class="lead text-white-50 mb-0">{{ entity.content_07_description }}</p>
      {%- endif -%}
    </div>
    {%- endif -%}
    {%- if entity.content_07_reels.is_valid -%}
    <div class="row g-4 justify-content-center">
      {%- for item in entity.content_07_reels -%}
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        {%- if item.reel_link.is_valid -%}
        <div class="ratio rounded-4 overflow-hidden bg-black" style="--bs-aspect-ratio:190%;" data-moments-reel="{{ item.reel_link.value | escape }}">
          <a class="d-flex align-items-center justify-content-center text-white text-decoration-none" href="{{ item.reel_link.value | escape }}" target="_blank" rel="noopener">Watch on Instagram</a>
        </div>
        {%- endif -%}
        {%- if item.product_name.is_valid or item.product_link.is_valid -%}
        <div class="d-flex align-items-center justify-content-between gap-3 mt-3">
          {%- if item.product_name.is_valid -%}
          <span class="fw-semibold">{{ item.product_name }}</span>
          {%- endif -%}
          {%- if item.product_link.is_valid -%}
          <a class="btn btn-primary btn-sm ms-auto" href="{{ item.product_link.value | escape }}">View product</a>
          {%- endif -%}
        </div>
        {%- endif -%}
      </div>
      {%- endfor -%}
    </div>
    {%- endif -%}
  </div>
</section>

{%- add_javascript inline position:'body' defer:true -%}
document.querySelectorAll('[data-moments-reel]').forEach((frame) => {
  let url;
  try {
    url = new URL(frame.dataset.momentsReel);
  } catch (error) {
    return;
  }
  const match = url.pathname.match(/\\/(reel|reels|p|tv)\\/([A-Za-z0-9_-]+)/);
  if (!match) return;
  const embed = document.createElement('iframe');
  embed.src = 'https://www.instagram.com/' + (match[1] === 'reels' ? 'reel' : match[1]) + '/' + match[2] + '/embed';
  embed.title = 'Instagram reel';
  embed.loading = 'lazy';
  embed.allowFullscreen = true;
  embed.setAttribute('scrolling', 'no');
  embed.className = 'border-0 w-100 h-100';
  frame.replaceChildren(embed);
});
{%- end_javascript -%}
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Dark Reels',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'text',
          FieldID: 'content_07_eyebrow',
          Label: 'Eyebrow',
          Condition: null,
          IsRequired: false,
          Placeholder: 'e.g. On Instagram',
        },
        {
          Type: 'text',
          FieldID: 'content_07_title',
          Label: 'Title',
          Condition: null,
          IsRequired: false,
          Placeholder: 'e.g. Moments captured',
        },
        {
          Type: 'textarea',
          FieldID: 'content_07_description',
          Label: 'Description',
          Condition: null,
          IsRequired: false,
        },
        {
          Type: 'fieldset',
          FieldID: 'content_07_reels',
          Label: 'Reels',
          Condition: null,
          IsRequired: false,
          Validators: [
            {
              Message: 'You may not add more than 6 reels.',
              Type: 'maxitems',
              Value: 6,
            },
          ],
          Fields: [
            {
              Type: 'url',
              FieldID: 'reel_link',
              Label: 'Instagram reel link',
              Condition: null,
              IsRequired: true,
              Validators: [],
              Placeholder: 'https://www.instagram.com/reel/…',
              Subtext: 'Paste the public link of the reel. The embed is built from it.',
            },
            {
              Type: 'text',
              FieldID: 'product_name',
              Label: 'Product name',
              Condition: null,
              IsRequired: false,
              Validators: [],
              Placeholder: 'e.g. Example Product',
            },
            {
              Type: 'url',
              FieldID: 'product_link',
              Label: 'Product link',
              Condition: null,
              IsRequired: false,
              Validators: [],
              Subtext: 'Use a page link or a trusted HTTPS URL.',
            },
          ],
          AllowMultiple: true,
          InitCollapsed: false,
          Noun: 'reel',
        },
      ],
    },
  ],
  notes: [
    'Paste the public Instagram reel link in each item; a small script builds the official Instagram embed from it. Private reels and links that are not reels, posts, or TV will not embed.',
    'Until the embed loads (or if scripts are blocked), the item shows a "Watch on Instagram" link to the reel.',
    'Each reel can have a product name and a "View product" button; the button only appears when a product link is set.',
    'The section is dark (bg-dark) and uses the py-5 / container py-2 spacing convention. The preview shows static placeholders because the preview frame cannot load Instagram.',
  ],
  preview: {
    html: `<section class="content-07 bg-dark text-white py-5">
  <div class="container py-2">
    <div class="text-center mx-auto mb-5" style="max-width:720px;">
      <p class="text-uppercase small fw-semibold text-white-50 mb-2">On Instagram</p>
      <h2 class="display-5 fw-bold mb-3">Moments captured</h2>
      <p class="lead text-white-50 mb-0">A look at our latest work, straight from the field.</p>
    </div>
    <div class="row g-4 justify-content-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="ratio rounded-4 overflow-hidden" style="--bs-aspect-ratio:190%;background:linear-gradient(160deg,#2c3140,#0d0f14);">
          <div class="d-flex flex-column align-items-center justify-content-center text-white-50">
            <i class="bi bi-play-circle fs-1 mb-2"></i>
            <span class="small">Instagram reel</span>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between gap-3 mt-3">
          <span class="fw-semibold">Example Product One</span>
          <a class="btn btn-primary btn-sm ms-auto" href="#">View product</a>
        </div>
      </div>
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="ratio rounded-4 overflow-hidden" style="--bs-aspect-ratio:190%;background:linear-gradient(160deg,#2c3140,#0d0f14);">
          <div class="d-flex flex-column align-items-center justify-content-center text-white-50">
            <i class="bi bi-play-circle fs-1 mb-2"></i>
            <span class="small">Instagram reel</span>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between gap-3 mt-3">
          <span class="fw-semibold">Example Product Two</span>
          <a class="btn btn-primary btn-sm ms-auto" href="#">View product</a>
        </div>
      </div>
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="ratio rounded-4 overflow-hidden" style="--bs-aspect-ratio:190%;background:linear-gradient(160deg,#2c3140,#0d0f14);">
          <div class="d-flex flex-column align-items-center justify-content-center text-white-50">
            <i class="bi bi-play-circle fs-1 mb-2"></i>
            <span class="small">Instagram reel</span>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between gap-3 mt-3">
          <span class="fw-semibold">Example Product Three</span>
          <a class="btn btn-primary btn-sm ms-auto" href="#">View product</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    eyebrow: 'On Instagram',
    title: 'Moments captured',
    description: 'A look at our latest work, straight from the field.',
    reels: [
      { reel_link: 'https://www.instagram.com/reel/EXAMPLE1/', product_name: 'Example Product One', product_link: '/products/example-one' },
      { reel_link: 'https://www.instagram.com/reel/EXAMPLE2/', product_name: 'Example Product Two', product_link: '/products/example-two' },
      { reel_link: 'https://www.instagram.com/reel/EXAMPLE3/', product_name: 'Example Product Three', product_link: '/products/example-three' },
    ],
  },
};
