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
    jobTitle: profile?.title ?? "Full Stack Developer",
    url: siteUrl,
    image: profile?.photoUrl ?? undefined,
    description: profile?.intro ?? undefined,
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "Full Stack Web Development",
      "Enterprise Application Security",
      "RESTful API & GraphQL",
      "Role-Based Access Control",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile?.brand ?? "trcodes.dev",
    url: siteUrl,
    description: profile?.tagline ?? "Ngoding apa saja. Menceritakan perjalanannya.",
    author: {
      "@type": "Person",
      name: profile?.fullName ?? "Tangkas Risdianto",
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
