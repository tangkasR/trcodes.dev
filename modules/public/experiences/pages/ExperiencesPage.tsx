import PublicShell from "@/components/PublicShell";
import CertificationList from "../components/CertificationList";
import ExperienceList from "../components/ExperienceList";
import ProfileSection from "../components/ProfileSection";
import { getExperiencesPageData } from "../experiences.queries";

export default async function ExperiencesPage() {
  const {
    profile,
    projects,
    contacts,
    educations,
    experiences,
    certifications,
  } = await getExperiencesPageData();

  return (
    <PublicShell profile={profile} projects={projects}>
      <ProfileSection
        profile={profile}
        contacts={contacts}
        educations={educations}
      />
      <ExperienceList experiences={experiences} />
      <CertificationList certifications={certifications} />
    </PublicShell>
  );
}
