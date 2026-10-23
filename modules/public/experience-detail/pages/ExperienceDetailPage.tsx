import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import type { Experience } from "@/modules/public/experiences/experience.schema";
import { getExperienceDetailData } from "../experience-detail.queries";

const List = ({ items }: { items: string[] }) => (
  <ul className="lst">
    {items.map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);

export default async function ExperienceDetailPage({
  slug,
}: {
  slug: string;
}) {
  const data = await getExperienceDetailData(slug);
  if (!data) notFound();

  const { experience, newer, older, profile, projects } = data;

  const side = (
    item: Experience | undefined,
    label: string,
    right: boolean
  ) => (
    <Link
      href={item ? `/experiences/${item.slug}` : "/experiences#pengalaman"}
      className={`box block p-5 transition-transform hover:-translate-y-1 ${
        right ? "md:text-right" : ""
      }`}
    >
      <span className="text-sm text-graphite">{label}</span>
      <span className="mt-1 block font-display text-xl font-extrabold leading-tight">
        {item ? item.org : "Semua pengalaman kerja"}
      </span>
    </Link>
  );

  return (
    <PublicShell profile={profile} projects={projects}>
      <div className="px-5 py-14 md:px-10 md:py-20">
        <article className="mx-auto max-w-5xl">
        <nav aria-label="Jejak halaman" className="text-sm text-graphite">
          <Link className="underline underline-offset-4" href="/experiences">
            Informasi pribadi
          </Link>{" "}
          /{" "}
          <Link
            className="underline underline-offset-4"
            href="/experiences#pengalaman"
          >
            Pengalaman kerja
          </Link>{" "}
          / {experience.org}
        </nav>
        <span className="kick mt-8">{experience.period}</span>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4rem)] font-extrabold leading-[1.1]">
          <span className="hl">{experience.org}</span>
        </h1>
        <p className="mt-4 font-display text-xl font-bold">{experience.role}</p>
        <p className="mt-6 max-w-2xl text-2xl leading-snug">
          {experience.summary}
        </p>

        <div className="mt-14 grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-2xl font-extrabold">
              Yang saya kerjakan
            </h2>
            <List items={experience.duties} />
            <h2 className="mt-12 font-display text-2xl font-extrabold">
              Hasilnya
            </h2>
            <List items={experience.results} />
          </div>
          <aside className="md:col-span-5">
            <div className="box p-6">
              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-graphite">Peran</dt>
                  <dd className="font-display font-bold">{experience.role}</dd>
                </div>
                <div>
                  <dt className="text-sm text-graphite">Periode</dt>
                  <dd className="font-display font-bold">{experience.period}</dd>
                </div>
                <div>
                  <dt className="text-sm text-graphite">Teknologi</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {experience.stack.map((x) => (
                      <span key={x} className="chip">
                        {x}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        <nav
          aria-label="Pengalaman lainnya"
          className="mt-20 grid gap-5 md:grid-cols-2"
        >
          {side(newer, "Lebih baru", false)}
          {side(older, "Lebih lama", true)}
        </nav>
        </article>
      </div>
    </PublicShell>
  );
}
