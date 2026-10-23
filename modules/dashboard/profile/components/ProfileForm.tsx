// src/modules/profile/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { Globe, Pencil, Plus, Trash2, User } from "lucide-react";
import { swalConfirm, swalError, swalSuccess } from "@/utils/swal";
import { usePermission } from "@/context/PermissionContext";
import ImageUploadField from "@/components/ImageUploadField";
import {
  inputCls,
  textareaCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import {
  createProfileAction,
  deleteProfileAction,
  updateProfileAction,
} from "../profile.actions";
import {
  type ProfileFormInput,
  type ProfileRow,
} from "../profile.schema";

type Props = {
  profile: ProfileRow | null;
};

export default function ProfileForm({ profile }: Props) {
  const isEdit = Boolean(profile);
  const { can } = usePermission();

  const [form, setForm] = useState<ProfileFormInput>({
    fullName: profile?.fullName ?? "",
    title: profile?.title ?? "",
    brand: profile?.brand ?? "",
    contentName: profile?.contentName ?? "",
    tagline: profile?.tagline ?? "",
    intro: profile?.intro ?? "",
    bio: profile?.bio ?? "",
    photoUrl: profile?.photoUrl ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormInput, string>>>({});
  const [pending, setPending] = useState(false);

  const canAdd = can("profile", "add");
  const canEdit = can("profile", "edit");
  const canDelete = can("profile", "delete");

  async function handleDelete(row: ProfileRow) {
    const ok = await swalConfirm({
      title: `Hapus profil "${row.fullName}"?`,
      text: "Profil utama website akan dikosongkan.",
      confirmText: "Ya, hapus",
    });
    if (!ok) return;

    setPending(true);
    const res = await deleteProfileAction(row.uuid);
    setPending(false);

    if (res.ok) {
      swalSuccess(res.message ?? "Profil berhasil dihapus");
    } else {
      swalError("Gagal menghapus", res.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setErrors({});

    const res =
      isEdit && profile
        ? await updateProfileAction(profile.uuid, form)
        : await createProfileAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Kolom Kiri: Live Identity Preview Card */}
      <div className="space-y-4 lg:col-span-1">
        <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pratinjau Identitas
          </p>

          <div className="mt-4 flex flex-col items-center text-center">
            <div className="relative size-24 overflow-hidden rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm">
              {form.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.photoUrl}
                  alt={form.fullName || "Foto Profil"}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-3xl font-bold text-blue-600">
                  {form.fullName ? form.fullName.charAt(0).toUpperCase() : <User className="size-10 text-slate-400" />}
                </div>
              )}
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              {form.fullName || "Nama Lengkap Anda"}
            </h3>
            <p className="text-xs font-semibold text-blue-600">
              {form.title || "Spesialisasi / Jabatan"}
            </p>

            {form.brand && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <Globe className="size-3 text-slate-400" />
                {form.brand}
              </span>
            )}
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
            {form.tagline && (
              <div>
                <p className="font-semibold text-slate-800">Tagline:</p>
                <p className="mt-0.5 text-slate-500 italic">&ldquo;{form.tagline}&rdquo;</p>
              </div>
            )}
            {form.intro && (
              <div>
                <p className="font-semibold text-slate-800">Intro Singkat:</p>
                <p className="mt-0.5 text-slate-500 line-clamp-3">{form.intro}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Form Editor */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
          noValidate
        >
          {/* Section 1: Data Pokok */}
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              1. Identitas & Brand
            </h3>
            <p className="text-xs text-slate-500">
              Informasi dasar yang menjadi headline portofolio publik Anda.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  placeholder="contoh: Tangkas Risdianto"
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  aria-invalid={!!errors.fullName}
                  className={inputCls}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Jabatan / Posisi <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  value={form.title}
                  placeholder="contoh: Full Stack Developer"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  aria-invalid={!!errors.title}
                  className={inputCls}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Brand Domain <span className="text-red-500">*</span>
                </label>
                <input
                  id="brand"
                  value={form.brand}
                  placeholder="contoh: trcodes.dev"
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  aria-invalid={!!errors.brand}
                  className={inputCls}
                />
                {errors.brand && (
                  <p className="mt-1 text-xs text-red-600">{errors.brand}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contentName"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Nama Konten / Rubrik <span className="text-red-500">*</span>
                </label>
                <input
                  id="contentName"
                  value={form.contentName}
                  placeholder="contoh: ngoding suka-suka"
                  onChange={(e) => setForm({ ...form, contentName: e.target.value })}
                  aria-invalid={!!errors.contentName}
                  className={inputCls}
                />
                {errors.contentName && (
                  <p className="mt-1 text-xs text-red-600">{errors.contentName}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Narasi & Bio */}
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              2. Narasi & Perkenalan Diri
            </h3>
            <p className="text-xs text-slate-500">
              Perkenalan yang menjelaskan filosofi, antusiasme, dan latar belakang Anda.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="tagline"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Tagline Ringkas <span className="text-red-500">*</span>
                </label>
                <input
                  id="tagline"
                  value={form.tagline}
                  placeholder="contoh: Membangun sistem web yang terukur dan aman."
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  aria-invalid={!!errors.tagline}
                  className={inputCls}
                />
                {errors.tagline && (
                  <p className="mt-1 text-xs text-red-600">{errors.tagline}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="intro"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Intro Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="intro"
                  rows={2}
                  value={form.intro}
                  placeholder="Perkenalan singkat untuk hero section..."
                  onChange={(e) => setForm({ ...form, intro: e.target.value })}
                  aria-invalid={!!errors.intro}
                  className={textareaCls}
                />
                {errors.intro && (
                  <p className={errorCls}>{errors.intro}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className={labelCls}
                >
                  Bio Lengkap <span className="text-xs text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  placeholder="Cerita lengkap perjalanan karir atau visi Anda..."
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  aria-invalid={!!errors.bio}
                  className={textareaCls}
                />
                {errors.bio && (
                  <p className={errorCls}>{errors.bio}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Foto Profil */}
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              3. Foto Profil
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan foto beresolusi jelas dalam format PNG, JPG, atau WEBP.
            </p>

            <div className="mt-4">
              <ImageUploadField
                id="photoUrl"
                label="Unggah Foto Profil"
                folder="profile"
                value={form.photoUrl ?? ""}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                error={errors.photoUrl}
                helperText="Mendukung upload lokal langsung ke server atau URL eksternal."
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {isEdit && profile && canDelete && (
              <button
                type="button"
                onClick={() => handleDelete(profile)}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Hapus
              </button>
            )}
            {((!isEdit && canAdd) || (isEdit && canEdit)) && (
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
              >
                {!isEdit ? <Plus className="size-4" /> : <Pencil className="size-4" />}
                {pending ? "Menyimpan..." : isEdit ? "Ubah" : "Tambah"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
