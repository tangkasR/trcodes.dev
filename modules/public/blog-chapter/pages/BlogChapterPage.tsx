/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import JsonLd from "@/components/JsonLd";
import ProgressBar from "../components/ProgressBar";
import { getSiteUrl } from "@/utils/site";
import {
  chapterUrl,
  imageUrl,
} from "@/utils/public-links";
import type { Block, Chapter } from "@/modules/public/blog-chapter/chapter.schema";
import { getBlogChapterPageData } from "../blog-chapter.queries";

function defaultBlocks(c: Chapter): Block[] {
  return [
    { t: "h", x: "Apa itu" },
    { t: "p", x: c.what },
    { t: "h", x: "Cara saya memakainya" },
    { t: "p", x: c.use },
    { t: "quote", x: c.more },
    {
      t: "note",
      x: "Isi lengkap bab ini belum ditulis. Halaman ini menunjukkan tata letaknya. Bab Server Action di User Role Management adalah contoh yang terisi penuh.",
    },
  ];
}

export default async function BlogChapterPage({
  projectSlug,
  chapterSlug,
}: {
  projectSlug: string;
  chapterSlug: string;
}) {
  const data = await getBlogChapterPageData(projectSlug, chapterSlug);
  if (!data) notFound();

  const {
    project: P,
    chapter: c,
    index: i,
    total,
    prev,
    next,
    profile,
    projects,
  } = data;
  const blocks = c.content.length > 0 ? c.content : defaultBlocks(c);

  const siteUrl = getSiteUrl();
  const currentChapterUrl = `${siteUrl}/blog/${P.slug}/${c.slug}`;

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${c.title} — ${P.name}`,
    description: c.what,
    url: currentChapterUrl,
    inLanguage: "id",
    author: {
      "@type": "Person",
      name: profile?.fullName ?? "Tangkas Risdianto",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "trcodes.dev",
      url: siteUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: P.name,
        item: `${siteUrl}/#${P.hash}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.title,
        item: currentChapterUrl,
      },
    ],
  };

  let n = 0;
  const toc: [number, string][] = [];
  const body = blocks.map((b, idx) => {
    switch (b.t) {
      case "h":
        n++;
        toc.push([n, b.x]);
        return (
          <h2 key={idx} id={`s${n}`}>
            {b.x}
          </h2>
        );
      case "p":
        return <p key={idx}>{b.x}</p>;
      case "quote":
        return <blockquote key={idx}>{b.x}</blockquote>;
      case "code":
        return (
          <pre key={idx}>
            <code>{b.x}</code>
          </pre>
        );
      case "ul":
        return (
          <ul key={idx}>
            {b.x.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        );
      case "note":
        return (
          <p key={idx} className="note">
            {b.x}
          </p>
        );
    }
  });

  const words = blocks.reduce(
    (a, b) =>
      a + (Array.isArray(b.x) ? b.x.join(" ") : b.x).split(/\s+/).length,
    0
  );

  const side = (x: Chapter | undefined, label: string, right: boolean) => (
    <Link
      href={x ? chapterUrl(P.slug, x.slug) : `/#${P.hash}`}
      className={`box block p-5 transition-transform hover:-translate-y-1 ${
        right ? "md:text-right" : ""
      }`}
    >
      <span className="text-sm text-graphite">{label}</span>
      <span className="mt-1 block font-display text-xl font-extrabold leading-tight">
        {x ? x.title : right ? "Kembali ke daftar bab" : `Kembali ke ${P.name}`}
      </span>
    </Link>
  );

  return (
    <PublicShell profile={profile} projects={projects}>
      <JsonLd data={[techArticleSchema, breadcrumbSchema]} />
      <div className="px-5 py-14 md:px-10 md:py-20">
        <ProgressBar />
        <article className="mx-auto max-w-5xl">
        <nav aria-label="Jejak halaman" className="text-sm text-graphite">
          <Link className="underline underline-offset-4" href="/">
            Ngoding
          </Link>{" "}
          /{" "}
          <Link className="underline underline-offset-4" href={`/#${P.hash}`}>
            {P.name}
          </Link>
        </nav>
        <span className="kick mt-8">
          Bab {i + 1} dari {total}
        </span>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4rem)] font-extrabold leading-[1.1]">
          <span className="hl">{c.title}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-2xl leading-snug">{c.what}</p>
        <p className="mt-3 text-sm text-graphite">
          Membaca sekitar {Math.max(1, Math.round(words / 200))} menit
        </p>

        {/* Semantic Fact Box / Key Takeaways for Generative Engine Optimization (GEO) */}
        <section aria-label="Ringkasan Faktual" className="my-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 md:p-8">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ringkasan Teknis (Key Takeaways)</span>
          </div>
          <div className="mt-4 grid gap-4 text-base md:grid-cols-2">
            <div>
              <strong className="block text-ink font-semibold">Konsep Dasar:</strong>
              <p className="mt-1 text-graphite text-sm leading-relaxed">{c.what}</p>
            </div>
            <div>
              <strong className="block text-ink font-semibold">Penerapan Praktis:</strong>
              <p className="mt-1 text-graphite text-sm leading-relaxed">{c.use}</p>
            </div>
          </div>
          {c.more && (
            <div className="mt-4 border-t border-blue-500/10 pt-4">
              <strong className="block text-ink font-semibold">Catatan Kritis:</strong>
              <p className="mt-1 text-graphite text-sm leading-relaxed italic">{c.more}</p>
            </div>
          )}
        </section>

        <div className="mt-14 grid gap-14 md:grid-cols-12">
          <div className="prose min-w-0 md:col-span-8">{body}</div>
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <img
                src={imageUrl(c.img, c.slug, 800, 600)}
                alt={c.imgAlt}
                width={800}
                height={600}
                className="box photo aspect-4/3 w-full rotate-1 object-cover"
              />
              {toc.length > 0 && (
                <>
                  <h2 className="mt-8 font-display font-bold">Dalam bab ini</h2>
                  <ol className="lst">
                    {toc.map(([x, t]) => (
                      <li key={x}>
                        <a className="hover:underline" href={`#s${x}`}>
                          {t}
                        </a>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </aside>
        </div>

        <nav
          aria-label="Bab lainnya"
          className="mt-20 grid gap-5 md:grid-cols-2"
        >
          {side(prev, "Bab sebelumnya", false)}
          {side(next, "Bab berikutnya", true)}
        </nav>
        </article>
      </div>
    </PublicShell>
  );
}
