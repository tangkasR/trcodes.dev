import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import ProfilePage from "@/modules/dashboard/profile/pages/ProfilePage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}
