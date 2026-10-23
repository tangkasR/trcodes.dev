/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { imageUrl } from "@/utils/public-links";
import type { Profile } from "@/modules/public/home/home.schema";

export default function HomeHero({
  profile,
}: {
  profile: Profile | null;
}) {
  const taglineParts = (profile?.tagline ?? "").split(". ");
  const taglineHead = taglineParts[0] ?? "";
  const taglineTail = taglineParts.slice(1).join(". ");

  return (
    <section
      id="homepage"
      className="dots border-b-2 border-ink px-5 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <span className="sticker">{profile?.contentName}</span>
          <h1 className="mt-7 font-display text-[clamp(2.2rem,5.6vw,4.2rem)] font-extrabold leading-[1.1] tracking-tight">
            {taglineHead}
            {taglineTail ? "." : ""}{" "}
            {taglineTail && <span className="hl">{taglineTail}</span>}
          </h1>
          <p className="mt-6 max-w-xl text-xl">{profile?.intro}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#ngoding" className="btn">
              <i className="fa-solid fa-book-open" aria-hidden="true" />
              Mulai membaca
            </a>
            <Link href="/experiences" className="btn ghost">
              Kenalan dengan saya
            </Link>
          </div>
        </div>
        <figure className="mx-auto w-48 md:col-span-4 md:w-full md:max-w-60">
          <img
            src={imageUrl(profile?.photoUrl, "profile", 480, 600)}
            alt={`Foto ${profile?.fullName ?? "pemilik situs"}`}
            width={480}
            height={600}
            className="box photo aspect-4/5 w-full rotate-3 object-cover"
          />
          <figcaption className="mt-5 text-center font-display text-sm font-bold">
            {profile?.fullName}
            <br />
            <span className="font-semibold text-graphite">
              {profile?.title}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
