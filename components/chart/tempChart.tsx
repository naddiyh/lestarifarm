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
import { useTempChart, RangeType } from "@/hooks/useTempAvg";
import { useTempData } from "@/hooks/useTempData";

export const description = "An area chart with gradient fill";

const chartConfig = {
  temp: {
    label: "Avg Temp",
    color: "#42A5F5",
  },
} satisfies ChartConfig;

export function AvgTempChart() {
  const { range, setRange, chartData, avgTemp, loading, error, tempStatus } =
    useTempChart(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Temperature</CardTitle>
        <CardDescription>Nutrient concentration (ppm)</CardDescription>
        <div className="flex justify-end w-full">
          <Tabs
            value={range}
            onValueChange={(val) => setRange(val as RangeType)}
          >
            <TabsList className="grid grid-cols-3 w-62.5 ">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Memuat data...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40 text-destructive text-sm">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Tidak ada data tersedia
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="l">
            <BarChart data={chartData} margin={{ top: 20 }} height={250}>
              <CartesianGrid vertical={false} />

              <XAxis dataKey="period" tickLine={false} axisLine={false} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="temp" fill="#42A5F5" radius={8}>
                <LabelList
                  position="top"
                  dataKey="temp"
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
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
  const { chartData, latestTemp } = useTempData();

  const getTempStatus = (temp: number | null) => {
    if (temp === null)
      return { label: "Loading...", color: "text-muted-foreground" };
    if (temp >= 18 && temp <= 30)
      return { label: "Normal Temperature", color: "text-green-500" };
    if (temp < 18) return { label: "High Temperature", color: "text-blue-500" };
    return { label: "Low Temperature", color: "text-red-500" };
  };

  const status = getTempStatus(latestTemp);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Temperature Water</CardTitle>

        <CardDescription>Monitoring suhu real-time</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <AreaChart data={chartData} margin={{ right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              domain={[0, 50]}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}°`}
            />
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

      <CardFooter className="h-full">
        <div className="flex items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div
              className={`flex items-center gap-2 font-medium ${status.color}`}
            >
              {status.label}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">
              Rentang ideal: 18°C – 30°C
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
