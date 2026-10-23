// src/modules/experience/experience.service.ts
import "server-only";
import { prisma } from "@/lib/db";
import { AppError } from "@/utils/errors";
import type { ExperienceInput } from "./experience.schema";

function errorCode(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as Record<string, unknown>).code)
    : undefined;
}

export async function createExperience(input: ExperienceInput) {
  try {
    const experience = await prisma.experience.create({
      data: {
        slug: input.slug,
        organization: input.organization,
        role: input.role,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        summary: input.summary,
        duties: input.duties,
        results: input.results,
        stack: input.stack,
        isVisible: input.isVisible,
      },
      select: { uuid: true },
    });

    return { uuid: experience.uuid };
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug pengalaman sudah digunakan, gunakan slug lain");
    }
    throw e;
  }
}

export async function updateExperience(uuid: string, input: ExperienceInput) {
  const experience = await prisma.experience.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!experience) {
    throw new AppError("Data pengalaman tidak ditemukan");
  }

  try {
    await prisma.experience.update({
      where: { uuid },
      data: {
        slug: input.slug,
        organization: input.organization,
        role: input.role,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        summary: input.summary,
        duties: input.duties,
        results: input.results,
        stack: input.stack,
        isVisible: input.isVisible,
      },
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug pengalaman sudah digunakan, gunakan slug lain");
    }
    throw e;
  }
}

export async function deleteExperience(uuid: string) {
  const experience = await prisma.experience.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!experience) {
    throw new AppError("Data pengalaman tidak ditemukan");
  }

  await prisma.experience.delete({
    where: { uuid },
  });
}
