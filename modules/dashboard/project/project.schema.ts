// src/modules/project/project.schema.ts
import { z } from "zod";
import { isHttpUrl, isMediaUrl } from "@/utils/url";

export const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type PublishStatusType = (typeof PUBLISH_STATUSES)[number];

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
  name: z
    .string()
    .trim()
    .min(2, "Nama proyek minimal 2 karakter")
    .max(100, "Nama proyek maksimal 100 karakter"),
  short: z
    .string()
    .trim()
    .min(5, "Ringkasan proyek minimal 5 karakter")
    .max(255, "Ringkasan proyek maksimal 255 karakter"),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter"),
  features: z.array(z.string().trim()).default([]),
  stack: z.array(z.string().trim()).default([]),
  demoImageUrl: z
    .string()
    .trim()
    .max(500, "URL gambar maksimal 500 karakter")
    .refine(
      (v) => !v || isMediaUrl(v),
      "URL gambar harus berupa tautan http(s) atau path /uploads/..."
    )
    .nullable()
    .or(z.literal("")),
  demoVideoUrl: z
    .string()
    .trim()
    .max(500, "URL video maksimal 500 karakter")
    .url("URL video tidak valid")
    .refine(isHttpUrl, "URL video harus diawali http:// atau https://")
    .nullable()
    .or(z.literal("")),
  chaptersHeading: z
    .string()
    .trim()
    .max(150, "Judul bab maksimal 150 karakter")
    .nullable()
    .or(z.literal("")),
  isDefault: z.boolean().default(false),
  status: z.enum(PUBLISH_STATUSES).default("DRAFT"),
  sortOrder: z.number().int().min(0).default(0),
});

export type ProjectInput = z.output<typeof projectSchema>;

export type ProjectFormInput = {
  slug: string;
  name: string;
  short: string;
  description: string;
  features: string[];
  stack: string[];
  demoImageUrl: string;
  demoVideoUrl: string;
  chaptersHeading: string;
  isDefault: boolean;
  status: PublishStatusType;
  sortOrder: number;
};

export type ProjectRow = {
  uuid: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  features: string[];
  stack: string[];
  demoImageUrl: string | null;
  demoVideoUrl: string | null;
  chaptersHeading: string | null;
  isDefault: boolean;
  status: PublishStatusType;
  sortOrder: number;
  chapterCount?: number;
  updatedAt: Date;
};
