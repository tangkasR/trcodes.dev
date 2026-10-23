// src/modules/role/role.queries.ts
import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ListParams } from "@/utils/zod";
import type { ContactLinkRow } from "./contact-link.schema";
import { ContactPlatform } from "@/app/generated/prisma/client";

function isContactPlatform(value: string): value is ContactPlatform {
  return Object.values(ContactPlatform).includes(value as ContactPlatform);
}

export async function getContactLinks({ page, limit, q }: ListParams) {
  const where: Prisma.ContactLinkWhereInput = q
    ? {
        OR: [
          { platform: isContactPlatform(q) ? q : undefined },
          { displayText: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.contactLink.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: "asc" }, { uuid: "asc" }], // urutan stabil
      select: {
        uuid: true,
        platform: true,
        displayText: true,
        url: true,
        sortOrder: true,
        isVisible: true,
        updatedAt: true,
      },
    }),
    prisma.contactLink.count({ where }),
  ]);

  const items: ContactLinkRow[] = rows.map((r) => ({
    uuid: r.uuid,
    platform: r.platform,
    displayText: r.displayText,
    url: r.url,
    sortOrder: r.sortOrder,
    isVisible: r.isVisible,
    updatedAt: r.updatedAt,
  }));

  return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
