// src/modules/certification/certification.service.ts
import "server-only";
import { prisma } from "@/lib/db";
import { AppError } from "@/utils/errors";
import type { CertificationInput } from "./certification.schema";

function errorCode(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as Record<string, unknown>).code)
    : undefined;
}

export async function createCertification(input: CertificationInput) {
  try {
    const certification = await prisma.certification.create({
      data: {
        title: input.title,
        issuer: input.issuer,
        year: input.year,
        credentialUrl: input.credentialUrl || null,
        sortOrder: input.sortOrder ?? 0,
        isVisible: input.isVisible,
      },
      select: { uuid: true },
    });

    return { uuid: certification.uuid };
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Data sertifikasi sudah ada");
    }
    throw e;
  }
}

export async function updateCertification(
  uuid: string,
  input: CertificationInput
) {
  const certification = await prisma.certification.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!certification) {
    throw new AppError("Sertifikasi tidak ditemukan");
  }

  try {
    await prisma.certification.update({
      where: { uuid },
      data: {
        title: input.title,
        issuer: input.issuer,
        year: input.year,
        credentialUrl: input.credentialUrl || null,
        sortOrder: input.sortOrder ?? 0,
        isVisible: input.isVisible,
      },
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Data sertifikasi sudah ada");
    }
    throw e;
  }
}

export async function deleteCertification(uuid: string) {
  const certification = await prisma.certification.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!certification) {
    throw new AppError("Sertifikasi tidak ditemukan");
  }

  await prisma.certification.delete({ where: { uuid } });
}
