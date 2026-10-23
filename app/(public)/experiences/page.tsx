import { Suspense } from "react";
import type { Metadata } from "next";
import PublicPageSkeleton from "@/components/skeletons/PublicPageSkeleton";
import ExperiencesPage from "@/modules/public/experiences/pages/ExperiencesPage";

export const metadata: Metadata = {
  title: "Pengalaman Kerja & Informasi Pribadi",
  description:
    "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto.",
  alternates: {
    canonical: "/experiences",
  },
  openGraph: {
    title: "Pengalaman Kerja & Informasi Pribadi | trcodes",
    description:
      "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto.",
    url: "/experiences",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengalaman Kerja & Informasi Pribadi | trcodes",
    description:
      "Riwayat pengalaman kerja, proyek, tanggung jawab, dan hasil implementasi teknis Tangkas Risdianto.",
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
