// src/modules/education/components/EducationModal.tsx
"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  numberInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import { createEducationAction, updateEducationAction } from "../education.actions";
import type { EducationFormInput, EducationRow } from "../education.schema";
import { educationKeys } from "../education.hooks";

type Props = { education: EducationRow | null; onClose: () => void };

export default function EducationModal({ education, onClose }: Props) {
  const isEdit = education !== null;

  const [form, setForm] = useState<EducationFormInput>({
    school: education?.school ?? "",
    major: education?.major ?? "",
    startYear: education?.startYear ?? new Date().getFullYear(),
    endYear: education?.endYear ?? 0,
    sortOrder: education?.sortOrder ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setErrors({});

    const res = isEdit
      ? await updateEducationAction(education.uuid, form)
      : await createEducationAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: educationKeys.all });
    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Ubah Pendidikan" : "Tambah Pendidikan"}
      subtitle={
        isEdit
          ? "Perbarui riwayat institusi dan jenjang pendidikan."
          : "Tambah riwayat pendidikan formal ke profil portofolio."
      }
      icon={GraduationCap}
      onClose={onClose}
      closeDisabled={pending}
    >
      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        <div>
          <label htmlFor="edu-school" className={labelCls}>
            Sekolah / Universitas <span className="text-red-500">*</span>
          </label>
          <input
            id="edu-school"
            value={form.school}
            autoFocus
            placeholder="contoh: Universitas Gadjah Mada"
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            aria-invalid={!!errors.school}
            className={inputCls}
          />
          {errors.school && <p className={errorCls}>{errors.school}</p>}
        </div>

        <div>
          <label htmlFor="edu-major" className={labelCls}>
            Jurusan / Program Studi <span className="text-red-500">*</span>
          </label>
          <input
            id="edu-major"
            value={form.major}
            placeholder="contoh: Ilmu Komputer"
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            aria-invalid={!!errors.major}
            className={inputCls}
          />
          {errors.major && <p className={errorCls}>{errors.major}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edu-start-year" className={labelCls}>
              Tahun Mulai <span className="text-red-500">*</span>
            </label>
            <input
              id="edu-start-year"
              type="number"
              min={1900}
              max={2100}
              value={form.startYear}
              onChange={(e) =>
                setForm({ ...form, startYear: Number(e.target.value) })
              }
              aria-invalid={!!errors.startYear}
              className={numberInputCls}
            />
            {errors.startYear && <p className={errorCls}>{errors.startYear}</p>}
          </div>

          <div>
            <label htmlFor="edu-end-year" className={labelCls}>
              Tahun Selesai
            </label>
            <input
              id="edu-end-year"
              type="number"
              min={0}
              max={2100}
              value={form.endYear}
              placeholder="0 = sedang berjalan"
              onChange={(e) =>
                setForm({ ...form, endYear: Number(e.target.value) })
              }
              aria-invalid={!!errors.endYear}
              className={numberInputCls}
            />
            {errors.endYear && <p className={errorCls}>{errors.endYear}</p>}
            <p className="mt-1 text-xs text-slate-400">Isi 0 jika masih menempuh studi</p>
          </div>
        </div>

        <div>
          <label htmlFor="edu-sort-order" className={labelCls}>
            Urutan Tampil (Sort Order)
          </label>
          <input
            id="edu-sort-order"
            type="number"
            min={0}
            value={form.sortOrder ?? 0}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) })
            }
            aria-invalid={!!errors.sortOrder}
            className={numberInputCls}
          />
          {errors.sortOrder && <p className={errorCls}>{errors.sortOrder}</p>}
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
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : isEdit ? "Ubah" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
