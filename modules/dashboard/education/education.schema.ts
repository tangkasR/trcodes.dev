import { z } from "zod";

export const educationSchema = z.object({
  school: z
    .string()
    .trim()
    .min(2, "Sekolah minimal 2 karakter")
    .max(100, "Sekolah maksimal 100 karakter"),
  major: z
    .string()
    .trim()
    .min(2, "Jurusan minimal 2 karakter")
    .max(100, "Jurusan maksimal 100 karakter"),
  startYear: z.number().int().min(0),
  endYear: z.number().int().min(0),
  sortOrder: z.number().int().min(0).nullable(),
});

export type EducationInput = z.output<typeof educationSchema>;

export type EducationFormInput = {
  school: string;
  major: string;
  startYear: number;
  endYear: number;
  sortOrder?: number;
};

export type EducationRow = {
  uuid: string;
  school: string;
  major: string;
  startYear: number;
  endYear: number;
  sortOrder?: number;
  updatedAt: Date;
};
