// src/modules/certification/certification.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { CertificationRow } from "./certification.schema";

export async function getCertifications({ page, limit, q }: ListParams) {
  const where: Prisma.CertificationWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { issuer: { contains: q, mode: "insensitive" } },
          { year: { equals: Number(q) || undefined } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.certification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { uuid: "asc" }],
      select: {
        uuid: true,
        title: true,
        issuer: true,
        year: true,
        credentialUrl: true,
        sortOrder: true,
        isVisible: true,
        updatedAt: true,
      },
    }),
    prisma.certification.count({ where }),
  ]);

  const items: CertificationRow[] = rows.map((r) => ({
    uuid: r.uuid,
    title: r.title,
    issuer: r.issuer,
    year: r.year,
    credentialUrl: r.credentialUrl,
    sortOrder: r.sortOrder,
    isVisible: r.isVisible,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
