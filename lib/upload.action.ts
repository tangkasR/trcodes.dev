"use server";

import { handleAction } from "@/utils/handle-action";
import { getSession } from "@/lib/auth";
import { UnauthorizedError, AppError } from "@/utils/errors";
import {
  saveUploadedImage,
  ALLOWED_UPLOAD_FOLDERS,
  type UploadFolder,
} from "./upload.service";

export async function uploadImageAction(formData: FormData) {
  return handleAction(async () => {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File) || file.size === 0) {
      throw new AppError("Silakan pilih file gambar untuk diunggah");
    }

    const rawFolder = formData.get("folder");
    const folder = (
      typeof rawFolder === "string" && ALLOWED_UPLOAD_FOLDERS.includes(rawFolder as UploadFolder)
        ? rawFolder
        : "projects"
    ) as UploadFolder;

    const result = await saveUploadedImage(file, folder);
    return result;
  }, "Gambar berhasil diunggah");
}
