"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import {
  Clock,
  User,
  AlertTriangle,
  Package,
  History,
  Save,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface ProductionReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    pro: any;
    step: any;
    shift: number;
  } | null;
}

export function ProductionReportModal({
  open,
  onOpenChange,
  task,
}: ProductionReportModalProps) {
  const { data: session } = useSession();
  const [qtyGood, setQtyGood] = React.useState("");
  const [qtyReject, setQtyReject] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [operatorName, setOperatorName] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [downtime, setDowntime] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  // Draft Key
  const draftKey = React.useMemo(
    () => (task ? `pro_report_draft_${task.step.id}` : ""),
    [task],
  );

  const saveToDraft = (data: Record<string, any>) => {
    if (!draftKey) return;
    try {
      const current = localStorage.getItem(draftKey);
      const prev = current ? JSON.parse(current) : {};
      const next = { ...prev, ...data };
      localStorage.setItem(draftKey, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  };

  React.useEffect(() => {
    if (open) {
      // Set operator name from session
      setOperatorName(session?.user?.name ?? "");

      if (draftKey) {
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          try {
            const d = JSON.parse(saved);
            // Note: Operator name is NOT loaded from draft to enforce session user
            setStartTime(d.startTime || new Date().toTimeString().slice(0, 5));
            setEndTime(d.endTime || "");
            setQtyGood(d.qtyGood || "");
            setQtyReject(d.qtyReject || "");
            setDowntime(d.downtime || "");
            setNotes(d.notes || "");
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        } else {
          // Reset
          setStartTime(new Date().toTimeString().slice(0, 5));
          setEndTime("");
          setQtyGood("");
          setQtyReject("");
          setDowntime("");
          setNotes("");
        }
      }
    }
  }, [open, draftKey, session]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        `Laporan Disimpan!\nOperator: ${operatorName}\nGood: ${qtyGood}, Reject: ${qtyReject}`,
      );

      // Clear Draft
      if (draftKey) localStorage.removeItem(draftKey);

      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 rounded-2xl p-0 sm:max-w-lg">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Laporan Produksi Harian</DialogTitle>
          <DialogDescription>{task.pro.productName}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Operator & Time Info */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                <User className="h-4 w-4" /> Operator & Waktu
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="operator" className="text-xs">
                    Nama Operator
                  </Label>
                  <Input
                    id="operator"
                    value={operatorName}
                    readOnly
                    className="text-muted-foreground cursor-not-allowed bg-slate-100 font-medium dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Shift</Label>
                  <div className="text-muted-foreground flex h-10 items-center rounded-md bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
                    Shift {task.shift}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="startTime" className="text-xs">
                    Waktu Mulai
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      saveToDraft({ startTime: e.target.value });
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endTime" className="text-xs">
                    Waktu Selesai
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      saveToDraft({ endTime: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Production Results */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                <Package className="h-4 w-4" /> Hasil Produksi
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="qtyGood" className="text-xs">
                    Hasil Baik (Good)
                  </Label>
                  <Input
                    id="qtyGood"
                    type="number"
                    placeholder="0"
                    value={qtyGood}
                    onChange={(e) => {
                      setQtyGood(e.target.value);
                      saveToDraft({ qtyGood: e.target.value });
                    }}
                    required
                    className="h-12 border-blue-100 bg-blue-50/50 text-center text-lg font-bold dark:border-blue-800 dark:bg-blue-900/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="qtyReject"
                    className="text-destructive text-xs"
                  >
                    Reject (Rusak)
                  </Label>
                  <Input
                    id="qtyReject"
                    type="number"
                    placeholder="0"
                    value={qtyReject}
                    onChange={(e) => {
                      setQtyReject(e.target.value);
                      saveToDraft({ qtyReject: e.target.value });
                    }}
                    className="border-destructive/30 focus-visible:ring-destructive h-12 bg-red-50/50 text-center text-lg font-bold dark:bg-red-900/10"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Downtime & Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-amber-600/80 uppercase">
                <AlertTriangle className="h-4 w-4" /> Kendala / Downtime
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="downtime" className="text-xs">
                    Durasi (Menit)
                  </Label>
                  <Input
                    id="downtime"
                    type="number"
                    placeholder="0"
                    value={downtime}
                    onChange={(e) => {
                      setDowntime(e.target.value);
                      saveToDraft({ downtime: e.target.value });
                    }}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="notes" className="text-xs">
                    Keterangan / Catatan
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Jelaskan kendala atau catatan..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      saveToDraft({ notes: e.target.value });
                    }}
                    className="h-[42px] min-h-[42px] resize-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="items-center p-6 pt-2">
          <span className="text-muted-foreground/60 mr-auto flex items-center gap-1.5 text-[10px] italic">
            <Save className="h-3 w-3" /> Draft tersimpan otomatis
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              form="report-form"
              type="submit"
              disabled={loading}
              className="bg-blue-600 px-6 font-bold hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Laporan"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
