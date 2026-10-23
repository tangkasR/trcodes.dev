import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getSession } from "@/lib/auth";
import { getMfaState } from "@/lib/mfa";
import SecurityPanel from "../components/SecurityPanel";
import SessionsPanel from "../components/SessionsPanel";
import { getActiveSessions } from "../security.queries";

export default async function SecurityPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [state, sessions] = await Promise.all([
    getMfaState(session.userUuid),
    getActiveSessions(session.userUuid, session.sessionUuid),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={KeyRound}
        title="Keamanan Akun"
        description="Lindungi akun dengan verifikasi dua langkah (TOTP), kode pemulihan, dan kontrol sesi perangkat."
        eyebrow="Akun"
      />
      <SecurityPanel
        email={session.email}
        enabled={state.enabled}
        recoveryCodesRemaining={state.recoveryCodesRemaining}
        isSuperAdmin={session.roleName === "Super Admin"}
      />
      <SessionsPanel sessions={sessions} />
    </div>
  );
}
