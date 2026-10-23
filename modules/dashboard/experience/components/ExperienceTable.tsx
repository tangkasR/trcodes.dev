// src/modules/experience/components/ExperienceTable.tsx
"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteExperienceAction } from "../experience.actions";
import type { ExperienceRow } from "../experience.schema";
import ExperienceModal from "./ExperienceModal";
import { useListParams } from "@/hooks/use-list-params";
import { experienceKeys, useExperiences } from "../experience.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

function formatDatePeriod(start: string, end: string | null): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  const startDateStr = new Date(start).toLocaleDateString("id-ID", options);
  if (!end) {
    return `${startDateStr} - Sekarang`;
  }
  const endDateStr = new Date(end).toLocaleDateString("id-ID", options);
  return `${startDateStr} - ${endDateStr}`;
}

export default function ExperienceTable() {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useExperiences(params);

  const [modal, setModal] = useState<{
    experience: ExperienceRow | null;
  } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("experience", "add");
  const canEdit = can("experience", "edit");
  const canDelete = can("experience", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: ExperienceRow) {
    const ok = await swalConfirm({
      title: `Hapus "${row.organization}"?`,
      text: "Data pengalaman ini akan dihapus secara permanen.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteExperienceAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
      swalSuccess(res.message ?? "Pengalaman berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<ExperienceRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Perusahaan / Posisi",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.organization}</p>
          <p className="text-xs font-semibold text-blue-600">{row.role}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">/{row.slug}</p>
        </div>
      ),
    },
    {
      header: "Periode",
      className: "w-44",
      cell: (row) => (
        <span className="text-xs text-slate-700">
          {formatDatePeriod(row.startDate, row.endDate)}
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
      header: "Tampil",
      className: "w-20 text-center",
      cell: (row) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            row.isVisible
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.isVisible ? "Ya" : "Tidak"}
        </span>
      ),
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
              onClick={() => setModal({ experience: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.organization}`}
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
              aria-label={`Hapus ${row.organization}`}
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
          placeholder="Cari perusahaan, posisi, atau ringkasan..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ experience: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Pengalaman
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={
          params.q ? "Data tidak ditemukan" : "Belum ada data pengalaman"
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
        <ExperienceModal
          key={modal.experience?.uuid ?? "new"}
          experience={modal.experience}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
