// src/modules/education/education.service.ts
import "server-only";
import { prisma } from "@/lib/db";
import { AppError, errorCode } from "@/utils/errors";
import type { EducationInput } from "./education.schema";

export async function createEducation(input: EducationInput) {
  try {
    const education = await prisma.education.create({
      data: {
        school: input.school,
        major: input.major,
        startYear: input.startYear,
        endYear: input.endYear || null,
        sortOrder: input.sortOrder ?? 0,
      },
      select: { uuid: true },
    });

    return { uuid: education.uuid };
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Data pendidikan sudah ada");
    }
    throw e;
  }
}

export async function updateEducation(uuid: string, input: EducationInput) {
  const education = await prisma.education.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!education) {
    throw new AppError("Data pendidikan tidak ditemukan");
  }

  try {
    await prisma.education.update({
      where: { uuid },
      data: {
        school: input.school,
        major: input.major,
        startYear: input.startYear,
        endYear: input.endYear || null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Data pendidikan sudah ada");
    }
    throw e;
  }
}

export async function deleteEducation(uuid: string) {
  const education = await prisma.education.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!education) {
    throw new AppError("Data pendidikan tidak ditemukan");
  }

  await prisma.education.delete({
    where: { uuid },
  });
}
