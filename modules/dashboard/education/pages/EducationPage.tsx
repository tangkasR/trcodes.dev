// src/modules/education/pages/EducationPage.tsx
import { GraduationCap } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import EducationTable from "../components/EducationTable";

export default async function EducationPage() {
  await requirePageAccess("education", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Pendidikan"
        description="Kelola data riwayat pendidikan yang ditampilkan di portofolio."
        eyebrow="Portofolio"
      />
      <EducationTable />
    </div>
  );
}
