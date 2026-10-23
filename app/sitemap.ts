import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const experiences = await prisma.experience.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    });

    for (const exp of experiences) {
      routes.push({
        url: `${siteUrl}/experiences/${exp.slug}`,
        lastModified: exp.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    const chapters = await prisma.chapter.findMany({
      where: {
        status: "PUBLISHED",
        project: { status: "PUBLISHED" },
      },
      select: {
        slug: true,
        updatedAt: true,
        project: { select: { slug: true } },
      },
    });

    for (const ch of chapters) {
      routes.push({
        url: `${siteUrl}/blog/${ch.project.slug}/${ch.slug}`,
        lastModified: ch.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (err) {
    console.error("Gagal membaca database untuk dynamic sitemap:", err);
  }

  return routes;
}
