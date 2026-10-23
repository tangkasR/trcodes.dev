import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import { AppError } from "@/utils/errors";
import type { ContactLinkInput, ContactPlatform } from "./contact-link.schema";

type Db = Pick<Prisma.TransactionClient, "contactLink">;

function errorCode(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e
    ? String(e.code)
    : undefined;
}

// Memastikan platform belum digunakan.
async function assertContactNameAvailable(
  db: Db,
  platform: ContactPlatform,
  excludeUuid?: string
) {
  const exists = await db.contactLink.findFirst({
    where: {
      platform,
      ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
    },
    select: { uuid: true },
  });

  if (exists) {
    throw new AppError("Platform sudah dipakai", "platform");
  }
}

export async function createContactLink(input: ContactLinkInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      await assertContactNameAvailable(tx, input.platform);

      const contactLink = await tx.contactLink.create({
        data: {
          platform: input.platform,
          displayText: input.displayText,
          url: input.url,
          sortOrder: input.sortOrder,
          isVisible: input.isVisible,
        },
        select: { uuid: true },
      });

      return { uuid: contactLink.uuid };
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Platform sudah dipakai", "platform");
    }

    throw e;
  }
}

export async function updateContactLink(uuid: string, input: ContactLinkInput) {
  const contactLink = await prisma.contactLink.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!contactLink) {
    throw new AppError("Contact link tidak ditemukan");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await assertContactNameAvailable(tx, input.platform, uuid);

      await tx.contactLink.update({
        where: { uuid },
        data: {
          platform: input.platform,
          displayText: input.displayText,
          url: input.url,
          sortOrder: input.sortOrder,
          isVisible: input.isVisible,
        },
      });
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Platform sudah dipakai", "platform");
    }

    throw e;
  }
}

export async function deleteContactLink(uuid: string) {
  const contactLink = await prisma.contactLink.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!contactLink) {
    throw new AppError("Contact link tidak ditemukan");
  }

  await prisma.contactLink.delete({
    where: { uuid },
  });
}
