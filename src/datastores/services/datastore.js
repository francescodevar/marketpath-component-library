export default {
  id: 'services',
  name: 'Services',
  guidPlaceholder: 'WRITE HERE YOUR SERVICES GUID',
  description: 'Shared service records for cards, lists, and other service sections.',
  fields: [
    {
      Type: 'group',
      Label: 'Service Details',
      Condition: null,
      Collapsible: true,
      Fields: [
        {
          Type: 'image',
          FieldID: 'services_image',
          Label: 'Image',
          Condition: null,
          IsRequired: false,
        },
        {
          Type: 'html',
          FieldID: 'services_summary',
          Label: 'Summary',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
        {
          Type: 'html',
          FieldID: 'services_content',
          Label: 'Content',
          Condition: null,
          IsRequired: false,
          Validators: [],
        },
      ],
    },
  ],
};
