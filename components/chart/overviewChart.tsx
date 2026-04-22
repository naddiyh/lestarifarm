"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

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

const statusData = [
  { status: "normal", label: "Normal", value: 82, fill: "#66BB6A" },
  { status: "warning", label: "Warning", value: 12, fill: "#F59E0B" },
  { status: "critical", label: "Critical", value: 6, fill: "#EF4444" },
];

const chartConfig = {
  value: { label: "% Time" },
  normal: { label: "Normal", color: "#66BB6A" },
  warning: { label: "Warning", color: "#F59E0B" },
  critical: { label: "Critical", color: "#EF4444" },
} satisfies ChartConfig;

export function OverviewCondition() {
  const id = "pie-status";

  const [activeStatus, setActiveStatus] = React.useState(statusData[0].status);

  const activeIndex = React.useMemo(
    () => statusData.findIndex((item) => item.status === activeStatus),
    [activeStatus],
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

  return (
    <Card className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader>
        <CardTitle>System Status Distribution</CardTitle>
        <CardDescription>
          Percentage of system condition over time
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <ChartContainer id={id} config={chartConfig} className="w-full ">
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
                        {statusData[activeIndex].value}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        dy="1.5em"
                        className="text-xs fill-muted-foreground"
                      >
                        {statusData[activeIndex].label}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <div className="flex justify-center gap-3 ">
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

      <CardFooter className="flex flex-col items-start gap-2 text-sm ">
        <div className="flex items-center gap-2 font-medium">
          System stable {statusData[0].value}% of the time
          <span className="text-green-500">●</span>
        </div>

        <div className="text-muted-foreground text-xs">
          Warning occurred {statusData[1].value}% and critical{" "}
          {statusData[2].value}% over the monitored period
        </div>

        <div className="text-[10px] text-muted-foreground ">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
}
