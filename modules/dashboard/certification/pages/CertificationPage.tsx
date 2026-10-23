// src/modules/certification/pages/CertificationPage.tsx
import { Award } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import CertificationTable from "../components/CertificationTable";

export default async function CertificationPage() {
  await requirePageAccess("certification", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Award}
        title="Sertifikasi"
        description="Kelola data sertifikasi yang ditampilkan di portofolio."
        eyebrow="Portofolio"
      />
      <CertificationTable />
    </div>
  );
}
