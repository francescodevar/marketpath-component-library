export const callToActionFields = [
  {
    Type: 'group',
    Label: 'Call to Action',
    Condition: null,
    Collapsible: true,
    Collapsed: false,
    Fields: [
      {
        Type: 'datastoreitem',
        FieldID: 'cta_datastore_item',
        Label: 'Select Datastore',
        Condition: null,
        IsRequired: false,
        DatastoreGUID: 'WRITE HERE YOUR CALL TO ACTION GUID',
      },
    ],
  },
];
