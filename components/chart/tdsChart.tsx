"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,
  BarChart,
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
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "TDS Monitoring Chart";

const chartData = [
  { time: "1", tds: 800 },
  { time: "2", tds: 820 },
  { time: "3", tds: 780 },
  { time: "4", tds: 900 },
  { time: "5", tds: 870 },
];

const chartDataAvg = [
  { period: "Jan", ph: 6.1 },
  { period: "Feb", ph: 6.3 },
  { period: "Mar", ph: 6.0 },
  { period: "Apr", ph: 6.2 },
  { period: "May", ph: 6.4 },
  { period: "Jun", ph: 6.4 },
  { period: "July", ph: 6.4 },
  { period: "Aug", ph: 7.0 },
  { period: "Sep", ph: 6.4 },
  { period: "Oct", ph: 6.4 },
  { period: "Nov", ph: 6.4 },
  { period: "Des", ph: 5.0 },
];

const chartConfig = {
  tds: {
    label: "TDS (ppm)",
    color: "#66BB6A",
  },
} satisfies ChartConfig;

export function ChartTDS() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Dissolved Solids Status</CardTitle>
        <CardDescription>Nutrient concentration (ppm)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className=" w-full ">
          <AreaChart data={chartData} margin={{ right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />

            <XAxis dataKey="time" tickLine={false} axisLine={false} />

            <YAxis tickCount={5} axisLine={false} tickLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillTds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              dataKey="tds"
              type="monotone"
              fill="url(#fillTds)"
              stroke="#66BB6A"
              strokeWidth={3}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className=" ">
        <div className="flex  items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium">
              Monitoring active
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>

            <div className="text-muted-foreground">Stable nutrient level</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ChartTDSBar() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <Card>
      <CardHeader className="w-full">
        <CardTitle>Average TDS</CardTitle>
        <CardDescription> Check average total disorder solid</CardDescription>

        <div className="flex justify-end w-full">
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
        <ChartContainer config={chartConfig} className="l">
          <BarChart data={chartDataAvg} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />

            <XAxis dataKey="period" tickLine={false} axisLine={false} />
            {/* <YAxis tickCount={5} axisLine={false} tickLine={false} /> */}

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

      <CardFooter className="flex-col items-start  h-full gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Stable pH trend <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>

        <div className="text-muted-foreground">Optimal range: 5.5 – 6.5</div>
      </CardFooter>
    </Card>
  );
}
