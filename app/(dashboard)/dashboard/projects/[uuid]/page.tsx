import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import ChapterPage from "@/modules/dashboard/chapter/pages/ChapterPage";

type Props = { params: Promise<{ uuid: string }> };

export const instant = false;

export default function page({ params }: Props) {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <ChapterPage params={params} />
    </Suspense>
  );
}
