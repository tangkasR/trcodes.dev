// src/modules/chapter/chapter.service.ts
import "server-only";
import { prisma } from "@/lib/db";
import { AppError } from "@/utils/errors";
import type { ChapterInput } from "./chapter.schema";
import type { Prisma } from "@/app/generated/prisma/client";

function errorCode(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as Record<string, unknown>).code)
    : undefined;
}

export async function createChapter(input: ChapterInput) {
  try {
    const publishedAt =
      input.status === "PUBLISHED"
        ? input.publishedAt
          ? new Date(input.publishedAt)
          : new Date()
        : null;

    const chapter = await prisma.chapter.create({
      data: {
        projectUuid: input.projectUuid,
        slug: input.slug,
        title: input.title,
        icon: input.icon,
        definition: input.definition,
        application: input.application,
        teaser: input.teaser || null,
        coverUrl: input.coverUrl || null,
        coverAlt: input.coverAlt || null,
        content: input.content as unknown as Prisma.InputJsonValue,
        status: input.status,
        sortOrder: input.sortOrder ?? 0,
        publishedAt,
      },
      select: { uuid: true },
    });

    return { uuid: chapter.uuid };
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug bab sudah digunakan di dalam proyek ini, gunakan slug lain");
    }
    throw e;
  }
}

export async function updateChapter(uuid: string, input: ChapterInput) {
  const existing = await prisma.chapter.findUnique({
    where: { uuid },
    select: { uuid: true, publishedAt: true },
  });

  if (!existing) {
    throw new AppError("Bab tidak ditemukan");
  }

  try {
    const publishedAt =
      input.status === "PUBLISHED"
        ? existing.publishedAt ?? new Date()
        : null;

    await prisma.chapter.update({
      where: { uuid },
      data: {
        slug: input.slug,
        title: input.title,
        icon: input.icon,
        definition: input.definition,
        application: input.application,
        teaser: input.teaser || null,
        coverUrl: input.coverUrl || null,
        coverAlt: input.coverAlt || null,
        content: input.content as unknown as Prisma.InputJsonValue,
        status: input.status,
        sortOrder: input.sortOrder ?? 0,
        publishedAt,
      },
    });
  } catch (e) {
    if (errorCode(e) === "P2002") {
      throw new AppError("Slug bab sudah digunakan di dalam proyek ini, gunakan slug lain");
    }
    throw e;
  }
}

export async function deleteChapter(uuid: string) {
  const chapter = await prisma.chapter.findUnique({
    where: { uuid },
    select: { uuid: true },
  });

  if (!chapter) {
    throw new AppError("Bab tidak ditemukan");
  }

  await prisma.chapter.delete({
    where: { uuid },
  });
}
