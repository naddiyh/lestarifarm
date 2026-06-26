"use client";

import { useState, useEffect, useCallback } from "react";

// ── Tipe data ─────────────────────────────────────────────────
export type LevelUrgensi =
  | "Normal"
  | "Monitor"
  | "ActSoon"
  | "Critical"
  | "Excess";

export interface PrediksiResult {
  sensor: {
    tds_aktual: number;
    ph: number;
    suhu: number;
    water_level_cm: number;
    tinggi_air_cm: number;
    volume_liter: number;
  };
  prediksi: {
    tds_prediksi: number;
    tds_target: number;
    deviasi_persen: number;
    level_urgensi: LevelUrgensi;
    pesan: string;
    confidence: number;
  };
  forecast: {
    prediksi_list: number[];
    interval_menit: number;
    waktu_kritis_mnt: number | null;
  };
  rekomendasi_dosis: {
    v_pupuk_total_mL: number;
    v_pupuk_A_mL: number;
    v_pupuk_B_mL: number;
    catatan: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REFRESH_MS = 5 * 60 * 1000;

export function usePrediksi() {
  const [data, setData] = useState<PrediksiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchPrediksi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/predict/latest`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail ?? `API error ${res.status}`);
      }

      const result: PrediksiResult = await res.json();
      setData(result);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrediksi();
    const interval = setInterval(fetchPrediksi, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchPrediksi]);

  return { data, loading, error, updatedAt, refetch: fetchPrediksi };
}
