// src/app/(dashboard)/users/page.tsx
import { Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import { ROLE_SUPER_ADMIN } from "@/config";
import UserTable from "../components/UserTable";
import { getRoleOptions } from "../user.queries";

export default async function UsersPage() {
  const session = await requirePageAccess("user", "read");
  const actorIsSuperAdmin = session.roleName === ROLE_SUPER_ADMIN;
  const roles = await getRoleOptions(actorIsSuperAdmin);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Users"
        description="Kelola akun pengguna dan role-nya."
        eyebrow="Akses"
      />

      <UserTable roles={roles} currentUserUuid={session.userUuid} />
    </div>
  );
}
