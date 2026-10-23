import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import AuditLogPage from "@/modules/dashboard/audit-log/pages/AuditLogPage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <AuditLogPage />
    </Suspense>
  );
}
