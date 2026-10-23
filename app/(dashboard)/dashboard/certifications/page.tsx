import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import CertificationPage from "@/modules/dashboard/certification/pages/CertificationPage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <CertificationPage />
    </Suspense>
  );
}
