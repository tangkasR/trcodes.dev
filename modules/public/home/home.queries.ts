import "server-only";

import { cache } from "react";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import type {
  Block,
  Chapter,
} from "@/modules/public/blog-chapter/chapter.schema";
import type { Profile, Project } from "@/modules/public/home/home.schema";
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

function mapProfile(
  row: Prisma.ProfileGetPayload<{ select: typeof profileSelect }>
): Profile {
  return {
    ...row,
    bio: row.bio ?? "",
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

export const getHomePageData = cache(async () => {
  const [profileRow, projectRows] = await Promise.all([
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
  ]);

  return {
    profile: profileRow ? mapProfile(profileRow) : null,
    projects: projectRows.map(mapProject),
  };
});
