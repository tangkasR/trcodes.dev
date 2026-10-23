import { Suspense } from "react";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import ContactLinkPage from "@/modules/dashboard/contact-link/pages/ContactLinkPage";

export const instant = false;

export default function page() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <ContactLinkPage />
    </Suspense>
  );
}
