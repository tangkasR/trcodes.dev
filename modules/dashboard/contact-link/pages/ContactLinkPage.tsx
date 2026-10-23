import { ContactRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import ContactLinkTable from "../components/ContactLinkTable";

export default async function ContactLinkPage() {
  await requirePageAccess("contact-link", "read");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ContactRound}
        title="Kontak"
        description="Kelola tautan kontak yang ditampilkan di halaman publik."
        eyebrow="Portofolio"
      />
      <ContactLinkTable />
    </div>
  );
}
