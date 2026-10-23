// src/modules/user/user.service.ts
import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";
import { AppError, errorCode } from "@/utils/errors";
import { ROLE_SUPER_ADMIN } from "@/config";
import type { UserCreateInput, UserUpdateInput } from "./user.schema";

const COST = 12; // samakan dengan auth.service

// Siapa yang melakukan aksi (diisi oleh action dari session)
export type Actor = { userUuid: string; isSuperAdmin: boolean };

async function countSuperAdmins(tx: Prisma.TransactionClient) {
  return tx.user.count({ where: { role: { name: ROLE_SUPER_ADMIN } } });
}

export async function createUser(actor: Actor, input: UserCreateInput) {
  const role = await prisma.role.findUnique({
    where: { uuid: input.roleUuid },
    select: { name: true },
  });
  if (!role) throw new AppError("Role tidak ditemukan", "roleUuid");

  if (role.name === ROLE_SUPER_ADMIN && !actor.isSuperAdmin) {
    throw new AppError(
      "Hanya Super Admin yang dapat memberikan role Super Admin",
      "roleUuid"
    );
  }

  const exists = await prisma.user.findUnique({
    where: { email: input.email },
    select: { uuid: true },
  });
  if (exists) throw new AppError("Email sudah terdaftar", "email");

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        roleUuid: input.roleUuid,
        password: await bcrypt.hash(input.password, COST),
      },
      select: { uuid: true },
    });
    return { uuid: user.uuid };
  } catch (e) {
    // dua request bersamaan dengan email sama: ditolak oleh unique constraint
    if (errorCode(e) === "P2002")
      throw new AppError("Email sudah terdaftar", "email");
    throw e;
  }
}

export async function updateUser(
  actor: Actor,
  uuid: string,
  input: UserUpdateInput
) {
  // hash dihitung di luar transaksi supaya transaksi tidak menahan koneksi selama bcrypt berjalan
  const passwordHash = input.password
    ? await bcrypt.hash(input.password, COST)
    : undefined;

  try {
    return await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { uuid },
        select: {
          email: true,
          roleUuid: true,
          role: { select: { name: true } },
        },
      });
      if (!target) throw new AppError("User tidak ditemukan");

      const targetIsSuperAdmin = target.role.name === ROLE_SUPER_ADMIN;
      if (targetIsSuperAdmin && !actor.isSuperAdmin) {
        throw new AppError(
          "Hanya Super Admin yang dapat mengubah akun Super Admin"
        );
      }

      const newRole = await tx.role.findUnique({
        where: { uuid: input.roleUuid },
        select: { uuid: true, name: true },
      });
      if (!newRole) throw new AppError("Role tidak ditemukan", "roleUuid");

      if (newRole.uuid !== target.roleUuid) {
        if (uuid === actor.userUuid) {
          throw new AppError(
            "Kamu tidak dapat mengubah role akunmu sendiri",
            "roleUuid"
          );
        }
        if (newRole.name === ROLE_SUPER_ADMIN && !actor.isSuperAdmin) {
          throw new AppError(
            "Hanya Super Admin yang dapat memberikan role Super Admin",
            "roleUuid"
          );
        }
        // menurunkan Super Admin: pastikan masih ada Super Admin lain
        if (targetIsSuperAdmin && (await countSuperAdmins(tx)) <= 1) {
          throw new AppError(
            "Tidak dapat mengubah role Super Admin terakhir",
            "roleUuid"
          );
        }
      }

      const taken = await tx.user.findFirst({
        where: { email: input.email, uuid: { not: uuid } },
        select: { uuid: true },
      });
      if (taken) throw new AppError("Email sudah terdaftar", "email");

      // Ganti password, role, atau email mencabut semua sesi user tersebut untuk mencegah pembajakan/fiksasi sesi.
      const revokeSessions =
        Boolean(passwordHash) ||
        input.roleUuid !== target.roleUuid ||
        input.email !== target.email;

      if (revokeSessions) {
        await tx.userSession.deleteMany({ where: { userUuid: uuid } });
      }

      await tx.user.update({
        where: { uuid },
        data: {
          name: input.name,
          email: input.email,
          roleUuid: input.roleUuid,
          ...(revokeSessions
            ? { sessionVersion: { increment: 1 } }
            : {}),
          ...(passwordHash ? { password: passwordHash } : {}),
        },
      });

      return {
        passwordChanged: Boolean(passwordHash),
        roleChanged: input.roleUuid !== target.roleUuid,
        emailChanged: input.email !== target.email,
      };
    });
  } catch (e) {
    if (errorCode(e) === "P2002")
      throw new AppError("Email sudah terdaftar", "email");
    throw e;
  }
}

export async function deleteUser(actor: Actor, uuid: string) {
  if (uuid === actor.userUuid) {
    throw new AppError("Kamu tidak dapat menghapus akunmu sendiri");
  }

  return prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { uuid },
      select: {
        name: true,
        email: true,
        role: { select: { name: true } },
      },
    });
    if (!target) throw new AppError("User tidak ditemukan");

    if (target.role.name === ROLE_SUPER_ADMIN) {
      if (!actor.isSuperAdmin) {
        throw new AppError(
          "Hanya Super Admin yang dapat menghapus akun Super Admin"
        );
      }
      if ((await countSuperAdmins(tx)) <= 1) {
        throw new AppError("Super Admin terakhir tidak dapat dihapus");
      }
    }

    // note milik user ikut terhapus oleh onDelete: Cascade
    await tx.user.delete({ where: { uuid } });
    return { name: target.name, email: target.email };
  });
}
