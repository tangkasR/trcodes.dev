/**
 * Site-wide configuration and URL helper for SEO, Canonical URLs, and OpenGraph.
 */

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, "");
  }
  return "https://trcodes.dev";
}

export const SITE_NAME = "trcodes.dev";
export const DEFAULT_SITE_TITLE = "trcodes — Tangkas Risdianto | Full Stack Developer";
export const DEFAULT_SITE_DESCRIPTION =
  "Ngoding apa saja. Menceritakan perjalanannya. Dokumentasi dan portfolio arsitektur web fullstack Next.js, PostgreSQL, TypeScript, dan sistem enterprise.";
