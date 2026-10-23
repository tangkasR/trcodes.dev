import "server-only";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";

export type UserRecord = {
  uuid: string;
  name: string;
  email: string;
  roleUuid: string;
  sessionVersion: number;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: {
    uuid: string;
    name: string;
  };
};

export interface IUserRepository {
  findById(uuid: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  count(where?: Prisma.UserWhereInput): Promise<number>;
}

export class PrismaUserRepository implements IUserRepository {
  async findById(uuid: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        name: true,
        email: true,
        roleUuid: true,
        sessionVersion: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        uuid: true,
        name: true,
        email: true,
        roleUuid: true,
        sessionVersion: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }
}

export const userRepository: IUserRepository = new PrismaUserRepository();
