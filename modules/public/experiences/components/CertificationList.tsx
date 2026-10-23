import type { Certification } from "@/modules/public/experiences/experience.schema";

export default function CertificationList({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <section
      id="sertifikasi"
      className="border-t-2 border-ink px-5 py-16 md:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <span className="kick">Belajar tanpa henti</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
          Sertifikasi
        </h2>
        <p className="mt-3 text-graphite">
          Kelas dan pelatihan yang pernah saya ikuti.
        </p>
        <ul className="mt-8 grid gap-x-14 border-t-2 border-ink md:grid-cols-2">
          {certifications.map((certification) => (
            <li
              key={`${certification.title}-${certification.year}`}
              className="flex items-end gap-3 border-b border-ink/20 py-4"
            >
              <div className="min-w-0">
                <p className="font-display font-bold leading-tight">
                  {certification.title}
                </p>
                <p className="text-sm text-graphite">{certification.issuer}</p>
              </div>
              <span
                className="mb-2 min-w-4 flex-1 border-b border-dotted border-ink/50"
                aria-hidden="true"
              />
              <span className="font-display text-xl font-extrabold">
                {certification.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
