"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";
import { supabase } from "@/lib/supabase";
import { StatusDistributionSkeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
  type ChartConfig,
} from "@/components/ui/chart";

const RANGES = {
  tds: { normal: { min: 560, max: 840 }, warning: { min: 841, max: 1120 } },
  ph: { normal: { min: 6.0, max: 7.0 }, warning: { min: 5.5, max: 7.5 } },
  suhu: { normal: { min: 18, max: 26 }, warning: { min: 26, max: 30 } },
};

type StatusLevel = "normal" | "warning" | "critical";

function classifyValue(value: number, param: keyof typeof RANGES): StatusLevel {
  const r = RANGES[param];
  if (value >= r.normal.min && value <= r.normal.max) return "normal";
  if (value >= r.warning.min && value <= r.warning.max) return "warning";
  return "critical";
}

function classifySystem(tds: number, ph: number, suhu: number): StatusLevel {
  const statuses = [
    classifyValue(tds, "tds"),
    classifyValue(ph, "ph"),
    classifyValue(suhu, "suhu"),
  ];
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warning")) return "warning";
  return "normal";
}

const chartConfig = {
  value: { label: "% Time" },
  normal: { label: "Normal", color: "#66BB6A" },
  warning: { label: "Warning", color: "#F59E0B" },
  critical: { label: "Critical", color: "#EF4444" },
} satisfies ChartConfig;

const COLORS = { normal: "#66BB6A", warning: "#F59E0B", critical: "#EF4444" };

export function OverviewCondition() {
  const id = "pie-status";
  const [statusData, setStatusData] = React.useState([
    { status: "normal", label: "Normal", value: 0, fill: COLORS.normal },
    { status: "warning", label: "Warning", value: 0, fill: COLORS.warning },
    { status: "critical", label: "Critical", value: 0, fill: COLORS.critical },
  ]);
  const [loading, setLoading] = React.useState(true);
  const [totalData, setTotalData] = React.useState(0);
  const [activeStatus, setActiveStatus] = React.useState("normal");

  React.useEffect(() => {
    const fetchAndClassify = async () => {
      try {
        const [tdsRes, phRes, suhuRes] = await Promise.all([
          supabase
            .from("sensor_data")
            .select("value, created_at")
            .eq("sensor_id", 3)
            .gt("value", 100)
            .lt("value", 3000)
            .order("created_at", { ascending: true }),
          supabase
            .from("sensor_data")
            .select("value, created_at")
            .eq("sensor_id", 1)
            .gt("value", 0)
            .lt("value", 14)
            .order("created_at", { ascending: true }),
          supabase
            .from("sensor_data")
            .select("value, created_at")
            .eq("sensor_id", 2)
            .gt("value", 0)
            .lt("value", 50)
            .order("created_at", { ascending: true }),
        ]);
        if (!tdsRes.data || !phRes.data || !suhuRes.data) return;

        let normalCount = 0,
          warningCount = 0,
          criticalCount = 0;
        tdsRes.data.forEach((tdsRow) => {
          const tdsTime = new Date(tdsRow.created_at).getTime();
          const closestPh = phRes.data!.reduce((p, c) =>
            Math.abs(new Date(c.created_at).getTime() - tdsTime) <
            Math.abs(new Date(p.created_at).getTime() - tdsTime)
              ? c
              : p,
          );
          const closestSuhu = suhuRes.data!.reduce((p, c) =>
            Math.abs(new Date(c.created_at).getTime() - tdsTime) <
            Math.abs(new Date(p.created_at).getTime() - tdsTime)
              ? c
              : p,
          );
          const status = classifySystem(
            tdsRow.value,
            closestPh.value,
            closestSuhu.value,
          );
          if (status === "normal") normalCount++;
          else if (status === "warning") warningCount++;
          else criticalCount++;
        });

        const total = tdsRes.data.length;
        const toPercent = (n: number) => Math.round((n / total) * 100);
        const computed = [
          {
            status: "normal",
            label: "Normal",
            value: toPercent(normalCount),
            fill: COLORS.normal,
          },
          {
            status: "warning",
            label: "Warning",
            value: toPercent(warningCount),
            fill: COLORS.warning,
          },
          {
            status: "critical",
            label: "Critical",
            value: toPercent(criticalCount),
            fill: COLORS.critical,
          },
        ];
        setStatusData(computed);
        setTotalData(total);
        setActiveStatus(
          computed.reduce((a, b) => (a.value > b.value ? a : b)).status,
        );
      } catch (e) {
        console.error("OverviewCondition fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAndClassify();
  }, []);

  const activeIndex = React.useMemo(
    () => statusData.findIndex((item) => item.status === activeStatus),
    [activeStatus, statusData],
  );

  const renderShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 8} />
            <Sector
              {...props}
              outerRadius={outerRadius + 18}
              innerRadius={outerRadius + 10}
            />
          </g>
        );
      }
      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  // ── Loading → skeleton ──────────────────────────────────────
  if (loading) return <StatusDistributionSkeleton />;

  const normalPct = statusData.find((d) => d.status === "normal")?.value ?? 0;
  const warningPct = statusData.find((d) => d.status === "warning")?.value ?? 0;
  const criticalPct =
    statusData.find((d) => d.status === "critical")?.value ?? 0;

  return (
    <Card className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader>
        <CardTitle>System Status Distribution</CardTitle>
        <CardDescription>
          Based on {totalData.toLocaleString()} readings — TDS · pH ·
          Temperature
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer id={id} config={chartConfig} className="w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={4}
              shape={renderShape}
              onMouseEnter={(_, index) =>
                setActiveStatus(statusData[index].status)
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="text-3xl font-bold fill-foreground">
                        {statusData[activeIndex]?.value ?? 0}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        dy="1.5em"
                        className="text-xs fill-muted-foreground"
                      >
                        {statusData[activeIndex]?.label ?? ""}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex justify-center gap-3">
        {statusData.map((item) => (
          <div key={item.status} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            {item.label}
          </div>
        ))}
      </div>
      <CardFooter className="flex flex-col items-start gap-2 text-sm mt-2">
        <div className="flex items-center gap-2 font-medium">
          System stable {normalPct}% of the time
          <span className="text-green-500">●</span>
        </div>
        <div className="text-muted-foreground text-xs">
          Warning {warningPct}% and critical {criticalPct}% over the monitored
          period
        </div>
      </CardFooter>
    </Card>
  );
}
