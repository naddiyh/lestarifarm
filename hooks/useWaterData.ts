"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const SENSOR_ID = 4;
const TANK_HEIGHT_CM = 100;
const MAX_VOLUME = 1000;
export const TANK_INNER_H = 230;

export function sensorToVolume(jarakCm: number): number {
  const tinggiAir = TANK_HEIGHT_CM - jarakCm;
  const vol = (tinggiAir / TANK_HEIGHT_CM) * MAX_VOLUME;
  return Math.round(Math.max(0, Math.min(MAX_VOLUME, vol)));
}

export function getStatus(vol: number) {
  if (vol >= 700)
    return { text: "Sufficient", color: "bg-green-50 text-green-600" };
  if (vol >= 400)
    return { text: "Low - refill soon", color: "bg-yellow-50 text-yellow-600" };
  return { text: "Critical - refill now", color: "bg-red-50 text-red-600" };
}

export function getWaterColor(pct: number) {
  if (pct > 0.7)
    return {
      from: "rgba(56,189,248,0.65)",
      to: "rgba(14,165,233,0.92)",
      wave: "rgba(255,255,255,0.5)",
    };
  if (pct >= 0.4)
    return {
      from: "rgba(251,191,36,0.65)",
      to: "rgba(245,158,11,0.92)",
      wave: "rgba(255,255,255,0.45)",
    };
  return {
    from: "rgba(248,113,113,0.65)",
    to: "rgba(239,68,68,0.92)",
    wave: "rgba(255,255,255,0.45)",
  };
}

export interface WaterLevelState {
  volume: number;
  pct: number;
  lastUpdated: string | null;
  loading: boolean;
}

export function useWaterLevel(): WaterLevelState {
  const [volume, setVolume] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch nilai terbaru saat mount
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("value, created_at")
        .eq("sensor_id", SENSOR_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setVolume(sensorToVolume(data.value));
        setLastUpdated(data.created_at);
      }
      setLoading(false);
    };

    fetchLatest();

    // Realtime subscription — INSERT baru dari sensor_id = 4
    const channel = supabase
      .channel("water-level-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
          filter: `sensor_id=eq.${SENSOR_ID}`,
        },
        (payload) => {
          setVolume(sensorToVolume(payload.new.value));
          setLastUpdated(payload.new.created_at);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const pct = Math.min(volume / MAX_VOLUME, 1);

  return { volume, pct, lastUpdated, loading };
}
