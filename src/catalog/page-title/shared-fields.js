export const pageTitleTitleSourceField = {
  Type: 'radio',
  FieldID: 'page_title_01_title_source',
  Label: 'Title source',
  Condition: null,
  IsRequired: true,
  Options: 'page:Page title;custom:Custom title',
  Delimiter: ';',
  ValueDelimiter: ':',
  DefaultValue: 'page',
};

export const pageTitleCustomTitleField = {
  Type: 'text',
  FieldID: 'page_title_01_custom_title',
  Label: 'Custom title',
  Condition: {
    FieldID: 'page_title_01_title_source',
    Type: 'eq',
    Value: 'custom',
  },
  IsRequired: true,
  Validators: [],
  Placeholder: 'Your page heading',
};

export const pageTitleBreadcrumbField = {
  Type: 'toggle',
  FieldID: 'page_title_01_show_breadcrumbs',
  Label: 'Show breadcrumb',
  Condition: null,
  IsRequired: false,
  OnLabel: 'Show',
  OnValue: 'On',
  OnColor: 'success',
  OffLabel: 'Hide',
  OffValue: 'Off',
  OffColor: 'secondary',
  DefaultValue: true,
};

export const pageTitleSharedFieldIds = [
  pageTitleTitleSourceField.FieldID,
  pageTitleCustomTitleField.FieldID,
  pageTitleBreadcrumbField.FieldID,
];
