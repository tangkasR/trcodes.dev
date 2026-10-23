"use client";

import { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/lib/upload.action";
import { swalError, swalSuccess } from "@/utils/swal";
import type { UploadFolder } from "@/lib/upload.service";

type ImageUploadFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: UploadFolder;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
};

export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
  folder,
  error,
  helperText,
  disabled = false,
  placeholder = "https://... atau /uploads/...",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file) return;

    // Validasi sisi client untuk feedback cepat
    if (!file.type.startsWith("image/")) {
      swalError("Format salah", "Hanya file gambar (JPG, PNG, WEBP, GIF) yang diperbolehkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      swalError("Ukuran terlalu besar", "Ukuran gambar maksimal adalah 5 MB.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await uploadImageAction(formData);
      if (res.ok && res.data) {
        onChange(res.data.url);
        swalSuccess("Gambar diunggah", "File berhasil disimpan ke folder public/uploads.");
      } else {
        swalError("Gagal upload", res.message ?? "Terjadi kesalahan saat mengunggah gambar.");
      }
    } catch {
      swalError("Gagal upload", "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <LinkIcon className="size-3" />
          {showUrlInput ? "Tutup URL Manual" : "Gunakan URL Manual"}
        </button>
      </div>

      {showUrlInput && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
          <input
            id={id}
            type="text"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Masukkan tautan gambar eksternal atau path /uploads/ langsung.
          </p>
        </div>
      )}

      {/* Preview & Upload Zone */}
      {value ? (
        <div className="relative flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="size-full object-cover"
              onError={(e) => {
                // fallback jika link tidak valid
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100?text=Gambar";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-700">
              {value}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">
              ✓ Gambar terpilih
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Ganti Gambar
              </button>
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <X className="size-3.5" /> Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
            isDragOver
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-300 hover:border-slate-400 bg-white"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 className="size-8 animate-spin text-blue-600" />
              <p className="mt-2 text-xs font-medium text-slate-600">
                Mengunggah gambar ke server...
              </p>
            </div>
          ) : (
            <>
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Upload className="size-5" />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-700">
                <span className="text-blue-600 hover:underline">Klik untuk pilih file</span> atau tarik file ke sini
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                PNG, JPG, WEBP, atau GIF (Maks. 5 MB)
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
