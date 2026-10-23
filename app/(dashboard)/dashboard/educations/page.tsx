import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import EducationPage from "@/modules/dashboard/education/pages/EducationPage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <EducationPage />
    </Suspense>
  );
}
