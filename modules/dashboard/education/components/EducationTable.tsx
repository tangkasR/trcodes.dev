// src/modules/education/components/EducationTable.tsx
"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteEducationAction } from "../education.actions";
import type { EducationRow } from "../education.schema";
import EducationModal from "./EducationModal";
import { useListParams } from "@/hooks/use-list-params";
import { educationKeys, useEducations } from "../education.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

export default function EducationTable() {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useEducations(params);

  const [modal, setModal] = useState<{ education: EducationRow | null } | null>(
    null
  );
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("education", "add");
  const canEdit = can("education", "edit");
  const canDelete = can("education", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: EducationRow) {
    const ok = await swalConfirm({
      title: `Hapus "${row.school}"?`,
      text: "Data pendidikan ini akan dihapus secara permanen.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteEducationAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
      swalSuccess(res.message ?? "Data pendidikan berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<EducationRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Sekolah / Universitas",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.school}</p>
          <p className="text-xs text-slate-500">{row.major}</p>
        </div>
      ),
    },
    {
      header: "Periode",
      className: "whitespace-nowrap",
      cell: (row) => (
        <span>
          {row.startYear}&nbsp;–&nbsp;
          {row.endYear ? row.endYear : <span className="text-slate-400">sekarang</span>}
        </span>
      ),
    },
    {
      header: "Urutan",
      className: "w-20 text-center",
      cell: (row) => row.sortOrder ?? 0,
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
              onClick={() => setModal({ education: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.school}`}
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
              aria-label={`Hapus ${row.school}`}
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
          placeholder="Cari sekolah atau jurusan..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ education: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Pendidikan
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={params.q ? "Data tidak ditemukan" : "Belum ada data pendidikan"}
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
        <EducationModal
          key={modal.education?.uuid ?? "new"}
          education={modal.education}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
