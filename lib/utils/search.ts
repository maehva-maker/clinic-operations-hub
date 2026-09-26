// lib/utils/search.ts
// One reusable, case-insensitive substring matcher for every search box in
// the app that needs to check a query against several fields on an item
// (a title, a list of tags, a body of text). Used by the SOP & Learning
// Center's global search and the Medical Glossary's search, and available
// to any future module instead of each one writing its own `.includes()`
// chain.

export function matchesSearch(
  query: string,
  ...fields: (string | string[] | undefined | null)[]
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return fields.some((field) => {
    if (!field) return false;
    const text = Array.isArray(field) ? field.join(" ") : field;
    return text.toLowerCase().includes(normalizedQuery);
  });
}
