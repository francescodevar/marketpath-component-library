// Auto-discover reusable datastore schemas. Components reference them by datastoreId.
const modules = import.meta.glob('../datastores/**/datastore.js', {
  eager: true,
  import: 'default',
});

export const datastores = Object.values(modules).sort((a, b) => a.name.localeCompare(b.name));
