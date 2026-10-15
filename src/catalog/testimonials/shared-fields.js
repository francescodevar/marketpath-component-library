export const testimonialFields = [
  {
    Type: 'group',
    Label: 'Testimonials Section',
    Condition: null,
    Collapsible: true,
    Fields: [
      {
        Type: 'text',
        FieldID: 'testimonials_section_title',
        Label: 'Title',
        Condition: null,
        IsRequired: false,
        RequiredMessage: 'This field is required',
        Validators: [],
        DefaultValue: 'Testimonials',
      },
      {
        Type: 'text',
        FieldID: 'testimonials_intro_text',
        Label: 'Intro Text',
        Condition: null,
        IsRequired: false,
        RequiredMessage: 'This field is required',
        Validators: [],
        DefaultValue: '',
      },
      {
        Type: 'datastoreitemlist',
        FieldID: 'testimonials_section_items',
        Label: 'Testimonials Section Items',
        Condition: null,
        IsRequired: false,
        Validators: [],
        DatastoreGUID: 'WRITE HERE YOUR TESTIMONIAL DATASTORE GUID',
      },
    ],
  },
];
