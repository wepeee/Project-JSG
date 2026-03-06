"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "success" | "error" | "warning" | "info";

interface AlertOpts {
  title?: string;
  message: string;
  variant?: Variant;
}

interface ConfirmOpts {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
}

interface AppAlertCtx {
  showAlert: (opts: AlertOpts) => Promise<void>;
  showConfirm: (opts: ConfirmOpts) => Promise<boolean>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = React.createContext<AppAlertCtx | null>(null);

// ─── Internal state ───────────────────────────────────────────────────────────

interface ModalState {
  open: boolean;
  kind: "alert" | "confirm";
  variant: Variant;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  resolve: ((v: boolean) => void) | null;
}

const DEFAULT: ModalState = {
  open: false,
  kind: "alert",
  variant: "info",
  title: "",
  message: "",
  confirmLabel: "OK",
  cancelLabel: "Batal",
  resolve: null,
};

// ─── Icon & colour helpers ────────────────────────────────────────────────────

function variantIcon(v: Variant) {
  const cls = "h-6 w-6";
  switch (v) {
    case "success": return <CheckCircle2 className={`${cls} text-emerald-500`} />;
    case "error":   return <XCircle      className={`${cls} text-red-500`} />;
    case "warning": return <AlertTriangle className={`${cls} text-amber-500`} />;
    default:        return <Info          className={`${cls} text-blue-500`} />;
  }
}

function variantBg(v: Variant) {
  switch (v) {
    case "success": return "bg-emerald-500/10 border-emerald-500/20";
    case "error":   return "bg-red-500/10 border-red-500/20";
    case "warning": return "bg-amber-500/10 border-amber-500/20";
    default:        return "bg-blue-500/10 border-blue-500/20";
  }
}

function confirmBtnClass(v: Variant) {
  switch (v) {
    case "success": return "bg-emerald-600 hover:bg-emerald-700 text-white";
    case "error":   return "bg-red-600    hover:bg-red-700    text-white";
    case "warning": return "bg-amber-500  hover:bg-amber-600  text-white";
    default:        return "bg-blue-600   hover:bg-blue-700   text-white";
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ModalState>(DEFAULT);

  const showAlert = React.useCallback(
    ({ title, message, variant = "info" }: AlertOpts): Promise<void> =>
      new Promise<void>((res) => {
        setState({
          open: true,
          kind: "alert",
          variant,
          title: title ?? variantTitle(variant),
          message,
          confirmLabel: "OK",
          cancelLabel: "Batal",
          resolve: () => res(),
        });
      }),
    [],
  );

  const showConfirm = React.useCallback(
    ({
      title,
      message,
      variant = "warning",
      confirmLabel = "Ya, Lanjutkan",
      cancelLabel = "Batal",
    }: ConfirmOpts): Promise<boolean> =>
      new Promise<boolean>((res) => {
        setState({
          open: true,
          kind: "confirm",
          variant,
          title: title ?? "Konfirmasi",
          message,
          confirmLabel,
          cancelLabel,
          resolve: res,
        });
      }),
    [],
  );

  const handleClose = (value: boolean) => {
    state.resolve?.(value);
    setState(DEFAULT);
  };

  return (
    <Ctx.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* ── Modal Overlay ── */}
      {state.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          {/* Backdrop click to dismiss alert only */}
          {state.kind === "alert" && (
            <div className="absolute inset-0" onClick={() => handleClose(false)} />
          )}

          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl"
            style={{ background: "var(--background, #1a1a2e)" }}
          >
            {/* Coloured top stripe */}
            <div
              className={`h-1.5 w-full ${
                state.variant === "success" ? "bg-emerald-500" :
                state.variant === "error"   ? "bg-red-500" :
                state.variant === "warning" ? "bg-amber-500" :
                "bg-blue-500"
              }`}
            />

            <div className="p-6">
              {/* Icon + Title */}
              <div className="mb-4 flex items-start gap-3">
                <div className={`flex-shrink-0 rounded-xl border p-2 ${variantBg(state.variant)}`}>
                  {variantIcon(state.variant)}
                </div>
                <div className="min-w-0 pt-1">
                  <h3 className="text-base font-bold leading-tight">{state.title}</h3>
                </div>
              </div>

              {/* Message */}
              <p className="text-muted-foreground mb-6 whitespace-pre-wrap text-sm leading-relaxed">
                {state.message}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                {state.kind === "confirm" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4"
                    onClick={() => handleClose(false)}
                  >
                    {state.cancelLabel}
                  </Button>
                )}
                <Button
                  size="sm"
                  className={`px-5 ${confirmBtnClass(state.variant)}`}
                  onClick={() => handleClose(true)}
                  autoFocus
                >
                  {state.confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppAlert() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAppAlert must be used inside <AppAlertProvider>");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function variantTitle(v: Variant): string {
  switch (v) {
    case "success": return "Berhasil";
    case "error":   return "Error";
    case "warning": return "Peringatan";
    default:        return "Informasi";
  }
}
