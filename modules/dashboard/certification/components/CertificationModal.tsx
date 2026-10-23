// src/modules/certification/components/CertificationModal.tsx
"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  numberInputCls,
  checkboxCardCls,
  checkboxInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import {
  createCertificationAction,
  updateCertificationAction,
} from "../certification.actions";
import type {
  CertificationFormInput,
  CertificationRow,
} from "../certification.schema";
import { certificationKeys } from "../certification.hooks";

type Props = { certification: CertificationRow | null; onClose: () => void };

export default function CertificationModal({ certification, onClose }: Props) {
  const isEdit = certification !== null;

  const [form, setForm] = useState<CertificationFormInput>({
    title: certification?.title ?? "",
    issuer: certification?.issuer ?? "",
    year: certification?.year ?? new Date().getFullYear(),
    credentialUrl: certification?.credentialUrl ?? "",
    sortOrder: certification?.sortOrder ?? 0,
    isVisible: certification?.isVisible ?? true,
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
      ? await updateCertificationAction(certification.uuid, form)
      : await createCertificationAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: certificationKeys.all });
    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Ubah Sertifikasi" : "Tambah Sertifikasi"}
      subtitle={
        isEdit
          ? "Perbarui informasi kredensial dan lisensi sertifikasi."
          : "Tambah lisensi atau sertifikasi profesional ke profil portofolio."
      }
      icon={Award}
      onClose={onClose}
      closeDisabled={pending}
    >
      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        <div>
          <label htmlFor="cert-title" className={labelCls}>
            Judul Sertifikasi <span className="text-red-500">*</span>
          </label>
          <input
            id="cert-title"
            value={form.title}
            autoFocus
            placeholder="contoh: AWS Certified Solutions Architect"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            aria-invalid={!!errors.title}
            className={inputCls}
          />
          {errors.title && <p className={errorCls}>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="cert-issuer" className={labelCls}>
            Organisasi Penerbit <span className="text-red-500">*</span>
          </label>
          <input
            id="cert-issuer"
            value={form.issuer}
            placeholder="contoh: Amazon Web Services"
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            aria-invalid={!!errors.issuer}
            className={inputCls}
          />
          {errors.issuer && <p className={errorCls}>{errors.issuer}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="cert-year" className={labelCls}>
              Tahun Diperoleh <span className="text-red-500">*</span>
            </label>
            <input
              id="cert-year"
              type="number"
              min={1900}
              max={2100}
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
              aria-invalid={!!errors.year}
              className={numberInputCls}
            />
            {errors.year && <p className={errorCls}>{errors.year}</p>}
          </div>

          <div>
            <label htmlFor="cert-sort-order" className={labelCls}>
              Urutan Tampil (Sort Order)
            </label>
            <input
              id="cert-sort-order"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
              aria-invalid={!!errors.sortOrder}
              className={numberInputCls}
            />
            {errors.sortOrder && <p className={errorCls}>{errors.sortOrder}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="cert-credential-url" className={labelCls}>
            URL Kredensial{" "}
            <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input
            id="cert-credential-url"
            type="url"
            value={form.credentialUrl}
            placeholder="https://..."
            onChange={(e) =>
              setForm({ ...form, credentialUrl: e.target.value })
            }
            aria-invalid={!!errors.credentialUrl}
            className={inputCls}
          />
          {errors.credentialUrl && (
            <p className={errorCls}>{errors.credentialUrl}</p>
          )}
        </div>

        <div>
          <label className={checkboxCardCls}>
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              className={checkboxInputCls}
            />
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Tampilkan di Portofolio
              </span>
              <span className="block text-xs text-slate-500">
                Sertifikasi ini akan dipublikasikan pada halaman portofolio publik.
              </span>
            </div>
          </label>
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
