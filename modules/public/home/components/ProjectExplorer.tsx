/* eslint-disable react-hooks/set-state-in-effect */
"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  chapterUrl,
  imageUrl,
} from "@/utils/public-links";
import { safeHttpUrl } from "@/utils/url";
import type { Project } from "@/modules/public/home/home.schema";

function DemoFigure({ p }: { p: Project }) {
  const poster = imageUrl(p.demo.img, p.slug, 960, 540);
  const video = safeHttpUrl(p.demo.video);
  return (
    <figure className="md:col-span-5">
      <div className="box relative aspect-video overflow-hidden">
        {video ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster}
            className="size-full object-cover"
          >
            <source src={video} />
          </video>
        ) : (
          <>
            <img
              src={poster}
              alt={`Cuplikan layar ${p.name} (sementara)`}
              width={960}
              height={540}
              className="photo size-full object-cover"
            />
            <span
              className="absolute inset-0 grid place-items-center"
              aria-hidden="true"
            >
              <span className="grid size-16 place-items-center rounded-full border-2 border-ink bg-paper">
                <i className="fa-solid fa-play ml-1" />
              </span>
            </span>
          </>
        )}
      </div>
      <figcaption className="mt-5 text-sm text-graphite">
        Demo singkat {p.name}.
        {video ? "" : " Sementara berupa gambar, nanti diganti video."}
      </figcaption>
    </figure>
  );
}

export default function ProjectExplorer({
  projects,
  brand,
}: {
  projects: Project[];
  brand?: string;
}) {
  const bySlug = Object.fromEntries(
    projects.map((project) => [project.slug, project])
  );
  const ids = projects.map((project) => project.slug);
  const defaultId =
    projects.find((project) => project.isDefault)?.slug ?? ids[0] ?? "";
  const [current, setCurrent] = useState(defaultId);
  const [swap, setSwap] = useState(false);
  const currentRef = useRef(current);
  const refocus = useRef(false);
  const p = bySlug[current] ?? projects[0];

  useEffect(() => {
    currentRef.current = current;
    const name = bySlug[current]?.name;
    document.title = `${name ?? "ngoding suka-suka"} | ${brand ?? "trcodes.dev"}`;
    if (refocus.current) {
      refocus.current = false;
      document.getElementById(`tab-${current}`)?.focus();
    }
  }, [current, bySlug, brand]);

  const select = useCallback(
    (id: string) => {
      if (id === currentRef.current) return;
      const target = projects.find((project) => project.slug === id);
      if (!target) return;
      window.history.replaceState(null, "", `#${target.hash}`);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCurrent(id);
        return;
      }
      setSwap(true);
      setTimeout(() => {
        setCurrent(id);
        setSwap(false);
      }, 250);
    },
    [projects]
  );

  const idFromHash = useCallback(
    () => projects.find((project) => `#${project.hash}` === window.location.hash)?.slug,
    [projects]
  );

  useEffect(() => {
    // Buka ngodingan sesuai hash saat halaman dimuat
    const initial = idFromHash();
    if (initial) setCurrent(initial);

    const onHash = () => {
      const id = idFromHash();
      if (id && id !== currentRef.current) {
        select(id);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [select, idFromHash]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[
      e.key
    ];
    if (!step) return;
    e.preventDefault();
    refocus.current = true;
    select(
      ids[(ids.indexOf(currentRef.current) + step + ids.length) % ids.length] ?? defaultId
    );
  };

  if (!p) return null;

  return (
    <>
      <div className="sticky top-14 z-30 border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto px-5 py-3 md:px-10">
          <span className="shrink-0 font-display text-sm font-bold">
            Pilih ngodingan
          </span>
          <div
            role="tablist"
            aria-label="Pilih ngodingan"
            className="flex gap-2"
            onKeyDown={onKeyDown}
          >
            {projects.map((project) => (
              <button
                key={project.slug}
                role="tab"
                id={`tab-${project.slug}`}
                aria-selected={project.slug === current}
                tabIndex={project.slug === current ? 0 : -1}
                className="chip"
                onClick={() => select(project.slug)}
              >
                {project.name}
                {project.slug === defaultId && <small>utama</small>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section id="ngoding" className="px-5 py-16 md:px-10" aria-live="polite">
        <div id="stage" className={`mx-auto max-w-5xl ${swap ? "swap" : ""}`}>
          <div>
            <span className="kick">
              {current === defaultId ? "Ngodingan utama" : "Ngodingan"}
            </span>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight">
              {p.name}
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="text-2xl leading-snug">{p.short}</p>
                <p className="mt-5 text-graphite">{p.desc}</p>
                <h3 className="mt-9 font-display font-bold">
                  Apa yang bisa dilakukannya
                </h3>
                <ul className="mt-3 space-y-2">
                  {p.can.map((x) => (
                    <li key={x} className="flex gap-3">
                      <i
                        className="fa-solid fa-check mt-2 text-sm"
                        aria-hidden="true"
                      />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-9 font-display font-bold">
                  Teknologi yang dipakai
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((x) => (
                    <li key={x} className="chip">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <DemoFigure p={p} />
            </div>
          </div>

          <div className="mt-24">
            <span className="kick">Perjalanannya</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              {p.chHead}
            </h2>
          </div>

          <ol className="mt-8 border-b-2 border-ink">
            {p.chapters.map((c, i) => (
              <li
                key={c.slug}
                className="grid gap-6 border-t-2 border-ink py-10 md:grid-cols-12 md:gap-10"
              >
                <div className="flex items-center gap-4 md:col-span-2 md:block">
                  <p className="font-display text-2xl font-extrabold">
                    Bab {i + 1}
                  </p>
                  <span
                    className="grid size-11 place-items-center rounded-full border-2 border-ink md:mt-3"
                    aria-hidden="true"
                  >
                    <i className={`fa-solid ${c.icon}`} />
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-display text-3xl font-extrabold leading-tight">
                    {c.title}
                  </h3>
                  <p className="mt-4">
                    <b className="font-display">Apa itu.</b> {c.what}
                  </p>
                  <p className="mt-3">
                    <b className="font-display">Cara saya memakainya.</b>{" "}
                    {c.use}
                  </p>
                  <p className="fade-end mt-4 border-l-4 border-ink pl-4 italic">
                    Yang bikin penasaran: {c.more}
                  </p>
                  <Link className="btn mt-6" href={chapterUrl(p.slug, c.slug)}>
                    <i className="fa-solid fa-book-open" aria-hidden="true" />
                    Baca bab ini
                  </Link>
                </div>
                <div className="md:col-span-4">
                  <img
                    src={imageUrl(c.img, c.slug, 800, 600)}
                    alt={c.imgAlt}
                    width={800}
                    height={600}
                    loading="lazy"
                    className={`box photo aspect-4/3 w-full object-cover ${
                      i % 2 ? "rotate-1" : "-rotate-1"
                    }`}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
