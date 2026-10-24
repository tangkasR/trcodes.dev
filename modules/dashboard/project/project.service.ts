// src/modules/project/project.service.ts
import "server-only";
import { prisma } from "@/lib/db";
import { AppError, errorCode } from "@/utils/errors";
import type { ProjectInput } from "./project.schema";

export async function createProject(input: ProjectInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Jika isDefault = true, jadikan project lain isDefault = false
      if (input.isDefault) {
        await tx.project.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const project = await tx.project.create({
        data: {
          slug: input.slug,
          name: input.name,
          short: input.short,
          description: input.description,
          features: input.features,
          stack: input.stack,
          demoImageUrl: input.demoImageUrl || null,
          demoVideoUrl: input.demoVideoUrl || null,
          chaptersHeading: input.chaptersHeading || null,
          isDefault: input.isDefault,
          status: input.status,
          sortOrder: input.sortOrder ?? 0,
        },
        select: { uuid: true },
      });

      return { uuid: project.uuid };
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug proyek sudah digunakan, silakan gunakan slug lain");
    }
    throw e;
  }
}

export async function updateProject(uuid: string, input: ProjectInput) {
  const project = await prisma.project.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!project) {
    throw new AppError("Data proyek tidak ditemukan");
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.project.updateMany({
          where: { isDefault: true, NOT: { uuid } },
          data: { isDefault: false },
        });
      }

      await tx.project.update({
        where: { uuid },
        data: {
          slug: input.slug,
          name: input.name,
          short: input.short,
          description: input.description,
          features: input.features,
          stack: input.stack,
          demoImageUrl: input.demoImageUrl || null,
          demoVideoUrl: input.demoVideoUrl || null,
          chaptersHeading: input.chaptersHeading || null,
          isDefault: input.isDefault,
          status: input.status,
          sortOrder: input.sortOrder ?? 0,
        },
      });
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug proyek sudah digunakan, silakan gunakan slug lain");
    }
    throw e;
  }
}

export async function deleteProject(uuid: string) {
  const project = await prisma.project.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!project) {
    throw new AppError("Data proyek tidak ditemukan");
  }

  await prisma.project.delete({
    where: { uuid },
  });
}
