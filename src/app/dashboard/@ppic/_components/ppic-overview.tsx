"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";

export default function PPICOverview() {
  const critical = 2;
  const warning = 3;
  const health = Math.max(0, 100 - (critical * 25 + warning * 10));

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi
          title="Critical Shortage"
          value={String(critical)}
          hint="butuh action cepat"
        />
        <Kpi
          title="Warning Shortage"
          value={String(warning)}
          hint="follow-up procurement"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              MRP Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{health}%</div>
            <Progress value={health} />
          </CardContent>
        </Card>
        <Kpi title="WO Today" value="3" hint="produksi berjalan" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Worklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button variant="outline" className="justify-start">
            Buat PR dari shortage
          </Button>
          <Button variant="outline" className="justify-start">
            Review safety stock
          </Button>
          <Button variant="outline" className="justify-start">
            Sync schedule dengan produksi
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
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-muted-foreground mt-2 text-xs">{hint}</div>
      </CardContent>
    </Card>
  );
}
