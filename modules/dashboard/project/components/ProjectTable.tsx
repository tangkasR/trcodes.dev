// src/modules/project/components/ProjectTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteProjectAction } from "../project.actions";
import type { ProjectRow } from "../project.schema";
import ProjectModal from "./ProjectModal";
import { useListParams } from "@/hooks/use-list-params";
import { projectKeys, useProjects } from "../project.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

export default function ProjectTable() {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useProjects(params);

  const [modal, setModal] = useState<{
    project: ProjectRow | null;
  } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("project", "add");
  const canEdit = can("project", "edit");
  const canDelete = can("project", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: ProjectRow) {
    const ok = await swalConfirm({
      title: `Hapus "${row.name}"?`,
      text: "Data proyek beserta bab (chapters) di dalamnya akan dihapus secara permanen.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteProjectAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      swalSuccess(res.message ?? "Proyek berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<ProjectRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Nama Proyek",
      cell: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-slate-900">{row.name}</p>
            {row.isDefault && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{row.short}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">/{row.slug}</p>
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
      header: "Bab / Chapters",
      className: "w-28 text-center",
      cell: (row) => (
        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {row.chapterCount ?? 0} bab
        </span>
      ),
    },
    {
      header: "Tech Stack",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.stack.length > 0 ? (
            row.stack.map((item, idx) => (
              <span
                key={idx}
                className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">-</span>
          )}
        </div>
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

  const canViewChapters = can("chapter", "read");

  if (canEdit || canDelete || canViewChapters) {
    columns.push({
      header: "Aksi",
      className: "w-32",
      cell: (row) => (
        <div className="flex items-center gap-1">
          {canViewChapters && (
            <Link
              href={`/dashboard/projects/${row.uuid}`}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Kelola bab ${row.name}`}
              title="Kelola bab (chapters)"
            >
              <BookOpen className="size-4" />
            </Link>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => setModal({ project: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.name}`}
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
              aria-label={`Hapus ${row.name}`}
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
          placeholder="Cari nama proyek, slug, atau ringkasan..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ project: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Proyek
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={
          params.q ? "Data tidak ditemukan" : "Belum ada data proyek"
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
        <ProjectModal
          key={modal.project?.uuid ?? "new"}
          project={modal.project}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
