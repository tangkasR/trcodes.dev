// src/modules/experience/components/ExperienceModal.tsx
"use client";

import { useState } from "react";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  textareaCls,
  checkboxCardCls,
  checkboxInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import {
  createExperienceAction,
  updateExperienceAction,
} from "../experience.actions";
import type {
  ExperienceFormInput,
  ExperienceRow,
} from "../experience.schema";
import { experienceKeys } from "../experience.hooks";

type Props = { experience: ExperienceRow | null; onClose: () => void };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExperienceModal({ experience, onClose }: Props) {
  const isEdit = experience !== null;

  const [form, setForm] = useState<ExperienceFormInput>({
    slug: experience?.slug ?? "",
    organization: experience?.organization ?? "",
    role: experience?.role ?? "",
    startDate: experience?.startDate ?? "",
    endDate: experience?.endDate ?? "",
    summary: experience?.summary ?? "",
    duties: experience?.duties ?? [""],
    results: experience?.results ?? [""],
    stack: experience?.stack ?? [""],
    isVisible: experience?.isVisible ?? true,
  });

  const [isCurrent, setIsCurrent] = useState<boolean>(
    isEdit ? !experience?.endDate : false
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const handleArrayChange = (
    field: "duties" | "results" | "stack",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field: "duties" | "results" | "stack") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (
    field: "duties" | "results" | "stack",
    index: number
  ) => {
    if (form[field].length <= 1) return;
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index),
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setErrors({});

    const cleaned: ExperienceFormInput = {
      ...form,
      endDate: isCurrent ? "" : form.endDate,
      duties: form.duties.map((d) => d.trim()).filter(Boolean),
      results: form.results.map((r) => r.trim()).filter(Boolean),
      stack: form.stack.map((s) => s.trim()).filter(Boolean),
    };

    const res = isEdit
      ? await updateExperienceAction(experience.uuid, cleaned)
      : await createExperienceAction(cleaned);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: experienceKeys.all });

    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
      subtitle={
        isEdit
          ? "Kelola rincian riwayat karir, tugas utama, hasil kerja, dan teknologi."
          : "Tambah rekam jejak karir atau pengalaman kerja baru ke portofolio."
      }
      icon={Briefcase}
      onClose={onClose}
      closeDisabled={pending}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exp-org" className={labelCls}>
              Perusahaan / Organisasi <span className="text-red-500">*</span>
            </label>
            <input
              id="exp-org"
              value={form.organization}
              autoFocus
              placeholder="contoh: PT Teknologi Nusantara"
              onChange={(e) => {
                const org = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  organization: org,
                  slug: !isEdit && !prev.slug ? slugify(org) : prev.slug,
                }));
              }}
              aria-invalid={!!errors.organization}
              className={inputCls}
            />
            {errors.organization && (
              <p className={errorCls}>{errors.organization}</p>
            )}
          </div>

          <div>
            <label htmlFor="exp-slug" className={labelCls}>
              Slug URL <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="exp-slug"
                value={form.slug}
                placeholder="contoh: pt-teknologi-nusantara"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                aria-invalid={!!errors.slug}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => {
                  if (form.organization) {
                    setForm({ ...form, slug: slugify(form.organization) });
                  }
                }}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                Generate
              </button>
            </div>
            {errors.slug && <p className={errorCls}>{errors.slug}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="exp-role" className={labelCls}>
            Posisi / Peran <span className="text-red-500">*</span>
          </label>
          <input
            id="exp-role"
            value={form.role}
            placeholder="contoh: Senior Frontend Engineer"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            aria-invalid={!!errors.role}
            className={inputCls}
          />
          {errors.role && <p className={errorCls}>{errors.role}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exp-start-date" className={labelCls}>
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              id="exp-start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              aria-invalid={!!errors.startDate}
              className={inputCls}
            />
            {errors.startDate && (
              <p className={errorCls}>{errors.startDate}</p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="exp-end-date" className={labelCls}>
                Tanggal Selesai
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);
                    if (e.target.checked) setForm({ ...form, endDate: "" });
                  }}
                  className={checkboxInputCls}
                />
                Sampai Sekarang
              </label>
            </div>
            <input
              id="exp-end-date"
              type="date"
              disabled={isCurrent}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              aria-invalid={!!errors.endDate}
              className={inputCls}
            />
            {errors.endDate && (
              <p className={errorCls}>{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="exp-summary" className={labelCls}>
            Ringkasan Pengalaman <span className="text-red-500">*</span>
          </label>
          <textarea
            id="exp-summary"
            rows={3}
            value={form.summary}
            placeholder="Jelaskan peran umum dan gambaran tanggung jawab Anda..."
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            aria-invalid={!!errors.summary}
            className={textareaCls}
          />
          {errors.summary && <p className={errorCls}>{errors.summary}</p>}
        </div>

        {/* Duties / Tanggung Jawab */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>
              Tanggung Jawab Utama
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("duties")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="size-3.5" /> Tambah Tanggung Jawab
            </button>
          </div>
          <div className="space-y-2">
            {form.duties.map((duty, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={duty}
                  placeholder={`Tanggung jawab ${idx + 1}`}
                  onChange={(e) =>
                    handleArrayChange("duties", idx, e.target.value)
                  }
                  className={inputCls}
                />
                {form.duties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("duties", idx)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results / Hasil Kerja */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>
              Hasil & Pencapaian
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("results")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="size-3.5" /> Tambah Hasil
            </button>
          </div>
          <div className="space-y-2">
            {form.results.map((result, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={result}
                  placeholder={`Pencapaian / Hasil ${idx + 1}`}
                  onChange={(e) =>
                    handleArrayChange("results", idx, e.target.value)
                  }
                  className={inputCls}
                />
                {form.results.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("results", idx)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>
              Teknologi / Keahlian yang Digunakan
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("stack")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="size-3.5" /> Tambah Keahlian
            </button>
          </div>
          <div className="space-y-2">
            {form.stack.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  placeholder="contoh: React, TypeScript, Docker"
                  onChange={(e) =>
                    handleArrayChange("stack", idx, e.target.value)
                  }
                  className={inputCls}
                />
                {form.stack.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("stack", idx)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={checkboxCardCls}>
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) =>
                setForm({ ...form, isVisible: e.target.checked })
              }
              className={checkboxInputCls}
            />
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Tampilkan di Portofolio Publik
              </span>
              <span className="block text-xs text-slate-500">
                Pengalaman ini akan terlihat pada halaman riwayat pengalaman publik.
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
