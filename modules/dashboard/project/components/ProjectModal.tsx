// src/modules/project/components/ProjectModal.tsx
"use client";

import { useState } from "react";
import { ChevronDown, FolderKanban, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import ImageUploadField from "@/components/ImageUploadField";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  selectCls,
  textareaCls,
  numberInputCls,
  checkboxCardCls,
  checkboxInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import { createProjectAction, updateProjectAction } from "../project.actions";
import {
  PUBLISH_STATUSES,
  type ProjectFormInput,
  type ProjectRow,
  type PublishStatusType,
} from "../project.schema";
import { projectKeys } from "../project.hooks";

type Props = { project: ProjectRow | null; onClose: () => void };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProjectModal({ project, onClose }: Props) {
  const isEdit = project !== null;

  const [form, setForm] = useState<ProjectFormInput>({
    slug: project?.slug ?? "",
    name: project?.name ?? "",
    short: project?.short ?? "",
    description: project?.description ?? "",
    features: project?.features ?? [""],
    stack: project?.stack ?? [""],
    demoImageUrl: project?.demoImageUrl ?? "",
    demoVideoUrl: project?.demoVideoUrl ?? "",
    chaptersHeading: project?.chaptersHeading ?? "",
    isDefault: project?.isDefault ?? false,
    status: project?.status ?? "DRAFT",
    sortOrder: project?.sortOrder ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const handleArrayChange = (
    field: "features" | "stack",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field: "features" | "stack") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (field: "features" | "stack", index: number) => {
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

    const cleaned = {
      ...form,
      features: form.features.map((f) => f.trim()).filter(Boolean),
      stack: form.stack.map((s) => s.trim()).filter(Boolean),
    };

    const res = isEdit
      ? await updateProjectAction(project.uuid, cleaned)
      : await createProjectAction(cleaned);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: projectKeys.all });

    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Edit Proyek" : "Tambah Proyek Baru"}
      subtitle={
        isEdit
          ? "Kelola rincian studi kasus, teknologi, dan status publikasi proyek."
          : "Publikasikan studi kasus dan portofolio proyek baru ke publik."
      }
      icon={FolderKanban}
      onClose={onClose}
      closeDisabled={pending}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-name" className={labelCls}>
              Nama Proyek <span className="text-red-500">*</span>
            </label>
            <input
              id="proj-name"
              value={form.name}
              autoFocus
              placeholder="contoh: User Role Management"
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: !isEdit && !prev.slug ? slugify(name) : prev.slug,
                }));
              }}
              aria-invalid={!!errors.name}
              className={inputCls}
            />
            {errors.name && <p className={errorCls}>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="proj-slug" className={labelCls}>
              Slug URL <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="proj-slug"
                value={form.slug}
                placeholder="contoh: user-role-management"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                aria-invalid={!!errors.slug}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => {
                  if (form.name) setForm({ ...form, slug: slugify(form.name) });
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
          <label htmlFor="proj-short" className={labelCls}>
            Ringkasan Singkat (Satu Kalimat) <span className="text-red-500">*</span>
          </label>
          <input
            id="proj-short"
            value={form.short}
            placeholder="contoh: Platform manajemen peran dan izin berbasis role-based access control."
            onChange={(e) => setForm({ ...form, short: e.target.value })}
            aria-invalid={!!errors.short}
            className={inputCls}
          />
          {errors.short && <p className={errorCls}>{errors.short}</p>}
        </div>

        <div>
          <label htmlFor="proj-desc" className={labelCls}>
            Deskripsi Proyek <span className="text-red-500">*</span>
          </label>
          <textarea
            id="proj-desc"
            rows={4}
            value={form.description}
            placeholder="Jelaskan tujuan proyek, masalah yang diselesaikan, dan arsitekturnya..."
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            aria-invalid={!!errors.description}
            className={textareaCls}
          />
          {errors.description && <p className={errorCls}>{errors.description}</p>}
        </div>

        {/* Features / Yang bisa dilakukan */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>
              Fitur Utama / Yang Bisa Dilakukan
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("features")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="size-3.5" /> Tambah Fitur
            </button>
          </div>
          <div className="space-y-2">
            {form.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={feat}
                  placeholder={`Fitur ${idx + 1}`}
                  onChange={(e) =>
                    handleArrayChange("features", idx, e.target.value)
                  }
                  className={inputCls}
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("features", idx)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stack / Teknologi */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>
              Teknologi yang Digunakan
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("stack")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="size-3.5" /> Tambah Stack
            </button>
          </div>
          <div className="space-y-2">
            {form.stack.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  placeholder="contoh: Next.js 16, PostgreSQL"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploadField
            id="proj-demo-image"
            label="Gambar Demo / Thumbnail"
            folder="projects"
            value={form.demoImageUrl}
            onChange={(url) => setForm({ ...form, demoImageUrl: url })}
            error={errors.demoImageUrl}
            placeholder="Pilih file gambar atau masukkan URL..."
          />

          <div>
            <label htmlFor="proj-demo-video" className={labelCls}>
              URL Demo Video{" "}
              <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <input
              id="proj-demo-video"
              type="url"
              value={form.demoVideoUrl}
              placeholder="https://youtube.com/... atau URL video"
              onChange={(e) =>
                setForm({ ...form, demoVideoUrl: e.target.value })
              }
              aria-invalid={!!errors.demoVideoUrl}
              className={inputCls}
            />
            {errors.demoVideoUrl && (
              <p className={errorCls}>{errors.demoVideoUrl}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="proj-chapters-heading" className={labelCls}>
            Judul Section Bab{" "}
            <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input
            id="proj-chapters-heading"
            value={form.chaptersHeading}
            placeholder="contoh: BAB / ARTIKEL TEKNIS"
            onChange={(e) =>
              setForm({ ...form, chaptersHeading: e.target.value })
            }
            aria-invalid={!!errors.chaptersHeading}
            className={inputCls}
          />
          {errors.chaptersHeading && (
            <p className={errorCls}>{errors.chaptersHeading}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-status" className={labelCls}>
              Status Publikasi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="proj-status"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as PublishStatusType,
                  })
                }
                className={selectCls}
              >
                {PUBLISH_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === "PUBLISHED" ? "PUBLISHED (Terbit)" : "DRAFT (Konsep)"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label htmlFor="proj-sort-order" className={labelCls}>
              Urutan Tampil (Sort Order)
            </label>
            <input
              id="proj-sort-order"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
              aria-invalid={!!errors.sortOrder}
              className={numberInputCls}
            />
            {errors.sortOrder && (
              <p className={errorCls}>{errors.sortOrder}</p>
            )}
          </div>
        </div>

        <div>
          <label className={checkboxCardCls}>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
              className={checkboxInputCls}
            />
            <div>
              <span className="block text-sm font-semibold text-slate-800">
                Jadikan Proyek Utama (Hero / Default)
              </span>
              <span className="block text-xs text-slate-500">
                Proyek ini akan disorot di landing page utama portofolio.
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
