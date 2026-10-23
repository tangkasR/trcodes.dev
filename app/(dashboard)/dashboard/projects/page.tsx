import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import ProjectPage from "@/modules/dashboard/project/pages/ProjectPage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <ProjectPage />
    </Suspense>
  );
}
