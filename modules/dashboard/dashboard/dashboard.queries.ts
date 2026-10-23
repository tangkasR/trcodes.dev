import "server-only";
import { prisma } from "@/lib/db";

export type DashboardStats = {
  projects: {
    total: number;
    published: number;
    draft: number;
  };
  chaptersCount: number;
  users: {
    total: number;
  };
  experiencesCount: number;
  certificationsCount: number;
  recentAudits: Array<{
    uuid: string;
    action: string;
    actorName: string | null;
    targetType: string | null;
    detail: string | null;
    createdAt: Date;
  }>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalProjects,
    publishedProjects,
    chaptersCount,
    usersCount,
    experiencesCount,
    certificationsCount,
    recentAudits,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.chapter.count(),
    prisma.user.count(),
    prisma.experience.count(),
    prisma.certification.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        uuid: true,
        action: true,
        actorName: true,
        targetType: true,
        detail: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    projects: {
      total: totalProjects,
      published: publishedProjects,
      draft: totalProjects - publishedProjects,
    },
    chaptersCount,
    users: {
      total: usersCount,
    },
    experiencesCount,
    certificationsCount,
    recentAudits,
  };
}
