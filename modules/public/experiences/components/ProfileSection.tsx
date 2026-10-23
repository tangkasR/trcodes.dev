/* eslint-disable @next/next/no-img-element */
import { imageUrl } from "@/utils/public-links";
import { safeHref } from "@/utils/url";
import type { Contact, Education } from "@/modules/public/experiences/experience.schema";
import type { Profile } from "@/modules/public/home/home.schema";

export default function ProfileSection({
  profile,
  contacts,
  educations,
}: {
  profile: Profile | null;
  contacts: Contact[];
  educations: Education[];
}) {
  return (
    <section
      id="experience"
      className="dots border-b-2 border-ink px-5 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="kick">Informasi pribadi</span>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5.6vw,4.2rem)] font-extrabold leading-[1.1]">
            Halo, saya <span className="hl">{profile?.fullName}</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl">{profile?.intro}</p>
          <h2 className="mt-9 font-display font-bold">Hubungi saya</h2>
          <ul className="mt-3 grid gap-x-8 border-t-2 border-ink sm:grid-cols-2">
            {contacts.map((contact) => (
              <li key={contact.platform} className="border-b border-ink/20">
                <a
                  href={safeHref(contact.href)}
                  className="flex items-center justify-between gap-3 py-3 transition-all hover:pl-2"
                >
                  <span className="shrink-0 font-display font-bold">
                    <i
                      className={`${contact.icon} mr-3 w-5 text-center`}
                      aria-hidden="true"
                    />
                    {contact.name}
                  </span>
                  <span className="min-w-0 truncate text-sm text-graphite">
                    {contact.text}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <nav
            aria-label="Lompat ke bagian"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <span className="text-sm text-graphite">Lanjut ke</span>
            <a className="chip" href="#pengalaman">
              Pengalaman kerja
            </a>
            <a className="chip" href="#sertifikasi">
              Sertifikasi
            </a>
          </nav>
        </div>

        <aside className="md:col-span-5" aria-label="Kartu identitas">
          <div className="box -rotate-1 overflow-hidden">
            <div className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
              <span className="font-display text-sm font-bold">
                Kartu ngoding
              </span>
              <span className="text-sm italic text-ash">suka-suka</span>
            </div>
            <div className="flex items-center gap-5 p-5">
              <img
                src={imageUrl(profile?.photoUrl, "profile", 300, 300)}
                alt={`Foto ${profile?.fullName ?? "pemilik situs"}`}
                width={300}
                height={300}
                className="photo size-24 shrink-0 border-2 border-ink object-cover md:size-28"
              />
              <div>
                <p className="font-display text-xl font-extrabold leading-tight">
                  {profile?.fullName}
                </p>
                <p className="text-graphite">{profile?.title}</p>
              </div>
            </div>
            <dl className="divide-y divide-ink/20 border-t-2 border-ink px-5 text-base">
              <div className="py-3">
                <dt className="text-graphite">Pendidikan</dt>
                <dd>
                  <ol className="mt-1 space-y-2">
                    {educations.map((education) => (
                      <li key={education.school}>
                        <p className="font-display font-bold leading-tight">
                          {education.school}
                        </p>
                        <p className="text-sm text-graphite">
                          {education.major}, {education.years}
                        </p>
                      </li>
                    ))}
                  </ol>
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
