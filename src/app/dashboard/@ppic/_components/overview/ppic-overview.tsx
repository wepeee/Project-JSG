"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  RefreshCcw
} from "lucide-react";

export default function PPICOverview() {
  const critical = 2;
  const warning = 3;
  const health = Math.max(0, 100 - (critical * 25 + warning * 10));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi
          title="Critical Shortage"
          value={String(critical)}
          hint="Action Needed"
          icon={<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-50 dark:bg-red-900/20"
        />
        <Kpi
          title="Warning Shortage"
          value={String(warning)}
          hint="Follow-up Procurement"
          icon={<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-50 dark:bg-amber-900/20"
        />
        <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              MRP Health
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{health}%</div>
            <Progress value={health} className="mt-2 h-2 [&>div]:bg-emerald-500" />
            <p className="mt-2 text-xs text-muted-foreground">Overall system health</p>
          </CardContent>
        </Card>
        <Kpi 
            title="WO Today" 
            value="3" 
            hint="Produksi Berjalan" 
            icon={<CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Worklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <div className="flex w-full items-center justify-between">
                <ShoppingCart className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Buat PR Shortage</span>
                <span className="text-xs text-muted-foreground font-normal">Create Purchase Request for critical items</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <div className="flex w-full items-center justify-between">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Review Safety Stock</span>
                <span className="text-xs text-muted-foreground font-normal">Check buffer levels for next month</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <div className="flex w-full items-center justify-between">
                <RefreshCcw className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Sync Schedule</span>
                <span className="text-xs text-muted-foreground font-normal">Align PPIC plan with production floor</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  title,
  value,
  hint,
  icon,
  colorClass = "text-foreground",
  bgClass = "bg-background"
}: {
  title: string;
  value: string;
  hint: string;
  icon?: React.ReactNode;
  colorClass?: string;
  bgClass?: string;
}) {
  return (
    <Card className={`overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <div className={`mt-2 inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium ${bgClass} ${colorClass.replace('text-', 'text-opacity-80 ')}`}>
            {hint}
        </div>
      </CardContent>
    </Card>
  );
}
