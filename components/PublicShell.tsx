import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import type { Profile, Project } from "@/modules/public/home/home.schema";

export default function PublicShell({
  profile,
  projects,
  children,
}: {
  profile: Profile | null;
  projects: Project[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader brand={profile?.brand} />
      <main>{children}</main>
      <PublicFooter profile={profile} projects={projects} />
    </>
  );
}
