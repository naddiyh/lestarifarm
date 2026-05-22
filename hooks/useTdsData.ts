"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TDS_SENSOR_ID = 3;
const MAX_DATA_POINTS = 6;

type ChartPoint = { time: string; tds: number };

export function useTdsData() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [latestTds, setLatestTds] = useState<number | null>(null);

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
        .eq("sensor_id", TDS_SENSOR_ID)
        .order("created_at", { ascending: false })
        .limit(MAX_DATA_POINTS);

      if (error || !isMounted) return;

      if (data && data.length > 0) {
        const formatted = data.reverse().map((row) => ({
          time: formatTime(row.created_at),
          tds: row.value ?? 0,
        }));
        setChartData(formatted);
        setLatestTds(formatted[formatted.length - 1].tds);
      }
    };

    const channelName = `realtime-tds-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
          filter: `sensor_id=eq.${TDS_SENSOR_ID}`,
        },
        (payload) => {
          if (!isMounted) return;
          const row = payload.new as { value: number; created_at: string };
          const newPoint: ChartPoint = {
            time: formatTime(row.created_at),
            tds: row.value ?? 0,
          };
          setChartData((prev) => {
            const updated = [...prev, newPoint];
            return updated.slice(-MAX_DATA_POINTS);
          });
          setLatestTds(row.value);
        },
      )
      .subscribe();

    fetchInitial();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { chartData, latestTds };
}
