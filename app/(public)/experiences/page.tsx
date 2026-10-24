import { Suspense } from "react";
import type { Metadata } from "next";
import PublicPageSkeleton from "@/components/skeletons/PublicPageSkeleton";
import ExperiencesPage from "@/modules/public/experiences/pages/ExperiencesPage";

export const metadata: Metadata = {
  title: "Pengalaman Kerja Tangkas Risdianto — Full Stack & Web Developer",
  description:
    "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto (tangkas risdianto) sebagai Full Stack Developer dan Web Developer.",
  keywords: [
    "Tangkas",
    "tangkas",
    "Risdianto",
    "risdianto",
    "Tangkas Risdianto",
    "tangkas risdianto",
    "tangkas Risdianto",
    "Tangkas risdianto",
    "Full Stack Developer",
    "Web Developer",
    "Full Stack Web Developer",
    "Pengalaman Kerja Tangkas Risdianto",
    "Portofolio Web Developer",
  ],
  alternates: {
    canonical: "/experiences",
  },
  openGraph: {
    title: "Pengalaman Kerja Tangkas Risdianto | Full Stack & Web Developer",
    description:
      "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto (tangkas risdianto) sebagai Full Stack Developer dan Web Developer.",
    url: "/experiences",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengalaman Kerja Tangkas Risdianto | Full Stack & Web Developer",
    description:
      "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto (tangkas risdianto) sebagai Full Stack Developer dan Web Developer.",
  },
};

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<PublicPageSkeleton />}>
      <ExperiencesPage />
    </Suspense>
  );
}
