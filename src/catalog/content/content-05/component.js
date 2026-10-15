export default {
  id: 'content-05',
  name: 'Image Title Cards',
  category: 'content',
  prefix: 'content_05_',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  description: 'A clean responsive grid of image-and-title cards with no links or buttons.',
  tags: ['content', 'image', 'cards', 'grid'],
  template: `{%- if entity.content_05_items.is_valid -%}
<section class="content-05 bg-white py-5">
  <div class="container py-2">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
      {%- for item in entity.content_05_items -%}
      <div class="col">
        <article class="h-100">
          {%- if item.image.is_valid -%}
          <div class="ratio ratio-1x1 overflow-hidden">
            {%- img item.image preset:"800x600-crop webp" class:"w-100 h-100 object-fit-cover" alt:item.image.alt|default:'' link:false loading:"lazy" -%}
          </div>
          {%- endif -%}
          {%- if item.title.is_valid -%}
          <h2 class="h4 fw-semibold mt-3 mb-0">{{ item.title }}</h2>
          {%- endif -%}
        </article>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: [
    {
      Type: 'group',
      Label: 'Image Title Cards',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'fieldset',
          FieldID: 'content_05_items',
          Label: 'Cards',
          Subtext: 'Add an image and title for each card. Cards are not linked.',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Fields: [
            {
              Type: 'image',
              FieldID: 'image',
              Label: 'Image',
              Condition: null,
              IsRequired: false,
              Subtext: 'Recommended preset: 800x600-crop.',
            },
            {
              Type: 'text',
              FieldID: 'title',
              Label: 'Title',
              Condition: null,
              IsRequired: false,
              Validators: [],
              Placeholder: 'e.g. Craftsmanship',
            },
          ],
          AllowMultiple: true,
          InitCollapsed: false,
        },
      ],
    },
  ],
  notes: [
    'Add one fieldset item for each card. Each card contains an image and title and is not clickable.',
    'The grid displays one column on mobile, two on small screens, and three on large screens.',
    'Create the 800x600-crop image preset in Marketpath. Images are cropped to square display frames.',
  ],
  preview: {
    html: `<section class="content-05 bg-white py-5">
  <div class="container py-2">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deck railing detail"><rect width="600" height="600" fill="#71847c"/><path d="M0 450h600v150H0z" fill="#806348"/><path d="M0 486h600M0 535h600M0 584h600" stroke="#b68d65" stroke-width="8"/><path d="M55 95 540 210M55 95v280M540 210v218M55 155l485 115M55 215l485 115M55 275l485 115" fill="none" stroke="#e7e6dd" stroke-width="9"/><path d="M55 95 540 210" stroke="#8e5939" stroke-width="20"/><path d="M0 0h600v75H0z" fill="#50695f"/></svg></div><h2 class="h4 fw-semibold mt-3 mb-0">Craftsmanship</h2></article></div>
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Modern window and door display"><rect width="600" height="600" fill="#8c796d"/><rect y="75" width="600" height="525" fill="#333d3d"/><rect x="32" y="120" width="536" height="450" fill="#b9ced0" stroke="#252d2d" stroke-width="24"/><path d="M210 125v440M390 125v440" stroke="#303a39" stroke-width="18"/><path d="M40 352h520" stroke="#303a39" stroke-width="14"/><rect x="88" y="158" width="88" height="34" fill="#e6dd66"/><rect x="256" y="158" width="88" height="34" fill="#e6dd66"/><rect x="430" y="158" width="88" height="34" fill="#e6dd66"/><path d="M65 535 175 400m90 135 100-120m65 120 100-85" stroke="#d9e2df" stroke-width="10" opacity=".5"/></svg></div><h2 class="h4 fw-semibold mt-3 mb-0">Quality Materials</h2></article></div>
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Finished home exterior"><rect width="600" height="600" fill="#7fc1ed"/><circle cx="500" cy="90" r="48" fill="#ffe39c"/><path d="M25 270 310 80l275 190v300H25z" fill="#e0c98f"/><path d="M14 275 310 68l292 207" fill="none" stroke="#454b49" stroke-width="34"/><path d="M90 290h120v125H90zm290 0h120v125H380z" fill="#b4d7e1" stroke="#fff" stroke-width="15"/><path d="M0 510h600v90H0z" fill="#71925a"/><path d="M58 410h475v30H58zM58 440v110m95-110v110m95-110v110m95-110v110m95-110v110m95-110v110" fill="none" stroke="#f4f1e8" stroke-width="13"/><path d="M0 380q65-90 135 0v130H0m420-15q80-100 180-10v155H420" fill="#47724a"/></svg></div><h2 class="h4 fw-semibold mt-3 mb-0">Competitive Pricing</h2></article></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    items: [
      { image: '', title: 'Craftsmanship' },
      { image: '', title: 'Quality Materials' },
      { image: '', title: 'Competitive Pricing' },
    ],
  },
};
