// src/modules/chapter/chapter.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { Block, ChapterRow } from "./chapter.schema";

export async function getProjectDetailWithChapters(projectUuid: string) {
  const project = await prisma.project.findUnique({
    where: { uuid: projectUuid },
    select: {
      uuid: true,
      name: true,
      slug: true,
      short: true,
      status: true,
      chaptersHeading: true,
    },
  });

  return project;
}

export async function getChaptersByProject(
  projectUuid: string,
  { page, limit, q }: ListParams
) {
  const where: Prisma.ChapterWhereInput = {
    projectUuid,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { definition: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.chapter.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        uuid: true,
        projectUuid: true,
        slug: true,
        title: true,
        icon: true,
        definition: true,
        application: true,
        teaser: true,
        coverUrl: true,
        coverAlt: true,
        content: true,
        status: true,
        sortOrder: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.chapter.count({ where }),
  ]);

  const items: ChapterRow[] = rows.map((r) => ({
    uuid: r.uuid,
    projectUuid: r.projectUuid,
    slug: r.slug,
    title: r.title,
    icon: r.icon,
    definition: r.definition,
    application: r.application,
    teaser: r.teaser,
    coverUrl: r.coverUrl,
    coverAlt: r.coverAlt,
    content: (r.content as unknown as Block[]) ?? [],
    status: r.status,
    sortOrder: r.sortOrder,
    publishedAt: r.publishedAt,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
