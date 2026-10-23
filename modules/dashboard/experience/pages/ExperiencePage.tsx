// src/modules/experience/pages/ExperiencePage.tsx
import { Briefcase } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import ExperienceTable from "../components/ExperienceTable";

export default async function ExperiencePage() {
  await requirePageAccess("experience", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Briefcase}
        title="Pengalaman"
        description="Kelola riwayat pengalaman kerja yang ditampilkan di portofolio."
        eyebrow="Portofolio"
      />
      <ExperienceTable />
    </div>
  );
}
