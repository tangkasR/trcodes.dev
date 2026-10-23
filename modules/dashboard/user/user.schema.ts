// src/modules/user/user.schema.ts
import { z } from "zod";
import { uuidSchema } from "@/utils/zod";

const name = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter")
  .max(100, "Nama maksimal 100 karakter");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email tidak valid")
  .max(191, "Email terlalu panjang");

const roleUuid = z
  .string()
  .min(1, "Pilih role")
  .refine((v) => uuidSchema.safeParse(v).success, "Role tidak valid");

export const userCreateSchema = z.object({
  name,
  email,
  roleUuid,
  password: z
    .string()
    .min(12, "Password minimal 12 karakter")
    .max(72, "Password maksimal 72 karakter") // batas bcrypt
    .regex(/[A-Za-z]/, "Password harus mengandung huruf")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

// Saat edit: kosong = password tidak diubah
export const userUpdateSchema = z.object({
  name,
  email,
  roleUuid,
  password: z
    .string()
    .max(72, "Password maksimal 72 karakter")
    .optional()
    .refine((v) => !v || v.length >= 12, "Password minimal 12 karakter")
    .refine(
      (v) => !v || (/[A-Za-z]/.test(v) && /[0-9]/.test(v)),
      "Password harus mengandung huruf dan angka"
    )
    .transform((v) => (v ? v : undefined)),
});

export type UserCreateInput = z.output<typeof userCreateSchema>;
export type UserUpdateInput = z.output<typeof userUpdateSchema>;

// Bentuk yang dikirim dari form
export type UserFormInput = {
  name: string;
  email: string;
  password: string;
  roleUuid: string;
};

// Baris yang ditampilkan di tabel (tanpa password)
export type UserRow = {
  uuid: string;
  name: string;
  email: string;
  roleUuid: string;
  roleName: string;
  createdAt: Date;
  isSuperAdmin: boolean;
};

export type RoleOption = { uuid: string; name: string };
