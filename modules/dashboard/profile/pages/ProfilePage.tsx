import { UserRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import ProfileForm from "../components/ProfileForm";
import { getProfile } from "../profile.queries";

export default async function ProfilePage() {
  await requirePageAccess("profile", "read");
  const { profile } = await getProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserRound}
        title="Informasi Pribadi"
        description="Perbarui identitas, tagline, dan bio yang tampil di situs publik."
        eyebrow="Portofolio"
      />

      <ProfileForm profile={profile} />
    </div>
  );
}
