// src/modules/education/education.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { educationSchema } from "./education.schema";
import {
  createEducation,
  deleteEducation,
  updateEducation,
} from "./education.service";

function refresh() {
  revalidatePath("/dashboard/educations");
  revalidatePath("/", "layout");
}

export async function createEducationAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("education", "add");
    const data = parseInput(educationSchema, input);
    const result = await createEducation(data);
    refresh();
    return result;
  }, "Data pendidikan berhasil ditambahkan");
}

export async function updateEducationAction(id: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("education", "edit");
    const educationUuid = parseInput(uuidSchema, id);
    const data = parseInput(educationSchema, input);
    await updateEducation(educationUuid, data);
    refresh();
  }, "Data pendidikan berhasil diperbarui");
}

export async function deleteEducationAction(id: string) {
  return handleAction(async () => {
    await requirePermission("education", "delete");
    const educationUuid = parseInput(uuidSchema, id);
    await deleteEducation(educationUuid);
    refresh();
  }, "Data pendidikan berhasil dihapus");
}
