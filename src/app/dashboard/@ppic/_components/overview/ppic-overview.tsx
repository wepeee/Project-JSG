"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { 
  ArrowRight,
  CalendarDays,
  FilePlus2
} from "lucide-react";

type Props = {
  userName: string;
};

function getGreeting(hour: number): string {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

export default function PPICOverview({ userName }: Props) {
  const router = useRouter();
  const greeting = getGreeting(new Date().getHours());

  return (
    <div className="grid gap-6">
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">
            {greeting}, {userName}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Worklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            onClick={() => router.push("/dashboard/planning/paper")}
          >
            <div className="flex w-full items-center justify-between">
                <FilePlus2 className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Membuat PRO</span>
                <span className="text-xs text-muted-foreground font-normal">Buka perencanaan PRO untuk mulai input kebutuhan produksi.</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            onClick={() => router.push("/dashboard/schedule")}
          >
            <div className="flex w-full items-center justify-between">
                <CalendarDays className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Membuat Schedule</span>
                <span className="text-xs text-muted-foreground font-normal">Atur jadwal produksi supaya urutan proses tetap aman.</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
