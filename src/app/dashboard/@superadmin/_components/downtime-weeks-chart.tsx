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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={renderCustomAxisTick} interval={0} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} min`, "Durasi"]} />
              {/* No Legend here if we want it to look exactly like the image (legend is implicitly the bars) 
                  But for clarity, a Legend identifying Weeks is good. 
              */}
              <Legend />
              {weeks.map((week, index) => (
                <Bar
                  key={week}
                  dataKey={week}
                  fill={COLORS[index % COLORS.length]}
                  barSize={20} // Make bars thinner to fit groups
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-200 dark:border-gray-700 p-2 bg-secondary text-left min-w-[100px]">Week</th>
                {categories.map((cat) => (
                  <th key={cat} className="border border-gray-200 dark:border-gray-700 p-2 bg-secondary text-center">
                    {cat.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedWeekly.map((weekItem, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2 font-medium flex items-center gap-2">
                    <span 
                        className="w-3 h-3 inline-block rounded-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {weekItem.week}
                  </td>
                  {categories.map((cat) => (
                    <td key={cat} className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                      {Number(weekItem[cat] || 0).toLocaleString()}
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
