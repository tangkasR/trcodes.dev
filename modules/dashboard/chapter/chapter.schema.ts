// src/modules/chapter/chapter.schema.ts
import { z } from "zod";
import { isMediaUrl } from "@/utils/url";
import { PUBLISH_STATUSES, type PublishStatusType } from "../project/project.schema";

export const blockSchema = z.union([
  z.object({
    t: z.enum(["h", "p", "quote", "code", "note"]),
    x: z.string(),
  }),
  z.object({
    t: z.literal("ul"),
    x: z.array(z.string()),
  }),
]);

export type Block = z.infer<typeof blockSchema>;

export const chapterSchema = z.object({
  projectUuid: z.string().uuid("ID proyek tidak valid"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
  title: z
    .string()
    .trim()
    .min(2, "Judul bab minimal 2 karakter")
    .max(150, "Judul bab maksimal 150 karakter"),
  icon: z
    .string()
    .trim()
    .min(1, "Icon wajib diisi")
    .max(50, "Icon maksimal 50 karakter"),
  definition: z
    .string()
    .trim()
    .min(5, "Definisi 'Apa itu' minimal 5 karakter"),
  application: z
    .string()
    .trim()
    .min(5, "Penerapan 'Cara saya memakainya' minimal 5 karakter"),
  teaser: z
    .string()
    .trim()
    .nullable()
    .or(z.literal("")),
  coverUrl: z
    .string()
    .trim()
    .max(500, "URL cover maksimal 500 karakter")
    .refine(
      (v) => !v || isMediaUrl(v),
      "URL cover harus berupa tautan http(s) atau path /uploads/..."
    )
    .nullable()
    .or(z.literal("")),
  coverAlt: z
    .string()
    .trim()
    .max(255, "Alt cover maksimal 255 karakter")
    .nullable()
    .or(z.literal("")),
  content: z.array(blockSchema).default([]),
  status: z.enum(PUBLISH_STATUSES).default("DRAFT"),
  sortOrder: z.number().int().min(0).default(0),
  publishedAt: z
    .string()
    .datetime()
    .nullable()
    .or(z.literal("")),
});

export type ChapterInput = z.output<typeof chapterSchema>;

export type ChapterFormInput = {
  projectUuid: string;
  slug: string;
  title: string;
  icon: string;
  definition: string;
  application: string;
  teaser: string;
  coverUrl: string;
  coverAlt: string;
  content: Block[];
  status: PublishStatusType;
  sortOrder: number;
};

export type ChapterRow = {
  uuid: string;
  projectUuid: string;
  slug: string;
  title: string;
  icon: string;
  definition: string;
  application: string;
  teaser: string | null;
  coverUrl: string | null;
  coverAlt: string | null;
  content: Block[];
  status: PublishStatusType;
  sortOrder: number;
  publishedAt: Date | null;
  updatedAt: Date;
};
