import "server-only";
import { prisma } from "@/lib/db";
import { ProfileRow } from "./profile.schema";

export async function getProfile() {
  const row = await prisma.profile.findFirst({
    orderBy: [{ createdAt: "asc" }, { uuid: "asc" }], // urutan stabil
    select: {
      uuid: true,
      fullName: true,
      title: true,
      brand: true,
      contentName: true,
      tagline: true,
      intro: true,
      bio: true,
      photoUrl: true,
      updatedAt: true,
    },
  });
  if (!row) {
    return { profile: null };
  }
  const profile: ProfileRow = {
    uuid: row.uuid,
    fullName: row.fullName,
    title: row.title,
    brand: row.brand,
    contentName: row.contentName,
    tagline: row.tagline,
    intro: row.intro,
    bio: row.bio || "",
    photoUrl: row.photoUrl || "",
  };

  return { profile };
}
