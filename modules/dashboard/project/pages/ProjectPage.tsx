// src/modules/project/pages/ProjectPage.tsx
import { FolderKanban } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import ProjectTable from "../components/ProjectTable";

export default async function ProjectPage() {
  await requirePageAccess("project", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderKanban}
        title="Proyek"
        description="Kelola portofolio proyek dan showcase aplikasi yang ditampilkan kepada publik."
        eyebrow="Portofolio"
      />
      <ProjectTable />
    </div>
  );
}
