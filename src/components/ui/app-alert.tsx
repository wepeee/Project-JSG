"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

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

const Ctx = React.createContext<AppAlertCtx | null>(null);

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

function variantIcon(v: Variant) {
  const cls = "h-6 w-6";
  switch (v) {
    case "success":
      return <CheckCircle2 className={`${cls} text-success`} />;
    case "error":
      return <XCircle className={`${cls} text-destructive`} />;
    case "warning":
      return <AlertTriangle className={`${cls} text-warning`} />;
    default:
      return <Info className={`${cls} text-info`} />;
  }
}

function variantBg(v: Variant) {
  switch (v) {
    case "success":
      return "bg-success-soft border-success/30";
    case "error":
      return "bg-destructive/10 border-destructive/30";
    case "warning":
      return "bg-warning-soft border-warning/30";
    default:
      return "bg-info-soft border-info/30";
  }
}

function confirmBtnClass(v: Variant) {
  switch (v) {
    case "success":
      return "bg-success text-success-foreground hover:bg-success/90";
    case "error":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    case "warning":
      return "bg-warning text-warning-foreground hover:bg-warning/90";
    default:
      return "bg-info text-info-foreground hover:bg-info/90";
  }
}

function variantTitle(v: Variant): string {
  switch (v) {
    case "success":
      return "Berhasil";
    case "error":
      return "Error";
    case "warning":
      return "Peringatan";
    default:
      return "Informasi";
  }
}

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ModalState>(DEFAULT);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

      {state.open &&
        mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[2147483000] flex items-center justify-center p-4">
            <div
              className="bg-overlay pointer-events-auto absolute inset-0 backdrop-blur-sm"
              onClick={
                state.kind === "alert" ? () => handleClose(false) : undefined
              }
            />

            <div
              className="bg-background pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl"
            >
              <div
                className={`h-1.5 w-full ${
                  state.variant === "success"
                    ? "bg-success"
                    : state.variant === "error"
                      ? "bg-destructive"
                      : state.variant === "warning"
                        ? "bg-warning"
                        : "bg-info"
                }`}
              />

              <div className="p-6">
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 rounded-xl border p-2 ${variantBg(state.variant)}`}
                  >
                    {variantIcon(state.variant)}
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="text-base font-bold leading-tight">
                      {state.title}
                    </h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 whitespace-pre-wrap text-sm leading-relaxed">
                  {state.message}
                </p>

                <div className="flex justify-end gap-2">
                  {state.kind === "confirm" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-4"
                      onClick={() => handleClose(false)}
                    >
                      {state.cancelLabel}
                    </Button>
                  )}
                  <Button
                    type="button"
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
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}

export function useAppAlert() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAppAlert must be used inside <AppAlertProvider>");
  return ctx;
}

