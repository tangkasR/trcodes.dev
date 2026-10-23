// src/modules/experience/experience.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { experienceSchema } from "./experience.schema";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "./experience.service";

function refresh() {
  revalidatePath("/dashboard/experiences");
  revalidatePath("/", "layout");
}

export async function createExperienceAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("experience", "add");
    const data = parseInput(experienceSchema, input);
    const result = await createExperience(data);
    refresh();
    return result;
  }, "Pengalaman berhasil ditambahkan");
}

export async function updateExperienceAction(id: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("experience", "edit");
    const experienceUuid = parseInput(uuidSchema, id);
    const data = parseInput(experienceSchema, input);
    await updateExperience(experienceUuid, data);
    refresh();
  }, "Pengalaman berhasil diperbarui");
}

export async function deleteExperienceAction(id: string) {
  return handleAction(async () => {
    await requirePermission("experience", "delete");
    const experienceUuid = parseInput(uuidSchema, id);
    await deleteExperience(experienceUuid);
    refresh();
  }, "Pengalaman berhasil dihapus");
}
