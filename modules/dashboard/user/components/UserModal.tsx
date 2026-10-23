// src/modules/user/components/UserModal.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, User as UserIcon } from "lucide-react";
import Modal from "@/components/Modal";
import { ROLE_DEFAULT } from "@/config";
import { swalError, swalSuccess } from "@/utils/swal";
import { inputCls, selectCls, labelCls, errorCls } from "@/utils/form-styles";
import { createUserAction, updateUserAction } from "../user.actions";
import type { RoleOption, UserFormInput, UserRow } from "../user.schema";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "../user.hooks";

type Props = {
  user: UserRow | null;
  roles: RoleOption[];
  isSelf: boolean;
  onClose: () => void;
};

export default function UserModal({ user, roles, isSelf, onClose }: Props) {
  const isEdit = user !== null;

  const [form, setForm] = useState<UserFormInput>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    roleUuid:
      user?.roleUuid ?? roles.find((r) => r.name === ROLE_DEFAULT)?.uuid ?? "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setErrors({});

    const res = isEdit
      ? await updateUserAction(user.uuid, form)
      : await createUserAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: userKeys.all });

    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Edit User" : "Tambah User"}
      subtitle={
        isEdit
          ? "Perbarui informasi akun dan hak akses pengguna."
          : "Daftarkan akun pengguna baru ke dalam sistem."
      }
      icon={UserIcon}
      onClose={onClose}
      closeDisabled={pending}
    >
      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        <div>
          <label htmlFor="name" className={labelCls}>
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            value={form.name}
            autoFocus
            autoComplete="off"
            placeholder="contoh: Tangkas Risdianto"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-invalid={!!errors.name}
            className={inputCls}
          />
          {errors.name && <p className={errorCls}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Alamat Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            autoComplete="off"
            placeholder="nama@email.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={!!errors.email}
            className={inputCls}
          />
          {errors.email && <p className={errorCls}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelCls}>
            Password
            {isEdit && (
              <span className="font-normal text-slate-400"> (opsional)</span>
            )}
            {!isEdit && <span className="text-red-500"> *</span>}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              autoComplete="new-password"
              placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 12 karakter"}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!errors.password}
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className={errorCls}>{errors.password}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              {isEdit
                ? "Kosongkan jika tidak ingin mengubah password."
                : "Minimal 12 karakter, mengandung huruf dan angka."}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="roleUuid" className={labelCls}>
            Hak Akses Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="roleUuid"
              value={form.roleUuid}
              disabled={isSelf}
              onChange={(e) => setForm({ ...form, roleUuid: e.target.value })}
              aria-invalid={!!errors.roleUuid}
              className={selectCls}
            >
              <option value="" disabled>
                Pilih role
              </option>
              {roles.map((r) => (
                <option key={r.uuid} value={r.uuid}>
                  {r.name}
                </option>
              ))}
              {user && !roles.some((r) => r.uuid === user.roleUuid) && (
                <option value={user.roleUuid}>{user.roleName}</option>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.roleUuid ? (
            <p className={errorCls}>{errors.roleUuid}</p>
          ) : (
            isSelf && (
              <p className="mt-1 text-xs text-slate-400">
                Kamu tidak dapat mengubah role akunmu sendiri.
              </p>
            )
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : isEdit ? "Ubah" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
