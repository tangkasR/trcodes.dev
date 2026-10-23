// src/modules/experience/experience.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { ExperienceRow } from "./experience.schema";

function toDateString(d: Date | null): string | null {
  if (!d) return null;
  return d.toISOString().split("T")[0];
}

export async function getExperiences({ page, limit, q }: ListParams) {
  const where: Prisma.ExperienceWhereInput = q
    ? {
        OR: [
          { organization: { contains: q, mode: "insensitive" } },
          { role: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.experience.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ startDate: "desc" }, { uuid: "asc" }],
      select: {
        uuid: true,
        slug: true,
        organization: true,
        role: true,
        startDate: true,
        endDate: true,
        summary: true,
        duties: true,
        results: true,
        stack: true,
        isVisible: true,
        updatedAt: true,
      },
    }),
    prisma.experience.count({ where }),
  ]);

  const items: ExperienceRow[] = rows.map((r) => ({
    uuid: r.uuid,
    slug: r.slug,
    organization: r.organization,
    role: r.role,
    startDate: toDateString(r.startDate) ?? "",
    endDate: toDateString(r.endDate),
    summary: r.summary,
    duties: r.duties,
    results: r.results,
    stack: r.stack,
    isVisible: r.isVisible,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
