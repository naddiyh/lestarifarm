"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type RangeType = "daily" | "weekly" | "monthly";

export interface ChartPoint {
  period: string;
  temp: number;
}

function getDateFrom(range: RangeType): Date {
  const now = new Date();
  const d = new Date(now);
  if (range === "daily") {
    d.setDate(d.getDate() - 6);
  } else if (range === "weekly") {
    d.setDate(d.getDate() - 7 * 7);
  } else {
    d.setMonth(d.getMonth() - 11);
  }
  return d;
}

function groupByRange(
  rows: { value: number; created_at: string }[],
  range: RangeType,
): ChartPoint[] {
  const map = new Map<string, number[]>();

  rows.forEach(({ value, created_at }) => {
    const date = new Date(created_at);
    let key = "";

    if (range === "daily") {
      key = date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } else if (range === "weekly") {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date.getTime() - startOfYear.getTime()) / 86400000 +
          startOfYear.getDay() +
          1) /
          7,
      );
      key = `W${week}`;
    } else {
      key = date.toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      });
    }

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(value);
  });

  return Array.from(map.entries()).map(([period, vals]) => ({
    period,
    temp: parseFloat(
      (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1),
    ),
  }));
}

export function getTempStatus(avg: number | null): string {
  if (avg === null) return "-";
  if (avg < 150) return "Sangat Baik";
  if (avg < 300) return "Baik";
  if (avg < 500) return "Cukup";
  return "Tinggi";
}

export function useTempChart(sensorId: number = 2) {
  const [range, setRange] = useState<RangeType>("weekly");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const from = getDateFrom(range).toISOString();

      const { data, error: sbError } = await supabase
        .from("sensor_data")
        .select("value, created_at")
        .eq("sensor_id", sensorId)
        .gte("created_at", from)
        .not("value", "is", null)
        .order("created_at", { ascending: true });

      if (sbError) {
        console.error("Supabase error:", sbError.message);
        setError("Gagal mengambil data TDS.");
        setLoading(false);
        return;
      }

      const clean = (data ?? []).filter(
        (row) => typeof row.value === "number" && !isNaN(row.value),
      );

      const grouped = groupByRange(clean, range);
      setChartData(grouped);

      if (grouped.length > 0) {
        const total = grouped.reduce((sum, d) => sum + d.temp, 0);
        setAvgTemp(parseFloat((total / grouped.length).toFixed(1)));
      } else {
        setAvgTemp(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [range, sensorId]);

  return {
    range,
    setRange,
    chartData,
    avgTemp,
    loading,
    error,
    tempStatus: getTempStatus(avgTemp),
  };
}
