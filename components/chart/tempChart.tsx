"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const description = "An area chart with gradient fill";

const chartDataAvg = [
  { period: "Jan", temp: 6.1 },
  { period: "Feb", temp: 6.3 },
  { period: "Mar", temp: 6.0 },
  { period: "Apr", temp: 6.2 },
  { period: "May", temp: 6.4 },
  { period: "Jun", temp: 6.4 },
  { period: "July", temp: 6.4 },
  { period: "Aug", temp: 7.0 },
  { period: "Sep", temp: 6.4 },
  { period: "Oct", temp: 6.4 },
  { period: "Nov", temp: 6.4 },
  { period: "Des", temp: 5.0 },
];

const chartData = [
  { time: "1", temp: 24.5 },
  { time: "2", temp: 22.3 },
  { time: "3", temp: 29.7 },
  { time: "4", temp: 29.4 },
  { time: "5", temp: 26.4 },
];

const chartConfig = {
  temp: {
    label: "Avg Temp",
    color: "#42A5F5",
  },
} satisfies ChartConfig;

export function AvgTempChart() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Temperature</CardTitle>
        <CardDescription>Nutrient concentration (ppm)</CardDescription>
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
        <ChartContainer config={chartConfig} className=" ">
          <AreaChart data={chartDataAvg} margin={{ right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />

            <XAxis dataKey="period" tickLine={false} axisLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              dataKey="temp"
              type="monotone"
              fill="url(#fillTemp)"
              stroke="#66BB6A"
              strokeWidth={2}
              dot={true}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="h-full ">
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

export function TempAreaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Water</CardTitle>
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
              <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              dataKey="temp"
              type="monotone"
              fill="url(#fillTemp)"
              stroke="#66BB6A"
              strokeWidth={3}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="h-full ">
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
