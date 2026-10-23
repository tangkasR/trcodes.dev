import { z } from "zod";
import { isSafeLinkUrl } from "@/utils/url";

export const CONTACTPLATFORM = [
  "EMAIL",
  "WHATSAPP",
  "INSTAGRAM",
  "GITHUB",
  "LINKEDIN",
] as const;

export type ContactPlatform = (typeof CONTACTPLATFORM)[number];

export const contactLinkSchema = z.object({
  platform: z.enum(CONTACTPLATFORM),

  displayText: z
    .string()
    .trim()
    .min(2, "Display text minimal 2 karakter")
    .max(150, "Display text maksimal 150 karakter"),

  url: z
    .string()
    .trim()
    .min(2, "URL minimal 2 karakter")
    .max(500, "URL maksimal 500 karakter")
    .url("URL tidak valid")
    .refine(
      isSafeLinkUrl,
      "URL harus diawali http://, https://, atau mailto:"
    ),

  sortOrder: z.number().int().min(0),

  isVisible: z.boolean(),
});

export type ContactLinkInput = z.output<typeof contactLinkSchema>;

export type ContactLinkFormInput = {
  platform: ContactPlatform;
  displayText: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ContactLinkRow = {
  uuid: string;
  platform: ContactPlatform;
  displayText: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
  updatedAt: Date;
};
