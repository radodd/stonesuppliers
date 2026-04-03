/**
 * Converts a string to a URL-safe slug.
 * Removes non-alphanumeric characters, replaces spaces with dashes,
 * and collapses multiple consecutive dashes.
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // collapse multiple dashes
}
