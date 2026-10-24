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
export const DEFAULT_SITE_TITLE =
  "trcodes — Tangkas Risdianto | Full Stack Developer & Web Developer";
export const DEFAULT_SITE_DESCRIPTION =
  "Portfolio dan dokumentasi arsitektur web Tangkas Risdianto (tangkas risdianto) — Full Stack Developer & Web Developer spesialis Next.js, TypeScript, PostgreSQL, Prisma, dan sistem enterprise modern.";

export const SEO_KEYWORDS = [
  // Variasi Nama & Brand (Case-sensitive & lowercase)
  "Tangkas",
  "tangkas",
  "Risdianto",
  "risdianto",
  "Tangkas Risdianto",
  "tangkas risdianto",
  "tangkas Risdianto",
  "Tangkas risdianto",
  "trcodes",
  "trcodes.dev",
  "tr codes",
  // Profesi & Spesialisasi Web Developer
  "Full Stack Developer",
  "full stack developer",
  "Full Stack Web Developer",
  "full stack web developer",
  "Web Developer",
  "web developer",
  "Web Developer Indonesia",
  "Full Stack Developer Indonesia",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Web Engineer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Next.js Developer",
  "React Developer",
  "Node.js Developer",
  // Arsitektur & Teknologi Web
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "PostgreSQL",
  "Prisma ORM",
  "Tailwind CSS",
  "Enterprise Web Architecture",
  "Web Application Security",
  "Role-Based Access Control",
  "RBAC",
  "REST API",
  "Clean Architecture",
  "Generative Engine Optimization",
  "GEO",
  "SEO",
];
