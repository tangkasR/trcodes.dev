// src/modules/certification/certification.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { certificationSchema } from "./certification.schema";
import {
  createCertification,
  deleteCertification,
  updateCertification,
} from "./certification.service";

function refresh() {
  revalidatePath("/dashboard/certifications");
  revalidatePath("/", "layout");
}

export async function createCertificationAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("certification", "add");
    const data = parseInput(certificationSchema, input);
    const result = await createCertification(data);
    refresh();
    return result;
  }, "Sertifikasi berhasil ditambahkan");
}

export async function updateCertificationAction(id: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("certification", "edit");
    const certificationUuid = parseInput(uuidSchema, id);
    const data = parseInput(certificationSchema, input);
    await updateCertification(certificationUuid, data);
    refresh();
  }, "Sertifikasi berhasil diperbarui");
}

export async function deleteCertificationAction(id: string) {
  return handleAction(async () => {
    await requirePermission("certification", "delete");
    const certificationUuid = parseInput(uuidSchema, id);
    await deleteCertification(certificationUuid);
    refresh();
  }, "Sertifikasi berhasil dihapus");
}
