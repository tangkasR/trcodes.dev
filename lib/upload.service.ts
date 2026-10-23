import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { AppError } from "@/utils/errors";

export const ALLOWED_UPLOAD_FOLDERS = ["profile", "projects", "chapters"] as const;
export type UploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveUploadedImage(
  file: File,
  folder: UploadFolder
): Promise<{ url: string; size: number }> {
  if (!ALLOWED_UPLOAD_FOLDERS.includes(folder)) {
    throw new AppError("Folder penyimpanan tidak valid");
  }

  if (!file || !(file instanceof File)) {
    throw new AppError("File tidak ditemukan atau format tidak valid");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError("Ukuran file maksimal adalah 5 MB");
  }

  const mime = file.type.toLowerCase();
  const extension = ALLOWED_MIME_TYPES[mime];
  if (!extension) {
    throw new AppError(
      "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF."
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validasi magic bytes header file untuk mencegah spoofing MIME
  if (mime === "image/jpeg" && (buffer[0] !== 0xff || buffer[1] !== 0xd8)) {
    throw new AppError("File gambar JPEG tidak valid atau rusak");
  }
  if (
    mime === "image/png" &&
    (buffer[0] !== 0x89 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x4e ||
      buffer[3] !== 0x47)
  ) {
    throw new AppError("File gambar PNG tidak valid atau rusak");
  }
  if (mime === "image/gif" && buffer.subarray(0, 3).toString() !== "GIF") {
    throw new AppError("File gambar GIF tidak valid atau rusak");
  }
  if (mime === "image/webp" && buffer.subarray(8, 12).toString() !== "WEBP") {
    throw new AppError("File gambar WEBP tidak valid atau rusak");
  }

  const filename = `${randomUUID()}${extension}`;
  const targetDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(targetDir, { recursive: true });

  const filePath = join(targetDir, filename);
  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${filename}`;
  return { url: publicUrl, size: file.size };
}
