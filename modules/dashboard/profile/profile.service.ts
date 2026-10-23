import "server-only";
import { prisma } from "@/lib/db";
import { AppError } from "@/utils/errors";
import type { ProfileInput } from "./profile.schema";

export async function createProfile(input: ProfileInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      // permission otomatis untuk semua feature, default semua false
      const profile = await tx.profile.create({
        data: {
          fullName: input.fullName,
          title: input.title,
          brand: input.brand,
          contentName: input.contentName,
          tagline: input.tagline,
          intro: input.intro,
          bio: input.bio,
          photoUrl: input.photoUrl,
        },
        select: { uuid: true },
      });

      return { id: profile.uuid };
    });
  } catch (e) {
    throw e;
  }
}

export async function updateProfile(uuid: string, input: ProfileInput) {
  const profile = await prisma.profile.findUnique({
    where: { uuid },
    select: { uuid: true },
  });
  if (!profile) throw new AppError("Profile tidak ditemukan");
  try {
    await prisma.profile.update({
      where: { uuid },
      data: {
        fullName: input.fullName,
        title: input.title,
        brand: input.brand,
        contentName: input.contentName,
        tagline: input.tagline,
        intro: input.intro,
        bio: input.bio,
        photoUrl: input.photoUrl,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function deleteProfile(uuid: string) {
  const profile = await prisma.profile.findUnique({
    where: { uuid },
    select: { uuid: true },
  });
  if (!profile) throw new AppError("Profile tidak ditemukan");
  try {
    await prisma.profile.delete({ where: { uuid } });
  } catch (e) {
    throw e;
  }
}
