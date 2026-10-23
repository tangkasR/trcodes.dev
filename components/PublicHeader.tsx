"use client";

import Link from "next/link";
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
        <Link href="/#homepage" className="font-display text-lg font-extrabold">
          {brand ?? "trcodes.dev"}
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
