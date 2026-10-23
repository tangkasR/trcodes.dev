// src/modules/project/project.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { ProjectRow } from "./project.schema";

export async function getProjects({ page, limit, q }: ListParams) {
  const where: Prisma.ProjectWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { short: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { isDefault: "desc" }, { createdAt: "desc" }],
      select: {
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
        status: true,
        sortOrder: true,
        updatedAt: true,
        _count: {
          select: { chapters: true },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  const items: ProjectRow[] = rows.map((r) => ({
    uuid: r.uuid,
    slug: r.slug,
    name: r.name,
    short: r.short,
    description: r.description,
    features: r.features,
    stack: r.stack,
    demoImageUrl: r.demoImageUrl,
    demoVideoUrl: r.demoVideoUrl,
    chaptersHeading: r.chaptersHeading,
    isDefault: r.isDefault,
    status: r.status,
    sortOrder: r.sortOrder,
    chapterCount: r._count.chapters,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
