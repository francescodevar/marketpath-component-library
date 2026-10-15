export default {
  id: 'testimonials',
  name: 'Testimonials',
  guidPlaceholder: 'WRITE HERE YOUR TESTIMONIAL DATASTORE GUID',
  description: 'Shared testimonial records for the testimonial components.',
  fields: [
    {
      Type: 'group',
      Label: 'Testimonial Details',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'html',
          FieldID: 'testimonial_text',
          Label: 'Testimonial Text',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'text',
          FieldID: 'testimonial_highlight',
          Label: 'Testimonial Highlight',
          Condition: null,
          IsRequired: false,
          Validators: [],
          Placeholder: 'e.g. Homeowner',
        },
      ],
    },
  ],
};
