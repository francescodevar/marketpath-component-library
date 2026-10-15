export const faqFields = [
  {
    Type: 'group',
    Label: 'FAQs',
    Condition: null,
    Collapsible: true,
    Fields: [
      {
        Type: 'text',
        FieldID: 'faq_title',
        Label: 'FAQ Title',
        Condition: null,
        IsRequired: false,
        Validators: [],
        DefaultValue: 'Frequently Asked Questions',
      },
      {
        Type: 'text',
        FieldID: 'faq_description',
        Label: 'FAQ Description',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'datastoreitemlist',
        FieldID: 'faqs',
        Label: 'FAQs',
        Condition: null,
        IsRequired: false,
        Validators: [],
        DatastoreGUID: 'WRITE HERE YOUR FAQ GUID',
      },
    ],
  },
];

export const faqSharedFieldIds = faqFields[0].Fields.map((field) => field.FieldID);
