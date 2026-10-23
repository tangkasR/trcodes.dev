import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import ExperiencePage from "@/modules/dashboard/experience/pages/ExperiencePage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <ExperiencePage />
    </Suspense>
  );
}
