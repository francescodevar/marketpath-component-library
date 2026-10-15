export default {
  id: 'faqs',
  name: 'FAQs',
  guidPlaceholder: 'WRITE HERE YOUR FAQ GUID',
  description: 'Reusable FAQ records. The item title is the question and faq_answer stores the answer.',
  fields: [
    {
      Type: 'group',
      Label: 'FAQ',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'html',
          FieldID: 'faq_answer',
          Label: 'Answer',
          Condition: null,
          IsRequired: true,
          RequiredMessage: 'Answer is required',
          Validators: [],
        },
      ],
    },
  ],
};
