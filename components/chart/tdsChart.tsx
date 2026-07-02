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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTdsData } from "@/hooks/useTdsData";
import { useTDSChart, RangeType } from "@/hooks/useTdsAvg";
import { AreaChartSkeleton, ChartSkeleton } from "@/components/ui/skeleton";

const chartConfig = {
  tds: { label: "TDS (ppm)", color: "#66BB6A" },
} satisfies ChartConfig;

export function ChartTDS() {
  const { chartData, latestTds } = useTdsData();

  const getTdsStatus = (tds: number | null) => {
    if (tds === null)
      return { label: "Loading...", color: "text-muted-foreground" };
    if (tds > 860) return { label: "Over Nutrition", color: "text-yellow-500" };
    if (tds >= 540) return { label: "Normal TDS", color: "text-green-500" };
    return { label: "Low TDS", color: "text-red-500" };
  };

  const status = getTdsStatus(latestTds);

  if (!chartData.length) return <AreaChartSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Dissolved Solids Status</CardTitle>
        <CardDescription>Nutrient concentration (ppm)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <AreaChart data={chartData} margin={{ right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis tickCount={6} axisLine={false} tickLine={false} />
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
      <CardFooter className="h-full">
        <div className="flex items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div
              className={`flex items-center gap-2 font-medium ${status.color}`}
            >
              {status.label}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Rentang ideal : 540-860</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ChartTDSBar() {
  const { range, setRange, chartData, avgTds, loading, error, tdsStatus } =
    useTDSChart(3);

  // ── Loading → skeleton ──────────────────────────────────────
  if (loading) return <ChartSkeleton bars={7} />;

  return (
    <Card>
      <CardHeader className="w-full">
        <CardTitle>Average TDS</CardTitle>
        <CardDescription>Check average total dissolved solid</CardDescription>
        <div className="flex justify-end w-full">
          <Tabs
            value={range}
            onValueChange={(val) => setRange(val as RangeType)}
          >
            <TabsList className="grid grid-cols-3 w-62.5">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center h-40 text-destructive text-sm">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Tidak ada data tersedia
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 20 }} height={250}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="tds" fill="#42A5F5" radius={8}>
                <LabelList
                  position="top"
                  dataKey="tds"
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Rata-rata TDS:{" "}
          <span className="text-blue-500">
            {avgTds !== null ? `${avgTds} ppm` : "-"}
          </span>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-muted-foreground">
          Status:{" "}
          <span className="font-medium text-foreground">{tdsStatus}</span> —
          Optimal: 540 – 860 ppm
        </div>
      </CardFooter>
    </Card>
  );
}
