import Link from "next/link";
import Image from "next/image";
import { chapterUrl } from "@/utils/public-links";
import type { Profile, Project } from "@/modules/public/home/home.schema";

export default function PublicFooter({
  profile,
  projects,
}: {
  profile: Profile | null;
  projects: Project[];
}) {
  return (
    <footer className="inv bg-ink px-5 py-16 text-paper md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border-2 border-white/20 bg-paper p-1.5 shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                <Image
                  src="/imglogo.png"
                  alt="trcodes logo"
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                />
              </span>
              <p className="font-display text-2xl font-extrabold">
                {profile?.contentName ?? "trcodes.dev"}
              </p>
            </div>
            <p className="mt-4 text-ash">
              {profile?.tagline} Oleh {profile?.fullName}.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display font-bold">Jelajahi</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link className="hover:underline" href="/">
                  Ngoding
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/experiences">
                  Informasi Pribadi
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5">
            <h2 className="font-display font-bold">Ngodingan dan bacaan</h2>
            <ul className="mt-3 space-y-4">
              {projects.map((p) => (
                <li key={p.slug}>
                  {/* <a> biasa supaya hashchange terpicu saat sudah di beranda */}
                  <a
                    href={`/#${p.hash}`}
                    className="font-display font-bold hover:underline"
                  >
                    {p.name}
                  </a>
                  <ul className="mt-1 flex flex-wrap gap-x-4 text-sm text-ash">
                    {p.chapters.map((c) => (
                      <li key={c.slug}>
                        <Link
                          className="hover:text-white hover:underline"
                          href={chapterUrl(p.slug, c.slug)}
                        >
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 border-t border-white/25 pt-6 text-sm text-ash">
          {profile?.brand ?? "trcodes.dev"}, 2026
        </p>
      </div>
    </footer>
  );
}
