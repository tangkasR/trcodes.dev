import PublicShell from "@/components/PublicShell";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl } from "@/utils/site";
import HomeHero from "../components/HomeHero";
import ProjectExplorer from "../components/ProjectExplorer";
import { getHomePageData } from "../home.queries";

export default async function HomePage() {
  const { profile, projects } = await getHomePageData();
  const siteUrl = getSiteUrl();

  const personSchema = {
    "@context": "https://schema.org",
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
      "Web Engineer",
    ],
    url: siteUrl,
    image: profile?.photoUrl ? `${siteUrl}/imglogo.png` : `${siteUrl}/imglogo.png`,
    description:
      profile?.intro ??
      "Tangkas Risdianto (tangkas risdianto) adalah Full Stack Developer dan Web Developer spesialis arsitektur modern Next.js, TypeScript, PostgreSQL, Prisma, dan sistem enterprise.",
    knowsAbout: [
      "Full Stack Web Development",
      "Web Development",
      "Frontend Development",
      "Backend Development",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Prisma ORM",
      "Tailwind CSS",
      "Enterprise Application Security",
      "Role-Based Access Control (RBAC)",
      "RESTful API & GraphQL",
      "Clean Architecture",
      "Docker",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "trcodes.dev — Tangkas Risdianto | Full Stack Developer & Web Developer",
    alternateName: [
      "Tangkas Risdianto",
      "tangkas risdianto",
      "Tangkas",
      "tangkas",
      "Risdianto",
      "risdianto",
      "trcodes",
      "trcodes.dev",
    ],
    url: siteUrl,
    description:
      profile?.tagline ??
      "Portfolio dan dokumentasi arsitektur web Tangkas Risdianto (tangkas risdianto) — Full Stack Developer & Web Developer.",
    author: {
      "@type": "Person",
      name: "Tangkas Risdianto",
    },
  };

  return (
    <PublicShell profile={profile} projects={projects}>
      <JsonLd data={[personSchema, websiteSchema]} />
      <HomeHero profile={profile} />

      {projects.length > 0 ? (
        <ProjectExplorer projects={projects} brand={profile?.brand} />
      ) : (
        <section className="px-5 py-16 md:px-10">
          <p className="mx-auto max-w-5xl text-graphite">
            Belum ada ngodingan yang dipublikasikan.
          </p>
        </section>
      )}
    </PublicShell>
  );
}
