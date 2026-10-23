import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";
import MfaPage from "@/modules/public/auth/pages/MfaPage";
import { readMfaChallenge } from "@/lib/auth";

async function MfaChallengePage() {
  const challenge = await readMfaChallenge();
  if (!challenge) redirect("/login");

  return <MfaPage email={challenge.email} />;
}

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <MfaChallengePage />
    </Suspense>
  );
}
