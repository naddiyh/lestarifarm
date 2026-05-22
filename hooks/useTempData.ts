"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TEMP_SENSOR_ID = 2;
const MAX_DATA_POINTS = 5;

type ChartPoint = { time: string; temp: number };

export function useTempData() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [latestTemp, setLatestTemp] = useState<number | null>(null);

  const formatTime = (iso: string) => {
    const date = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Makassar",
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("value, created_at")
        .eq("sensor_id", TEMP_SENSOR_ID)
        .order("created_at", { ascending: false })
        .limit(MAX_DATA_POINTS);

      if (error || !isMounted) return;

      if (data && data.length > 0) {
        const formatted = data.reverse().map((row) => ({
          time: formatTime(row.created_at),
          temp: row.value ?? 0,
        }));
        setChartData(formatted);
        setLatestTemp(formatted[formatted.length - 1].temp);
      }
    };

    fetchInitial();

    supabase.removeChannel(supabase.channel("realtime-temperature"));

    const channel = supabase
      .channel("realtime-temperature")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
          filter: `sensor_id=eq.${TEMP_SENSOR_ID}`,
        },
        (payload) => {
          if (!isMounted) return;
          const row = payload.new as { value: number; created_at: string };
          const newPoint: ChartPoint = {
            time: formatTime(row.created_at),
            temp: row.value ?? 0,
          };
          setChartData((prev) => {
            const updated = [...prev, newPoint];
            return updated.length > MAX_DATA_POINTS
              ? updated.slice(updated.length - MAX_DATA_POINTS)
              : updated;
          });
          setLatestTemp(row.value);
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { chartData, latestTemp };
}
