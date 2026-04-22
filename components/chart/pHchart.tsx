"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Line,
  LineChart,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useState } from "react";
export const description = "Average pH Analysis";

const chartDataAvg = [
  { period: "Mon", ph: 6.1 },
  { period: "Tue", ph: 6.3 },
  { period: "Wed", ph: 6.0 },
  { period: "Thu", ph: 6.2 },
  { period: "Fri", ph: 6.4 },
  { period: "Sab", ph: 6.4 },
  { period: "Sun", ph: 6.4 },
];

const chartConfig = {
  ph: {
    label: "Avg pH",
    color: "#42A5F5",
  },
} satisfies ChartConfig;

const chartConfigLine = {
  ph: {
    label: "pH",
    color: "#42A5F5",
  },
};

const chartDataLine = [
  { time: "1", ph: 6.1 },
  { time: "2", ph: 5.2 },
  { time: "3", ph: 3.0 },
  { time: "4", ph: 7.3 },
  { time: "5", ph: 4.1 },
];

export function ChartPhLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ph Water</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfigLine} className=" w-full">
          <AreaChart data={chartDataLine} margin={{ right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />

            <XAxis dataKey="time" tickLine={false} axisLine={false} />

            <YAxis tickCount={5} axisLine={false} tickLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillpH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              dataKey="ph"
              type="monotone"
              fill="url(#fillTds)"
              stroke="#66BB6A"
              strokeWidth={3}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Stable pH trend <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>

        <div className="text-muted-foreground">Optimal range: 5.5 – 6.5</div>
      </CardFooter>
    </Card>
  );
}

// Average
export function ChartPHBar() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average pH</CardTitle>
        <CardDescription>
          Shows average ph daily, weekly, and monthly
        </CardDescription>
        <div className="flex justify-end w-full pt-2">
          <Tabs
            value={range}
            onValueChange={(val) => setRange(val as any)}
            className=""
          >
            <TabsList className="grid grid-cols-3 w-[250px] ">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartDataAvg} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />

            <XAxis dataKey="period" tickLine={false} axisLine={false} />

            {/* <YAxis domain={[5.5, 7]} tickLine={false} axisLine={false} /> */}

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="ph" fill="#42A5F5" radius={8}>
              <LabelList
                position="top"
                fontSize={12}
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Stable pH trend <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>

        <div className="text-muted-foreground">Optimal range: 5.5 – 6.5</div>
      </CardFooter>
    </Card>
  );
}
