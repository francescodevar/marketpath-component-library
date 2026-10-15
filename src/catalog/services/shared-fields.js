export const serviceFields = [
  {
    Type: 'group',
    Label: 'Services Section',
    Condition: null,
    Collapsible: true,
    Fields: [
      {
        Type: 'text',
        FieldID: 'services_eyebrow',
        Label: 'Eyebrow',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'text',
        FieldID: 'services_title',
        Label: 'Title',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'html',
        FieldID: 'services_description',
        Label: 'Description',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'datastoreitemlist',
        FieldID: 'services_items',
        Label: 'Services',
        Subtext: 'Select the services to display.',
        Condition: null,
        IsRequired: false,
        Validators: [],
        DatastoreGUID: 'WRITE HERE YOUR SERVICES GUID',
      },
    ],
  },
];
