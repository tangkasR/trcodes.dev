// src/modules/user/components/UserTable.tsx
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import SearchBox from "@/components/SearchBox";
import { usePermission } from "@/context/PermissionContext";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { useListParams } from "@/hooks/use-list-params";
import { formatDateTime } from "@/utils/format-date-time";
import { deleteUserAction } from "../user.actions";
import { userKeys, useUsers } from "../user.hooks";
import type { RoleOption, UserRow } from "../user.schema";
import UserModal from "./UserModal";

type Props = {
  roles: RoleOption[];
  currentUserUuid: string;
};

export default function UserTable({ roles, currentUserUuid }: Props) {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const { params, setQuery, setPage, setLimit } = useListParams();
  const query = useUsers(params);

  const [modal, setModal] = useState<{ user: UserRow | null } | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const canAdd = can("user", "add");
  const canEdit = can("user", "edit");
  const canDelete = can("user", "delete");
  const offset = (params.page - 1) * params.limit;

  async function handleDelete(row: UserRow) {
    const ok = await swalConfirm({
      title: `Hapus user "${row.name}"?`,
      text: "Apakah anda yakin ingin hapus akun pengguna?",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setDeletingUuid(row.uuid);
    const res = await deleteUserAction(row.uuid);
    setDeletingUuid(null);

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      swalSuccess(res.message ?? "User berhasil dihapus");
    } else {
      swalError("Gagal menghapus", res.message);
    }
  }

  const columns: Column<UserRow>[] = [
    { header: "No", className: "w-12", cell: (_, i) => offset + i + 1 },
    {
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {row.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium text-slate-900">
              <span className="truncate">{row.name}</span>
              {row.uuid === currentUserUuid && (
                <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium uppercase text-green-700">
                  Kamu
                </span>
              )}
            </p>
            <p className="truncate text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.isSuperAdmin
              ? "bg-purple-50 text-purple-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {row.roleName}
        </span>
      ),
    },
    {
      header: "Dibuat",
      className: "whitespace-nowrap",
      cell: (row) => formatDateTime(row.createdAt),
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
              onClick={() => setModal({ user: row })}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              aria-label={`Ubah ${row.name}`}
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
          )}
          {canDelete && row.uuid !== currentUserUuid && (
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
          placeholder="Cari nama atau email..."
        />
        {canAdd && (
          <button
            type="button"
            onClick={() => setModal({ user: null })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="size-4" />
            Tambah User
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getKey={(r) => r.uuid}
        emptyText={params.q ? "User tidak ditemukan" : "Belum ada user"}
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
        <UserModal
          key={modal.user?.uuid ?? "new"}
          user={modal.user}
          roles={roles}
          isSelf={modal.user?.uuid === currentUserUuid}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
