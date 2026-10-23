import { ShieldCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import RoleTable from "../components/RoleTable";

export default async function RolesPage() {
  await requirePageAccess("role", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Hak Akses"
        description="Kelola peran dan atur izin fitur untuk setiap pengguna."
        eyebrow="Keamanan"
      />

      <RoleTable />
    </div>
  );
}
