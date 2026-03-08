"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "~/components/ui/button";

interface SubmitReportConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function SubmitReportConfirmModal({
  open,
  onConfirm,
  onCancel,
  title = "Kirim Laporan?",
  message = "Apakah Anda yakin data sudah benar dan siap dikirim untuk verifikasi PPIC?",
  confirmLabel = "Ya, Kirim Sekarang",
  cancelLabel = "Batal",
}: SubmitReportConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[400] flex items-center justify-center p-4"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
        <div className="h-1.5 w-full bg-blue-500" />

        <div className="p-6 sm:p-7">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2">
              <Info className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="pt-1 text-2xl font-bold leading-tight">{title}</h3>
          </div>

          <p className="mb-8 whitespace-pre-wrap text-xl leading-relaxed text-slate-300">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={onConfirm}
              autoFocus
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
