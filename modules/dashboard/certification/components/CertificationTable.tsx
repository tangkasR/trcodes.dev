// src/modules/certification/components/CertificationTable.tsx
"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { safeHref } from "@/utils/url";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteCertificationAction } from "../certification.actions";
import type { CertificationRow } from "../certification.schema";
import CertificationModal from "./CertificationModal";
import { useListParams } from "@/hooks/use-list-params";
import { certificationKeys, useCertifications } from "../certification.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

export default function CertificationTable() {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useCertifications(params);

  const [modal, setModal] = useState<{
    certification: CertificationRow | null;
  } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("certification", "add");
  const canEdit = can("certification", "edit");
  const canDelete = can("certification", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: CertificationRow) {
    const ok = await swalConfirm({
      title: `Hapus "${row.title}"?`,
      text: "Data sertifikasi ini akan dihapus secara permanen.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteCertificationAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: certificationKeys.all });
      swalSuccess(res.message ?? "Sertifikasi berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<CertificationRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Sertifikasi",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.title}</p>
          <p className="text-xs text-slate-500">{row.issuer}</p>
        </div>
      ),
    },
    {
      header: "Tahun",
      className: "w-20 text-center",
      cell: (row) => row.year,
    },
    {
      header: "Kredensial",
      className: "w-28 text-center",
      cell: (row) =>
        row.credentialUrl ? (
          <a
            href={safeHref(row.credentialUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Lihat <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="text-slate-400">-</span>
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
      header: "Urutan",
      className: "w-20 text-center",
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
              onClick={() => setModal({ certification: row })}
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
          placeholder="Cari judul atau penerbit..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ certification: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Sertifikasi
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={
          params.q ? "Data tidak ditemukan" : "Belum ada data sertifikasi"
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
        <CertificationModal
          key={modal.certification?.uuid ?? "new"}
          certification={modal.certification}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
