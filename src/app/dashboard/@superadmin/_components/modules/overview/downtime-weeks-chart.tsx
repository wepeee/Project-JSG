"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";

type WeeklyData = {
  week: string;
  [key: string]: string | number;
};

type DowntimeType = {
  type: string;
  minutes: number;
};

type Props = {
  title?: string;
  description?: string;
  weeklyData: WeeklyData[];
  downtimeTypes: DowntimeType[];
  maxCategories?: number;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function DowntimeWeeksChart({ 
    title = "PLAN DOWNTIME", 
    description = "Analisa mingguan per kategori downtime",
    weeklyData = [], 
    downtimeTypes = [], // Also good to default this
    maxCategories = 4
}: Props) {
  // 1. Identify Top N Categories + Others
  // Filter downtimeTypes that exist in the weeklyData keys (optional optimization)
  // Also filter out "OTHERS" to avoid duplication when we append it manually
  const topTypes = downtimeTypes
    .filter((d) => d.type !== "OTHERS" && d.type.trim() !== "")
    .slice(0, maxCategories)
    .map((d) => d.type);
    
  const categories = [...topTypes, "OTHERS"];

  // 2. Process Weekly Data (Add OTHERS)
  const processedWeekly = weeklyData.map((weekItem) => {
    let othersTotal = 0;
    const newWeekItem: Record<string, number | string> = { ...weekItem };

    // Calculate OTHERS
    Object.keys(weekItem).forEach((key) => {
      if (key !== "week" && !topTypes.includes(key)) {
        othersTotal += Number(weekItem[key] || 0);
      }
    });

    newWeekItem.OTHERS = othersTotal;
    
    // Ensure all top categories exist
    categories.forEach(cat => {
        if (newWeekItem[cat] === undefined) newWeekItem[cat] = 0;
    });

    return newWeekItem;
  });

  // 3. Transform for Chart (Pivot: X-Axis = Categories, Series = Weeks)
  const weeks = processedWeekly.map((w) => w.week as string);
  
  const chartData = categories.map((cat) => {
    const periodData: any = { name: cat };
    processedWeekly.forEach((weekItem) => {
      periodData[weekItem.week as string] = weekItem[cat as string] || 0;
    });
    return periodData;
  });

  // Custom Tick to wrap text if needed, though categories usually short
  const renderCustomAxisTick = ({ x, y, payload }: any) => {
      return (
          <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={16} textAnchor="middle" fill="var(--muted-foreground)" fontSize={11}>
                  {payload.value && payload.value.length > 10 ? `${payload.value.substring(0, 10)}...` : payload.value}
              </text>
          </g>
      );
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="border-border bg-muted/30 border-b pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Chart */}
        <div className="h-[350px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" tick={renderCustomAxisTick} interval={0} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(val) => `${val}m`} />
              <Tooltip 
                formatter={(value) => [`${value} min`, "Durasi"]} 
                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--popover)" }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend />
              {weeks.map((week, index) => (
                <Bar
                  key={week}
                  dataKey={week}
                  fill={COLORS[index % COLORS.length]}
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="border-border overflow-x-auto rounded-md border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-border border-b">
                <th className="bg-muted p-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[100px]">Week</th>
                {categories.map((cat) => (
                  <th key={cat} className="bg-muted p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {cat.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedWeekly.map((weekItem, index) => (
                <tr key={index} className="border-border hover:bg-muted/40 border-b last:border-0">
                  <td className="text-foreground p-3 flex items-center gap-2 font-medium">
                    <span 
                        className="w-2.5 h-2.5 inline-block rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {weekItem.week}
                  </td>
                {categories.map((cat) => (
                    <td key={cat} className="text-muted-foreground p-3 text-center font-mono text-xs">
                      {Number(weekItem[cat] || 0).toLocaleString()} <span className="text-[10px] text-muted-foreground/70 ml-0.5">m</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
