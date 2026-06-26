"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type RangeType = "daily" | "weekly" | "monthly";

export interface ChartPoint {
  period: string;
  tds: number;
}

function getDateFrom(range: RangeType): Date {
  // Gunakan timezone lokal dengan set ke awal hari
  const now = new Date();
  const d = new Date(now);

  if (range === "daily") {
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
  } else if (range === "weekly") {
    d.setDate(d.getDate() - 7 * 7);
    d.setHours(0, 0, 0, 0);
  } else {
    d.setMonth(d.getMonth() - 11);
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

function groupByRange(
  rows: { value: number; created_at: string }[],
  range: RangeType,
): ChartPoint[] {
  const map = new Map<string, { vals: number[]; sortKey: number }>();

  rows.forEach(({ value, created_at }) => {
    const dateStr =
      created_at.includes("+") || created_at.endsWith("Z")
        ? created_at
        : created_at + "+00:00";
    const date = new Date(dateStr);

    let key = "";
    if (range === "daily") {
      key = date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "Asia/Makassar",
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
        timeZone: "Asia/Makassar",
      });
    }

    if (!map.has(key)) {
      map.set(key, { vals: [], sortKey: date.getTime() });
    }
    map.get(key)!.vals.push(value);
  });

  // Sort berdasarkan waktu kemunculan pertama
  return Array.from(map.entries())
    .sort((a, b) => a[1].sortKey - b[1].sortKey)
    .map(([period, { vals }]) => ({
      period,
      tds: parseFloat(
        (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1),
      ),
    }));
}

export function getTDSStatus(avg: number | null): string {
  if (avg === null) return "-";
  if (avg < 150) return "Sangat Baik";
  if (avg < 300) return "Baik";
  if (avg < 500) return "Cukup";
  return "Tinggi";
}

export function useTDSChart(sensorId: number = 3) {
  const [range, setRange] = useState<RangeType>("weekly");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [avgTds, setAvgTds] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const fromDate = getDateFrom(range);
      const from = fromDate.toISOString();

      console.log("=== DEBUG ===");
      console.log("Range:", range);
      console.log("From:", from);
      console.log("Now:", new Date().toISOString());

      const { data, error: sbError } = await supabase
        .from("sensor_data")
        .select("value, created_at")
        .eq("sensor_id", sensorId)
        .gte("created_at", from)
        .not("value", "is", null)
        .order("created_at", { ascending: true });

      console.log("Rows:", data?.length);
      console.log("Last:", data?.[data?.length - 1]?.created_at);
      console.log(
        "Jun24+:",
        data?.filter((r) => r.created_at >= "2026-06-24").length,
      );

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
      console.log("Grouped:", grouped);
      setChartData(grouped);

      if (grouped.length > 0) {
        const total = grouped.reduce((sum, d) => sum + d.tds, 0);
        setAvgTds(parseFloat((total / grouped.length).toFixed(1)));
      } else {
        setAvgTds(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [range, sensorId]);

  return {
    range,
    setRange,
    chartData,
    avgTds,
    loading,
    error,
    tdsStatus: getTDSStatus(avgTds),
  };
}
