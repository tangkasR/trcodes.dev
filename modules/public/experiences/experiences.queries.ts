import "server-only";

import { cache } from "react";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import type {
  Block,
  Chapter,
} from "@/modules/public/blog-chapter/chapter.schema";
import type {
  Certification,
  Contact,
  Education,
  Experience,
} from "@/modules/public/experiences/experience.schema";
import type { Profile, Project } from "@/modules/public/home/home.schema";
import { formatPeriod } from "@/utils/format-period";
import { projectHash } from "@/utils/public-links";

const profileSelect = {
  uuid: true,
  fullName: true,
  title: true,
  brand: true,
  contentName: true,
  tagline: true,
  intro: true,
  bio: true,
  photoUrl: true,
} satisfies Prisma.ProfileSelect;

const experienceSelect = {
  slug: true,
  organization: true,
  role: true,
  startDate: true,
  endDate: true,
  summary: true,
  duties: true,
  results: true,
  stack: true,
} satisfies Prisma.ExperienceSelect;

const chapterSelect = {
  slug: true,
  title: true,
  icon: true,
  definition: true,
  application: true,
  teaser: true,
  coverUrl: true,
  coverAlt: true,
  content: true,
} satisfies Prisma.ChapterSelect;

const projectSelect = {
  uuid: true,
  slug: true,
  name: true,
  short: true,
  description: true,
  features: true,
  stack: true,
  demoImageUrl: true,
  demoVideoUrl: true,
  chaptersHeading: true,
  isDefault: true,
  chapters: {
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: chapterSelect,
  },
} satisfies Prisma.ProjectSelect;

const CONTACT_META: Record<string, { icon: string; name: string }> = {
  EMAIL: { icon: "fa-regular fa-envelope", name: "Email" },
  WHATSAPP: { icon: "fa-brands fa-whatsapp", name: "WhatsApp" },
  INSTAGRAM: { icon: "fa-brands fa-instagram", name: "Instagram" },
  GITHUB: { icon: "fa-brands fa-github", name: "GitHub" },
  LINKEDIN: { icon: "fa-brands fa-linkedin", name: "LinkedIn" },
};

function mapProfile(
  row: Prisma.ProfileGetPayload<{ select: typeof profileSelect }>
): Profile {
  return {
    ...row,
    bio: row.bio ?? "",
  };
}

function mapExperience(
  row: Prisma.ExperienceGetPayload<{ select: typeof experienceSelect }>
): Experience {
  return {
    slug: row.slug,
    start: String(row.startDate.getUTCFullYear()),
    org: row.organization,
    role: row.role,
    period: formatPeriod(row.startDate, row.endDate),
    summary: row.summary,
    duties: row.duties,
    results: row.results,
    stack: row.stack,
  };
}

function mapChapter(
  row: Prisma.ChapterGetPayload<{ select: typeof chapterSelect }>
): Chapter {
  return {
    slug: row.slug,
    title: row.title,
    icon: row.icon,
    what: row.definition,
    use: row.application,
    more: row.teaser ?? "",
    img: row.coverUrl ?? "",
    imgAlt: row.coverAlt ?? `Ilustrasi bab: ${row.title}`,
    content: Array.isArray(row.content)
      ? (row.content as unknown as Block[])
      : [],
  };
}

function mapProject(
  row: Prisma.ProjectGetPayload<{ select: typeof projectSelect }>
): Project {
  return {
    slug: row.slug,
    hash: projectHash(row.slug),
    name: row.name,
    short: row.short,
    desc: row.description,
    can: row.features,
    stack: row.stack,
    demo: {
      img: row.demoImageUrl ?? "",
      video: row.demoVideoUrl ?? "",
    },
    chHead: row.chaptersHeading ?? "Bab-bab di dalamnya",
    isDefault: row.isDefault,
    chapters: row.chapters.map(mapChapter),
  };
}

export const getExperiencesPageData = cache(async () => {
  const [
    profileRow,
    projectRows,
    contactRows,
    educationRows,
    experienceRows,
    certificationRows,
  ] = await Promise.all([
    prisma.profile.findFirst({
      orderBy: [{ createdAt: "asc" }, { uuid: "asc" }],
      select: profileSelect,
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { sortOrder: "asc" },
        { isDefault: "desc" },
        { createdAt: "asc" },
      ],
      select: projectSelect,
    }),
    prisma.contactLink.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { uuid: "asc" }],
      select: {
        platform: true,
        displayText: true,
        url: true,
      },
    }),
    prisma.education.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        school: true,
        major: true,
        startYear: true,
        endYear: true,
      },
    }),
    prisma.experience.findMany({
      where: { isVisible: true },
      orderBy: [{ startDate: "desc" }, { uuid: "asc" }],
      select: experienceSelect,
    }),
    prisma.certification.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { uuid: "asc" }],
      select: {
        title: true,
        issuer: true,
        year: true,
        credentialUrl: true,
      },
    }),
  ]);

  const contacts: Contact[] = contactRows.map((row) => {
    const meta = CONTACT_META[row.platform] ?? {
      icon: "fa-solid fa-link",
      name: row.platform,
    };
    return {
      platform: row.platform,
      icon: meta.icon,
      name: meta.name,
      href: row.url,
      text: row.displayText,
    };
  });

  const educations: Education[] = educationRows.map((row) => ({
    school: row.school,
    major: row.major,
    years: `${row.startYear}-${row.endYear ?? "sekarang"}`,
  }));

  const certifications: Certification[] = certificationRows.map((row) => ({
    title: row.title,
    issuer: row.issuer,
    year: String(row.year),
    credentialUrl: row.credentialUrl,
  }));

  return {
    profile: profileRow ? mapProfile(profileRow) : null,
    projects: projectRows.map(mapProject),
    contacts,
    educations,
    experiences: experienceRows.map(mapExperience),
    certifications,
  };
});
