// src/modules/chapter/components/ChapterModal.tsx
"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import ImageUploadField from "@/components/ImageUploadField";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  selectCls,
  textareaCls,
  numberInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import { createChapterAction, updateChapterAction } from "../chapter.actions";
import {
  type ChapterFormInput,
  type ChapterRow,
} from "../chapter.schema";
import { PUBLISH_STATUSES, type PublishStatusType } from "../../project/project.schema";
import { chapterKeys } from "../chapter.hooks";

type Props = {
  projectUuid: string;
  chapter: ChapterRow | null;
  onClose: () => void;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ChapterModal({ projectUuid, chapter, onClose }: Props) {
  const isEdit = chapter !== null;

  const [form, setForm] = useState<ChapterFormInput>({
    projectUuid,
    slug: chapter?.slug ?? "",
    title: chapter?.title ?? "",
    icon: chapter?.icon ?? "fa-bolt",
    definition: chapter?.definition ?? "",
    application: chapter?.application ?? "",
    teaser: chapter?.teaser ?? "",
    coverUrl: chapter?.coverUrl ?? "",
    coverAlt: chapter?.coverAlt ?? "",
    content: chapter?.content ?? [],
    status: chapter?.status ?? "DRAFT",
    sortOrder: chapter?.sortOrder ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const handleAddBlock = (type: "h" | "p" | "quote" | "code" | "note") => {
    setForm({
      ...form,
      content: [...form.content, { t: type, x: "" }],
    });
  };

  const handleBlockChange = (index: number, val: string) => {
    const updated = [...form.content];
    if (updated[index].t !== "ul") {
      updated[index] = { ...updated[index], x: val };
    }
    setForm({ ...form, content: updated });
  };

  const handleRemoveBlock = (index: number) => {
    setForm({
      ...form,
      content: form.content.filter((_, i) => i !== index),
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setErrors({});

    const res = isEdit
      ? await updateChapterAction(chapter.uuid, projectUuid, form)
      : await createChapterAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: chapterKeys.project(projectUuid) });

    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Edit Bab Proyek" : "Tambah Bab Baru"}
      subtitle={
        isEdit
          ? "Kelola konten teknis, definisi konsep, dan artikel bab proyek."
          : "Tulis artikel atau bab teknis baru untuk studi kasus proyek."
      }
      icon={BookOpen}
      onClose={onClose}
      closeDisabled={pending}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="chap-title" className={labelCls}>
              Judul Bab <span className="text-red-500">*</span>
            </label>
            <input
              id="chap-title"
              value={form.title}
              autoFocus
              placeholder="contoh: Setup Autentikasi JWT"
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: !isEdit && !prev.slug ? slugify(title) : prev.slug,
                }));
              }}
              aria-invalid={!!errors.title}
              className={inputCls}
            />
            {errors.title && <p className={errorCls}>{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="chap-slug" className={labelCls}>
              Slug URL <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="chap-slug"
                value={form.slug}
                placeholder="contoh: setup-autentikasi-jwt"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                aria-invalid={!!errors.slug}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => {
                  if (form.title) setForm({ ...form, slug: slugify(form.title) });
                }}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                Generate
              </button>
            </div>
            {errors.slug && <p className={errorCls}>{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="chap-icon" className={labelCls}>
              FontAwesome Icon <span className="text-red-500">*</span>
            </label>
            <input
              id="chap-icon"
              value={form.icon}
              placeholder="fa-bolt, fa-lock, fa-database"
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              aria-invalid={!!errors.icon}
              className={inputCls}
            />
            {errors.icon && <p className={errorCls}>{errors.icon}</p>}
          </div>

          <div>
            <label htmlFor="chap-status" className={labelCls}>
              Status Bab <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="chap-status"
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
            <label htmlFor="chap-sort" className={labelCls}>
              Urutan Bab
            </label>
            <input
              id="chap-sort"
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
          <label htmlFor="chap-definition" className={labelCls}>
            Apa itu (Definition) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="chap-definition"
            rows={2}
            value={form.definition}
            placeholder="Jelaskan konsep dasar bab ini..."
            onChange={(e) => setForm({ ...form, definition: e.target.value })}
            aria-invalid={!!errors.definition}
            className={textareaCls}
          />
          {errors.definition && <p className={errorCls}>{errors.definition}</p>}
        </div>

        <div>
          <label htmlFor="chap-application" className={labelCls}>
            Cara Saya Memakainya (Application) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="chap-application"
            rows={2}
            value={form.application}
            placeholder="Jelaskan bagaimana konsep ini Anda terapkan dalam proyek..."
            onChange={(e) => setForm({ ...form, application: e.target.value })}
            aria-invalid={!!errors.application}
            className={textareaCls}
          />
          {errors.application && <p className={errorCls}>{errors.application}</p>}
        </div>

        <div>
          <label htmlFor="chap-teaser" className={labelCls}>
            Teaser / Poin Menarik <span className="text-xs text-slate-400 font-normal">(opsional)</span>
          </label>
          <input
            id="chap-teaser"
            value={form.teaser}
            placeholder="Poin yang bikin pembaca penasaran..."
            onChange={(e) => setForm({ ...form, teaser: e.target.value })}
            className={inputCls}
          />
        </div>

        {/* Cover */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Cover Bab (Gambar)"
            folder="chapters"
            value={form.coverUrl ?? ""}
            onChange={(url) => setForm({ ...form, coverUrl: url })}
            error={errors.coverUrl}
            placeholder="Pilih file gambar atau masukkan URL..."
          />

          <div>
            <label htmlFor="chap-cover-alt" className={labelCls}>
              Cover Alt Text <span className="text-xs text-slate-400 font-normal">(opsional)</span>
            </label>
            <input
              id="chap-cover-alt"
              value={form.coverAlt}
              placeholder="Deskripsi singkat gambar cover..."
              onChange={(e) => setForm({ ...form, coverAlt: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        {/* Content Blocks Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Isi Lengkap Bab (Content Blocks)
              </h4>
              <p className="text-[11px] text-slate-400">
                Susun artikel dengan blok paragraf, heading, kode, atau catatan.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAddBlock("h")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                + Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("p")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                + Paragraf
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("quote")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                + Kutipan
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("code")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                + Kode
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("note")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                + Catatan
              </button>
            </div>
          </div>

          {form.content.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-400">
              Belum ada blok konten kustom. Klik tombol di atas untuk menambah paragraf, heading, kode, atau catatan.
            </p>
          ) : (
            <div className="space-y-3">
              {form.content.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-blue-700 border border-blue-100">
                      Blok #{idx + 1}: {block.t}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(idx)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Hapus blok"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  {block.t !== "ul" && (
                    <textarea
                      rows={block.t === "code" || block.t === "p" ? 3 : 2}
                      value={block.x}
                      placeholder={`Isi untuk blok ${block.t}...`}
                      onChange={(e) => handleBlockChange(idx, e.target.value)}
                      className={textareaCls}
                    />
                  )}
                </div>
              ))}
            </div>
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
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : isEdit ? "Ubah" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
