const LEGACY_PROJECT_HASHES: Record<string, string> = {
  "user-role-management": "urm",
  mypocket: "mypocket",
  ismart: "ismart",
  "wedding-invitation": "wedding",
};

export function projectHash(slug: string): string {
  return LEGACY_PROJECT_HASHES[slug] ?? slug;
}

export const chapterUrl = (projectSlug: string, chapterSlug: string) =>
  `/blog/${projectSlug}/${chapterSlug}`;

/**
 * Use a stored image URL when it is absolute. The seeded relative paths point
 * at files that do not exist in /public, so fall back to a deterministic
 * placeholder instead of rendering a broken image.
 */
export function imageUrl(
  value: string | null | undefined,
  seed: string,
  width: number,
  height: number
): string {
  if (value && (/^https?:\/\//i.test(value) || value.startsWith("/uploads/"))) {
    return value;
  }
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
