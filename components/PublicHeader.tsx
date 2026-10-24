"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { key: "homepage", href: "/#homepage", short: "Ngoding", long: "Ngoding" },
  {
    key: "experience",
    href: "/experiences#experience",
    short: "Pribadi",
    long: "Informasi Pribadi",
  },
];

export default function PublicHeader({ brand }: { brand?: string }) {
  const pathname = usePathname();
  const cur = pathname.startsWith("/experiences") ? "experience" : "homepage";

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-10">
        <Link
          href="/#homepage"
          className="group flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight transition hover:opacity-85"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink bg-white p-1 shadow-[2px_2px_0px_#1b1a17] transition-transform group-hover:-translate-y-0.5">
            <Image
              src="/imglogo.png"
              alt="trcodes logo"
              width={24}
              height={24}
              className="size-5.5 object-contain"
              priority
            />
          </span>
          <span>{brand ?? "trcodes.dev"}</span>
        </Link>
        <nav
          aria-label="Navigasi utama"
          className="flex items-center text-sm font-semibold"
        >
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              aria-current={l.key === cur ? "page" : undefined}
              className={`nav ${l.key === cur ? "on" : ""}`}
            >
              <span className="sm:hidden">{l.short}</span>
              <span className="hidden sm:inline">{l.long}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
