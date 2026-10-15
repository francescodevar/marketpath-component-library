export const projectCardFields = [
  {
    Type: 'group',
    Label: 'Projects Section',
    Condition: null,
    Collapsible: true,
    Fields: [
      {
        Type: 'text',
        FieldID: 'projects_eyebrow',
        Label: 'Eyebrow',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'text',
        FieldID: 'projects_title',
        Label: 'Title',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'text',
        FieldID: 'projects_description',
        Label: 'Description',
        Condition: null,
        IsRequired: false,
        Validators: [],
      },
      {
        Type: 'datastoreitemlist',
        FieldID: 'projects_items',
        Label: 'Projects',
        Condition: null,
        IsRequired: false,
        Validators: [],
        DatastoreGUID: 'd305845c-b6c1-45c9-9ebc-4ed879ee7016',
      },
    ],
  },
];
