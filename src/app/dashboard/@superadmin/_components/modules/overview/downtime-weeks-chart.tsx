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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

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
              <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={11}>
                  {payload.value && payload.value.length > 10 ? `${payload.value.substring(0, 10)}...` : payload.value}
              </text>
          </g>
      );
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/50">
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
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
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
        <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="bg-slate-100 dark:bg-slate-800/80 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 min-w-[100px]">Week</th>
                {categories.map((cat) => (
                  <th key={cat} className="bg-slate-100 dark:bg-slate-800/80 p-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    {cat.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedWeekly.map((weekItem, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span 
                        className="w-2.5 h-2.5 inline-block rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {weekItem.week}
                  </td>
                  {categories.map((cat) => (
                    <td key={cat} className="p-3 text-center text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {Number(weekItem[cat] || 0).toLocaleString()} <span className="text-[10px] text-slate-400 ml-0.5">m</span>
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
