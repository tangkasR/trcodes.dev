import { Suspense } from "react";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";
import LoginPage from "@/modules/public/auth/pages/LoginPage";

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginPage />
    </Suspense>
  );
}
