"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";
import { supabase } from "@/lib/supabase";

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

// ── Referensi range optimal selada hidroponik ─────────────────
// Sumber: tabel referensi TDS/pH optimal tanaman hidroponik
const RANGES = {
  tds: {
    normal: { min: 560, max: 840 },
    warning: { min: 841, max: 1120 },
    // critical: < 560 atau > 1120
  },
  ph: {
    normal: { min: 6.0, max: 7.0 },
    warning: { min: 5.5, max: 7.5 },
    // critical: < 5.5 atau > 7.5
  },
  suhu: {
    normal: { min: 18, max: 26 },
    warning: { min: 26, max: 30 },
    // critical: < 18 atau > 30
  },
};

type StatusLevel = "normal" | "warning" | "critical";

function classifyValue(value: number, param: keyof typeof RANGES): StatusLevel {
  const r = RANGES[param];
  if (value >= r.normal.min && value <= r.normal.max) return "normal";
  if (value >= r.warning.min && value <= r.warning.max) return "warning";
  return "critical";
}

// Status sistem = status terburuk dari semua parameter
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

const COLORS = {
  normal: "#66BB6A",
  warning: "#F59E0B",
  critical: "#EF4444",
};

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
        // Fetch semua sensor sekaligus
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

        // Match data TDS dengan pH dan suhu terdekat waktunya
        let normalCount = 0;
        let warningCount = 0;
        let criticalCount = 0;

        tdsRes.data.forEach((tdsRow) => {
          const tdsTime = new Date(tdsRow.created_at).getTime();

          // Cari pH terdekat dalam toleransi 30 detik
          const closestPh = phRes.data!.reduce((prev, curr) => {
            const prevDiff = Math.abs(
              new Date(prev.created_at).getTime() - tdsTime,
            );
            const currDiff = Math.abs(
              new Date(curr.created_at).getTime() - tdsTime,
            );
            return currDiff < prevDiff ? curr : prev;
          });

          // Cari suhu terdekat dalam toleransi 30 detik
          const closestSuhu = suhuRes.data!.reduce((prev, curr) => {
            const prevDiff = Math.abs(
              new Date(prev.created_at).getTime() - tdsTime,
            );
            const currDiff = Math.abs(
              new Date(curr.created_at).getTime() - tdsTime,
            );
            return currDiff < prevDiff ? curr : prev;
          });

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

        // Set active ke yang terbesar
        const max = computed.reduce((a, b) => (a.value > b.value ? a : b));
        setActiveStatus(max.status);
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

  const normalPct = statusData.find((d) => d.status === "normal")?.value ?? 0;
  const warningPct = statusData.find((d) => d.status === "warning")?.value ?? 0;
  const criticalPct =
    statusData.find((d) => d.status === "critical")?.value ?? 0;

  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>System Status Distribution</CardTitle>
          <CardDescription>Calculating from sensor data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <div className="text-muted-foreground text-sm animate-pulse">
            Analyzing TDS · pH · Temperature...
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {/* Range reference */}
        <div className="text-[10px] text-muted-foreground border-t pt-2 w-full space-y-0.5">
          <p className="font-medium text-foreground">
            Reference ranges (lettuce):
          </p>
          <p>TDS: 560–840 ppm normal · 841–1120 ppm warning</p>
          <p>pH: 6.0–7.0 normal · 5.5–7.5 warning</p>
          <p>Temperature: 18–26°C normal · 26–30°C warning</p>
        </div>
      </CardFooter>
    </Card>
  );
}
