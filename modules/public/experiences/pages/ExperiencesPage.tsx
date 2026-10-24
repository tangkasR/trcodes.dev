import PublicShell from "@/components/PublicShell";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl } from "@/utils/site";
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

  const siteUrl = getSiteUrl();

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Pengalaman Kerja & Profil Tangkas Risdianto",
    url: `${siteUrl}/experiences`,
    about: {
      "@type": "Person",
      name: profile?.fullName ?? "Tangkas Risdianto",
      alternateName: [
        "Tangkas",
        "tangkas",
        "Risdianto",
        "risdianto",
        "Tangkas Risdianto",
        "tangkas risdianto",
        "tangkas Risdianto",
        "Tangkas risdianto",
        "trcodes",
        "trcodes.dev",
      ],
      jobTitle: [
        "Full Stack Developer",
        "Web Developer",
        "Full Stack Web Developer",
        "Software Engineer",
      ],
      description:
        "Tangkas Risdianto (tangkas risdianto) adalah Full Stack Developer dan Web Developer dengan rekam jejak arsitektur web modern Next.js, TypeScript, PostgreSQL, dan enterprise security.",
      knowsAbout: [
        "Full Stack Web Development",
        "Web Development",
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "PostgreSQL",
        "Prisma ORM",
        "Enterprise Security",
      ],
    },
  };

  return (
    <PublicShell profile={profile} projects={projects}>
      <JsonLd data={profilePageSchema} />
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
