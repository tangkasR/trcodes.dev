// src/modules/project/project.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { projectSchema } from "./project.schema";
import {
  createProject,
  deleteProject,
  updateProject,
} from "./project.service";

function refresh() {
  revalidatePath("/dashboard/projects");
  revalidatePath("/", "layout");
}

export async function createProjectAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("project", "add");
    const data = parseInput(projectSchema, input);
    const result = await createProject(data);
    refresh();
    return result;
  }, "Proyek berhasil ditambahkan");
}

export async function updateProjectAction(id: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("project", "edit");
    const projectUuid = parseInput(uuidSchema, id);
    const data = parseInput(projectSchema, input);
    await updateProject(projectUuid, data);
    refresh();
  }, "Proyek berhasil diperbarui");
}

export async function deleteProjectAction(id: string) {
  return handleAction(async () => {
    await requirePermission("project", "delete");
    const projectUuid = parseInput(uuidSchema, id);
    await deleteProject(projectUuid);
    refresh();
  }, "Proyek berhasil dihapus");
}
