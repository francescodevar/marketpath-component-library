// Auto-discover template records. Add a component folder under src/catalog/<category>/<id>/.
const modules = import.meta.glob('../catalog/**/component.js', {
  eager: true,
  import: 'default',
});

export const components = Object.values(modules).sort((a, b) =>
  a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
);
