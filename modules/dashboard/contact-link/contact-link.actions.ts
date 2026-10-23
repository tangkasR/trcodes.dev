"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "@/utils/handle-action";
import { requirePermission } from "@/lib/auth";
import { parseInput, uuidSchema } from "@/utils/zod";

import { contactLinkSchema } from "./contact-link.schema";
import {
  createContactLink,
  deleteContactLink,
  updateContactLink,
} from "./contact-link.service";

function refresh() {
  revalidatePath("/dashboard/contact-links");
  revalidatePath("/", "layout");
}

export async function createContactLinkAction(input: unknown) {
  return handleAction(async () => {
    await requirePermission("contact-link", "add");
    const data = parseInput(contactLinkSchema, input);
    const result = await createContactLink(data);
    refresh();
    return result;
  }, "Kontak berhasil dibuat");
}

export async function updateContactLinkAction(id: string, input: unknown) {
  return handleAction(async () => {
    await requirePermission("contact-link", "edit");
    const contactLinkUuid = parseInput(uuidSchema, id);
    const data = parseInput(contactLinkSchema, input);
    await updateContactLink(contactLinkUuid, data);
    refresh();
  }, "Kontak berhasil diperbarui");
}

export async function deleteContactLinkAction(id: string) {
  return handleAction(async () => {
    await requirePermission("contact-link", "delete");
    const contactLinkUuid = parseInput(uuidSchema, id);
    await deleteContactLink(contactLinkUuid);
    refresh();
  }, "Kontak berhasil dihapus");
}
