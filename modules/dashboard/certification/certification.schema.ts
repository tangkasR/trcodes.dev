import { z } from "zod";
import { isHttpUrl } from "@/utils/url";

export const certificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul minimal 2 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  issuer: z
    .string()
    .trim()
    .min(2, "Penerbit minimal 2 karakter")
    .max(150, "Penerbit maksimal 150 karakter"),
  year: z.number().int().min(1900).max(2100),
  credentialUrl: z
    .string()
    .trim()
    .max(500, "URL maksimal 500 karakter")
    .url("URL tidak valid")
    .refine(isHttpUrl, "URL harus diawali http:// atau https://")
    .nullable()
    .or(z.literal("")),
  sortOrder: z.number().int().min(0).nullable(),
  isVisible: z.boolean(),
});

export type CertificationInput = z.output<typeof certificationSchema>;

export type CertificationFormInput = {
  title: string;
  issuer: string;
  year: number;
  credentialUrl: string;
  sortOrder: number;
  isVisible: boolean;
};

export type CertificationRow = {
  uuid: string;
  title: string;
  issuer: string;
  year: number;
  credentialUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
  updatedAt: Date;
};
