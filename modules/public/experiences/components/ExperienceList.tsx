import Link from "next/link";
import type { Experience } from "@/modules/public/experiences/experience.schema";

export default function ExperienceList({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <section id="pengalaman" className="px-5 py-16 md:px-10">
      <div className="mx-auto max-w-5xl">
        <span className="kick">Tempat saya belajar</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
          Pengalaman kerja
        </h2>
        <p className="mt-3 max-w-xl text-graphite">
          {experiences.length} tempat yang membentuk cara saya ngoding. Klik
          salah satunya untuk membaca apa yang saya kerjakan di sana.
        </p>
        <ol className="mt-8 border-b-2 border-ink">
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <Link
                href={`/experiences/${experience.slug}`}
                className="group grid gap-x-10 gap-y-2 border-t-2 border-ink py-9 md:grid-cols-12 md:items-start"
              >
                <p className="font-display text-sm font-bold text-graphite md:col-span-3 md:pt-2">
                  {experience.period}
                </p>
                <div className="md:col-span-8">
                  <h3 className="font-display text-3xl font-extrabold leading-tight">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_3px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-size-[100%_3px]">
                      {experience.org}
                    </span>
                  </h3>
                  <p className="mt-1 font-display font-semibold">
                    {experience.role}
                  </p>
                  <p className="mt-3 max-w-xl text-graphite">
                    {experience.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-display text-sm font-bold">
                    Lihat detail pengalaman
                  </span>
                </div>
                <span
                  className="hidden size-12 place-items-center rounded-full border-2 border-ink transition-colors group-hover:bg-ink group-hover:text-paper md:col-span-1 md:grid md:justify-self-end"
                  aria-hidden="true"
                >
                  <i className="fa-solid fa-plus transition-transform duration-300 group-hover:rotate-90" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
