"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

export const description = "Other Sensors Monitoring";

const chartData = [
  { time: "1", ph: 6.1, temp: 20.5, volume: 10 },
  { time: "2", ph: 6.2, temp: 20.7, volume: 10.2 },
  { time: "3", ph: 6.0, temp: 20.4, volume: 9.9 },
  { time: "4", ph: 6.3, temp: 21.0, volume: 10.1 },
  { time: "5", ph: 6.1, temp: 20.6, volume: 10.0 },
];

const chartConfig = {
  ph: {
    label: "pH",
    color: "#42A5F5",
  },
  temp: {
    label: "Temperature (°C)",
    color: "#EF5350",
  },
  volume: {
    label: "Volume (L)",
    color: "#FFA726",
  },
} satisfies ChartConfig;

export function ChartSensors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Status</CardTitle>
        <CardDescription>pH, temperature & volume</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid stroke="#E0EED8" vertical={false} />

            <XAxis dataKey="time" tickLine={false} axisLine={false} />

            <YAxis tickCount={5} axisLine={false} tickLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Line dataKey="ph" stroke="#42A5F5" strokeWidth={2} dot={false} />

            <Line dataKey="temp" stroke="#42A5F5" strokeWidth={2} dot={false} />

            <Line
              dataKey="volume"
              stroke="#42A5F5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium">
              Monitoring active
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>

            <div className="text-muted-foreground">Stable water level</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
