"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteContactLinkAction } from "../contact-link.actions";
import type { ContactLinkRow } from "../contact-link.schema";
import ContactLinkModal from "./ContactLinkModal";
import { useQueryClient } from "@tanstack/react-query";
import { useListParams } from "@/hooks/use-list-params";
import { contactLinkKeys, useContactLinks } from "../contact-link.hooks";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";

export default function ContactLinkTable() {
  const { can } = usePermission();

  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useContactLinks(params);

  const [modal, setModal] = useState<{
    contactLink: ContactLinkRow | null;
  } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("contact-link", "add");
  const canEdit = can("contact-link", "edit");
  const canDelete = can("contact-link", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: ContactLinkRow) {
    const ok = await swalConfirm({
      title: `Hapus kontak "${row.platform}"?`,
      text: "Apakah anda yakin ingin hapus kontak?",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteContactLinkAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: contactLinkKeys.all });
      swalSuccess(res.message ?? "Kontak berhasil dihapus");
    } else swalError("Gagal menghapus", res.message);
  }

  const columns: Column<ContactLinkRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "Platform",
      cell: (row) => row.platform ?? <span className="text-slate-400">-</span>,
    },
    {
      header: "Display Text",
      cell: (row) =>
        row.displayText ?? <span className="text-slate-400">-</span>,
    },
    {
      header: "Link Url",
      cell: (row) => row.url ?? <span className="text-slate-400">-</span>,
    },
    {
      header: "Visible",
      cell: (row) => row.isVisible ?? <span className="text-slate-400">-</span>,
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
              onClick={() => setModal({ contactLink: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.platform}`}
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
              aria-label={`Hapus ${row.platform}`}
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
          placeholder="Cari kontak..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ contactLink: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Kontak
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={params.q ? "Kontak tidak ditemukan" : "Belum ada kontak"}
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
        <ContactLinkModal
          key={modal.contactLink?.uuid ?? "new"} // state form dibuat baru setiap modal dibuka
          contactLink={modal.contactLink}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
