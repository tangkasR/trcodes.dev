import { Suspense } from "react";
import type { Metadata } from "next";
import PublicPageSkeleton from "@/components/skeletons/PublicPageSkeleton";
import BlogChapterPage from "@/modules/public/blog-chapter/pages/BlogChapterPage";
import { getBlogChapterPageData } from "@/modules/public/blog-chapter/blog-chapter.queries";

type Params = { project: string; bab: string };

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { project, bab } = await params;
  const data = await getBlogChapterPageData(project, bab);

  if (!data) return { title: "Bab tidak ditemukan" };

  const title = `${data.chapter.title} | ${data.project.name}`;
  const description = data.chapter.what;
  const canonicalPath = `/blog/${project}/${bab}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<PublicPageSkeleton />}>
      {params.then(({ project, bab }) => (
        <BlogChapterPage projectSlug={project} chapterSlug={bab} />
      ))}
    </Suspense>
  );
}
