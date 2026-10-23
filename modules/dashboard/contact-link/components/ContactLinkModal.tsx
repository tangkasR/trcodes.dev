// src/modules/contact-link/components/ContactLinkModal.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";
import Modal from "@/components/Modal";
import { swalError, swalSuccess } from "@/utils/swal";
import {
  inputCls,
  selectCls,
  numberInputCls,
  checkboxCardCls,
  checkboxInputCls,
  labelCls,
  errorCls,
} from "@/utils/form-styles";
import {
  createContactLinkAction,
  updateContactLinkAction,
} from "../contact-link.actions";
import {
  CONTACTPLATFORM,
  type ContactLinkFormInput,
  type ContactLinkRow,
  type ContactPlatform,
} from "../contact-link.schema";
import { useQueryClient } from "@tanstack/react-query";
import { contactLinkKeys } from "../contact-link.hooks";

type Props = { contactLink: ContactLinkRow | null; onClose: () => void };

export default function ContactLinkModal({ contactLink, onClose }: Props) {
  const isEdit = contactLink !== null;

  const [form, setForm] = useState<ContactLinkFormInput>({
    platform: contactLink?.platform ?? "EMAIL",
    displayText: contactLink?.displayText ?? "",
    url: contactLink?.url ?? "",
    sortOrder: contactLink?.sortOrder ?? 0,
    isVisible: contactLink?.isVisible ?? true,
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
      ? await updateContactLinkAction(contactLink.uuid, form)
      : await createContactLinkAction(form);

    setPending(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      else swalError("Gagal menyimpan", res.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: contactLinkKeys.all });

    onClose();
    swalSuccess(res.message ?? "Berhasil disimpan");
  }

  return (
    <Modal
      title={isEdit ? "Ubah Kontak Link" : "Tambah Kontak Link"}
      subtitle={
        isEdit
          ? "Perbarui tautan kontak dan media sosial di portofolio."
          : "Tambah tautan kontak profesional baru ke landing page."
      }
      icon={Link2}
      onClose={onClose}
      closeDisabled={pending}
    >
      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        <div>
          <label htmlFor="platform" className={labelCls}>
            Platform <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="platform"
              value={form.platform}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value as ContactPlatform })
              }
              aria-invalid={!!errors.platform}
              className={selectCls}
            >
              <option value="">Pilih platform</option>
              {CONTACTPLATFORM.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.platform && <p className={errorCls}>{errors.platform}</p>}
        </div>

        <div>
          <label htmlFor="displayText" className={labelCls}>
            Teks Tampilan (Display Text) <span className="text-red-500">*</span>
          </label>
          <input
            id="displayText"
            value={form.displayText}
            autoFocus
            placeholder="contoh: linkedin.com/in/tangkas"
            onChange={(e) => setForm({ ...form, displayText: e.target.value })}
            aria-invalid={!!errors.displayText}
            className={inputCls}
          />
          {errors.displayText && <p className={errorCls}>{errors.displayText}</p>}
        </div>

        <div>
          <label htmlFor="url" className={labelCls}>
            URL Tujuan / Tautan <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            value={form.url}
            placeholder="https://... atau mailto:nama@email.com"
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            aria-invalid={!!errors.url}
            className={inputCls}
          />
          {errors.url && <p className={errorCls}>{errors.url}</p>}
        </div>

        <div>
          <label htmlFor="sortOrder" className={labelCls}>
            Urutan Tampil (Sort Order)
          </label>
          <input
            id="sortOrder"
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

        <div>
          <label className={checkboxCardCls}>
            <input
              id="isVisible"
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
                Tautan kontak ini akan ditampilkan pada header dan footer publik.
              </span>
            </div>
          </label>
          {errors.isVisible && <p className={errorCls}>{errors.isVisible}</p>}
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
