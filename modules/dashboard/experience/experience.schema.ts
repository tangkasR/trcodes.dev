// src/modules/experience/experience.schema.ts
import { z } from "zod";

export const experienceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
  organization: z
    .string()
    .trim()
    .min(2, "Nama organisasi/perusahaan minimal 2 karakter")
    .max(150, "Nama organisasi/perusahaan maksimal 150 karakter"),
  role: z
    .string()
    .trim()
    .min(2, "Posisi/peran minimal 2 karakter")
    .max(150, "Posisi/peran maksimal 150 karakter"),
  startDate: z
    .string()
    .min(1, "Tanggal mulai wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal mulai harus YYYY-MM-DD"),
  endDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal selesai harus YYYY-MM-DD")
    .nullable()
    .or(z.literal("")),
  summary: z
    .string()
    .trim()
    .min(5, "Ringkasan minimal 5 karakter")
    .max(500, "Ringkasan maksimal 500 karakter"),
  duties: z.array(z.string().trim()).default([]),
  results: z.array(z.string().trim()).default([]),
  stack: z.array(z.string().trim()).default([]),
  isVisible: z.boolean().default(true),
});

export type ExperienceInput = z.output<typeof experienceSchema>;

export type ExperienceFormInput = {
  slug: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  summary: string;
  duties: string[];
  results: string[];
  stack: string[];
  isVisible: boolean;
};

export type ExperienceRow = {
  uuid: string;
  slug: string;
  organization: string;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD or null
  summary: string;
  duties: string[];
  results: string[];
  stack: string[];
  isVisible: boolean;
  updatedAt: Date;
};
