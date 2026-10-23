// src/modules/chapter/chapter.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { chapterSchema } from "./chapter.schema";
import {
  createChapter,
  deleteChapter,
  updateChapter,
} from "./chapter.service";

function refresh(projectUuid?: string) {
  if (projectUuid) {
    revalidatePath(`/dashboard/projects/${projectUuid}`);
  }
  revalidatePath("/dashboard/projects");
  revalidatePath("/", "layout");
}

export async function createChapterAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("chapter", "add");
    const data = parseInput(chapterSchema, input);
    const result = await createChapter(data);
    refresh(data.projectUuid);
    return result;
  }, "Bab berhasil ditambahkan");
}

export async function updateChapterAction(
  id: string,
  projectUuid: string,
  input: unknown
) {
  return handleAction(async () => {
    await requirePermission("chapter", "edit");
    const chapterUuid = parseInput(uuidSchema, id);
    const data = parseInput(chapterSchema, input);
    await updateChapter(chapterUuid, data);
    refresh(projectUuid);
  }, "Bab berhasil diperbarui");
}

export async function deleteChapterAction(id: string, projectUuid: string) {
  return handleAction(async () => {
    await requirePermission("chapter", "delete");
    const chapterUuid = parseInput(uuidSchema, id);
    await deleteChapter(chapterUuid);
    refresh(projectUuid);
  }, "Bab berhasil dihapus");
}
