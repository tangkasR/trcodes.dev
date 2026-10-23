// src/modules/Profile/Profile.schema.ts
import { z } from "zod";
import { isMediaUrl } from "@/utils/url";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  title: z
    .string()
    .trim()
    .min(2, "Title minimal 2 karakter")
    .max(100, "Title maksimal 100 karakter"),
  brand: z
    .string()
    .trim()
    .min(2, "Brand minimal 2 karakter")
    .max(50, "Brand maksimal 50 karakter"),
  contentName: z
    .string()
    .trim()
    .min(2, "Content minimal 2 karakter")
    .max(100, "Content maksimal 100 karakter"),
  tagline: z
    .string()
    .trim()
    .min(2, "Tagline minimal 2 karakter")
    .max(150, "Tagline maksimal 150 karakter"),
  intro: z.string().trim(),
  bio: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  photoUrl: z
    .string()
    .trim()
    .max(500, "URL foto maksimal 500 karakter")
    .refine(
      (value) => !value || isMediaUrl(value),
      "URL foto harus berupa tautan http(s) atau path gambar /uploads/..."
    )
    .optional()
    .transform((v) => (v ? v : null)),
});

export type ProfileInput = z.output<typeof profileSchema>;

// Bentuk yang dikirim dari form
export type ProfileFormInput = {
  fullName: string;
  title: string;
  brand: string;
  contentName: string;
  tagline: string;
  intro: string;
  bio: string;
  photoUrl: string;
};

// Baris yang ditampilkan di tabel
export type ProfileRow = {
  uuid: string;
  fullName: string;
  title: string;
  brand: string;
  contentName: string;
  tagline: string;
  intro: string;
  bio: string;
  photoUrl: string;
};
