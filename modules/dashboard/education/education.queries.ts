// src/modules/role/role.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { EducationRow } from "./education.schema";

export async function getEducations({ page, limit, q }: ListParams) {
  const where: Prisma.EducationWhereInput = q
    ? {
        OR: [
          { school: { contains: q, mode: "insensitive" } },
          { major: { contains: q, mode: "insensitive" } },
          { startYear: { equals: Number(q) } },
          { endYear: { equals: Number(q) } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.education.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: "asc" }, { uuid: "asc" }], // urutan stabil
      select: {
        uuid: true,
        school: true,
        major: true,
        startYear: true,
        endYear: true,
        sortOrder: true,
        updatedAt: true,
      },
    }),
    prisma.education.count({ where }),
  ]);

  const items: EducationRow[] = rows.map((r) => ({
    uuid: r.uuid,
    school: r.school,
    major: r.major,
    startYear: r.startYear,
    endYear: r.endYear || 0,
    sortOrder: r.sortOrder,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
