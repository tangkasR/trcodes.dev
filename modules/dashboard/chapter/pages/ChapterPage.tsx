// src/modules/chapter/pages/ChapterPage.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requirePageAccess } from "@/lib/auth";
import { uuidSchema } from "@/utils/zod";
import { getProjectDetailWithChapters } from "../chapter.queries";
import ChapterTable from "../components/ChapterTable";

type Props = { params: Promise<{ uuid: string }> };

export default async function ChapterPage({ params }: Props) {
  await requirePageAccess("chapter", "read");

  const { uuid } = await params;
  const projectUuid = uuidSchema.parse(uuid);
  const project = await getProjectDetailWithChapters(projectUuid);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/projects"
          className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Daftar Proyek
        </Link>
        <PageHeader
          icon={BookOpen}
          title={`Bab Proyek: ${project.name}`}
          description="Kelola bab, pembahasan, dan isi konten untuk showcase proyek ini."
          eyebrow="Proyek"
          actions={
            <span className="rounded-xl bg-blue-50 px-3 py-1.5 font-mono text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              /{project.slug}
            </span>
          }
        />
      </div>
      <ChapterTable project={project} />
    </div>
  );
}
