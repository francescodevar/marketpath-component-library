export default {
  id: 'content-05',
  name: 'Content Image and Title Card Grid',
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
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><img src="sample-image:exterior" class="w-100 h-100 object-fit-cover" alt=""></div><h2 class="h4 fw-semibold mt-3 mb-0">Craftsmanship</h2></article></div>
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><img src="sample-image:modern" class="w-100 h-100 object-fit-cover" alt=""></div><h2 class="h4 fw-semibold mt-3 mb-0">Quality Materials</h2></article></div>
      <div class="col"><article class="h-100"><div class="ratio ratio-1x1 overflow-hidden"><img src="sample-image:home" class="w-100 h-100 object-fit-cover" alt=""></div><h2 class="h4 fw-semibold mt-3 mb-0">Competitive Pricing</h2></article></div>
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
