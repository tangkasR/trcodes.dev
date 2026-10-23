"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { profileSchema } from "./profile.schema";
import { createProfile, deleteProfile, updateProfile } from "./profile.service";

function refresh() {
  revalidatePath("/dashboard/profile");
  revalidatePath("/", "layout");
}

export async function createProfileAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("profile", "add");
    const data = parseInput(profileSchema, input);
    const result = await createProfile(data);
    refresh();
    return result;
  }, "Profil berhasil dibuat");
}

export async function updateProfileAction(uuid: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("profile", "edit");
    const profileUuid = parseInput(uuidSchema, uuid);
    const data = parseInput(profileSchema, input);
    await updateProfile(profileUuid, data);
    refresh();
  }, "Profil berhasil diperbarui");
}

export async function deleteProfileAction(uuid: string) {
  return handleAction(async () => {
    await requirePermission("profile", "delete");
    const profileUuid = parseInput(uuidSchema, uuid);
    await deleteProfile(profileUuid);
    refresh();
  }, "Profil berhasil dihapus");
}
