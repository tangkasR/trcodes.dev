// src/modules/chapter/components/ChapterTable.tsx
"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteChapterAction } from "../chapter.actions";
import type { ChapterRow } from "../chapter.schema";
import ChapterModal from "./ChapterModal";
import { useListParams } from "@/hooks/use-list-params";
import { chapterKeys, useChapters } from "../chapter.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

type Props = {
  project: {
    uuid: string;
    name: string;
    slug: string;
    chaptersHeading: string | null;
  };
};

export default function ChapterTable({ project }: Props) {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useChapters(project.uuid, params);

  const [modal, setModal] = useState<{
    chapter: ChapterRow | null;
  } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("chapter", "add");
  const canEdit = can("chapter", "edit");
  const canDelete = can("chapter", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: ChapterRow) {
    const ok = await swalConfirm({
      title: `Hapus bab "${row.title}"?`,
      text: "Data bab ini akan dihapus secara permanen.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteChapterAction(row.uuid, project.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.project(project.uuid),
      });
      swalSuccess(res.message ?? "Bab berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<ChapterRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Bab & Judul",
      cell: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-slate-400">[{row.icon}]</span>
            <p className="font-semibold text-slate-900">{row.title}</p>
          </div>
          <p className="line-clamp-1 text-xs text-slate-500">{row.definition}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            /blog/{project.slug}/{row.slug}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      className: "w-28 text-center",
      cell: (row) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Blok Konten",
      className: "w-28 text-center",
      cell: (row) => (
        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {row.content?.length ?? 0} blok
        </span>
      ),
    },
    {
      header: "Urutan",
      className: "w-16 text-center",
      cell: (row) => row.sortOrder,
    },
    {
      header: "Diperbarui",
      className: "whitespace-nowrap",
      cell: (row) => formatDateTime(row.updatedAt),
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      header: "Aksi",
      className: "w-24",
      cell: (row) => (
        <div className="flex items-center gap-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => setModal({ chapter: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.title}`}
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => handleDelete(row)}
              disabled={deletingUuid === row.uuid}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label={`Hapus ${row.title}`}
              title="Hapus"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      ),
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={params.q}
          onSearch={setQuery}
          placeholder="Cari judul bab, slug, atau definisi..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ chapter: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Bab Baru
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={
          params.q ? "Bab tidak ditemukan" : "Belum ada bab di dalam proyek ini"
        }
        isPending={query.isPending}
        isFetching={query.isFetching}
        isPlaceholderData={query.isPlaceholderData}
        error={query.error}
        onRetry={() => query.refetch()}
        page={params.page}
        limit={params.limit}
        total={query.data?.total}
        totalPages={query.data?.totalPages}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
      {modal && (
        <ChapterModal
          key={modal.chapter?.uuid ?? "new"}
          projectUuid={project.uuid}
          chapter={modal.chapter}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
