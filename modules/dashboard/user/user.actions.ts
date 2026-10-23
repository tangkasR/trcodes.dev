// src/modules/user/user.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { ROLE_SUPER_ADMIN } from "@/config";
import { parseInput, uuidSchema } from "@/utils/zod";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

import { userCreateSchema, userUpdateSchema } from "./user.schema";
import { createUser, deleteUser, updateUser, type Actor } from "./user.service";

// Jumlah user per role tampil di /roles, dan nama user tampil di header
function refresh() {
  revalidatePath("/dashboard/users");
  revalidatePath("/", "layout");
}

function toActor(session: { userUuid: string; roleName: string }): Actor {
  return {
    userUuid: session.userUuid,
    isSuperAdmin: session.roleName === ROLE_SUPER_ADMIN,
  };
}

export async function createUserAction(input: unknown) {
  return handleAction(async () => {
    const session = await requirePermission("user", "add"); // 1. izin
    const data = parseInput(userCreateSchema, input); // 2. validasi
    const result = await createUser(toActor(session), data); // 3. service
    await recordAudit({
      actor: session,
      action: "user.create",
      targetType: "user",
      targetUuid: result.uuid,
      detail: `Membuat user ${data.email}`,
    });
    refresh(); // 4. revalidate
    return result;
  }, "Akun pengguna berhasil dibuat");
}

export async function updateUserAction(uuid: string, input: unknown) {
  return handleAction(async () => {
    const session = await requirePermission("user", "edit");
    const userUuid = parseInput(uuidSchema, uuid);
    const data = parseInput(userUpdateSchema, input);
    const changes = await updateUser(toActor(session), userUuid, data);
    await recordAudit({
      actor: session,
      action: "user.update",
      targetType: "user",
      targetUuid: userUuid,
      detail: [
        `Memperbarui user ${data.email}`,
        changes.passwordChanged ? "password diubah" : null,
        changes.roleChanged ? "role diubah" : null,
        changes.emailChanged ? "email diubah" : null,
      ]
        .filter(Boolean)
        .join("; "),
    });
    refresh();
  }, "Akun pengguna berhasil diperbarui");
}

export async function deleteUserAction(uuid: string) {
  return handleAction(async () => {
    const session = await requirePermission("user", "delete");
    const userUuid = parseInput(uuidSchema, uuid);
    const deleted = await deleteUser(toActor(session), userUuid);
    await recordAudit({
      actor: session,
      action: "user.delete",
      targetType: "user",
      targetUuid: userUuid,
      detail: `Menghapus user ${deleted.email}`,
    });
    refresh();
  }, "Akun pengguna berhasil dihapus");
}
