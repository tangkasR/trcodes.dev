import { Suspense } from "react";
import type { Metadata } from "next";
import PublicPageSkeleton from "@/components/skeletons/PublicPageSkeleton";
import ExperienceDetailPage from "@/modules/public/experience-detail/pages/ExperienceDetailPage";
import { getExperienceDetailData } from "@/modules/public/experience-detail/experience-detail.queries";

type Params = { uuid: string };

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uuid } = await params;
  const data = await getExperienceDetailData(uuid);

  if (!data) return { title: "Pengalaman tidak ditemukan" };

  const title = `${data.experience.org} | Pengalaman kerja`;
  const description = data.experience.summary;
  const canonicalPath = `/experiences/${uuid}`;

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
      type: "profile",
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
      {params.then(({ uuid }) => (
        <ExperienceDetailPage slug={uuid} />
      ))}
    </Suspense>
  );
}
