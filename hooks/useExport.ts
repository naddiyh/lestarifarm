"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

type SensorLabel = {
  id: number;
  name: string;
  unit: string;
};

const SENSORS: SensorLabel[] = [
  { id: 1, name: "pH", unit: "" },
  { id: 2, name: "Suhu", unit: "°C" },
  { id: 3, name: "TDS", unit: "ppm" },
  { id: 4, name: "Turbidity", unit: "NTU" },
];

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Makassar",
  });
}

function formatDateFile(date: Date): string {
  return date
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}

export function useExportSensor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToExcel = async (from: Date, to: Date) => {
    setLoading(true);
    setError(null);

    try {
      const fromUTC = new Date(from);
      fromUTC.setHours(0, 0, 0, 0);

      const toUTC = new Date(to);
      toUTC.setHours(23, 59, 59, 999);

      const workbook = XLSX.utils.book_new();

      for (const sensor of SENSORS) {
        const { data, error: sbError } = await supabase
          .from("sensor_data")
          .select("id, value, created_at")
          .eq("sensor_id", sensor.id)
          .gte("created_at", fromUTC.toISOString())
          .lte("created_at", toUTC.toISOString())
          .not("value", "is", null)
          .order("created_at", { ascending: true });

        if (sbError) throw new Error(sbError.message);

        console.log(
          `Sensor ${sensor.name} (id: ${sensor.id}):`,
          data?.length ?? 0,
          "rows",
        );
        console.log("Range:", fromUTC.toISOString(), "->", toUTC.toISOString());

        const rows =
          (data ?? []).length > 0
            ? (data ?? []).map((row, index) => ({
                No: index + 1,
                Sensor: sensor.name,
                [`Nilai${sensor.unit ? ` (${sensor.unit})` : ""}`]: row.value,
                Waktu: formatDateTime(row.created_at),
              }))
            : [
                {
                  No: "-",
                  Sensor: sensor.name,
                  [`Nilai${sensor.unit ? ` (${sensor.unit})` : ""}`]:
                    "Tidak ada data",
                  Waktu: "-",
                },
              ];

        const sheet = XLSX.utils.json_to_sheet(rows);
        sheet["!cols"] = [
          { wch: 5 }, // No
          { wch: 12 }, // Sensor
          { wch: 15 }, // Nilai
          { wch: 22 }, // Waktu
        ];

        XLSX.utils.book_append_sheet(workbook, sheet, sensor.name);
      }

      const fileName = `Data_Sensor_${formatDateFile(from)}_sd_${formatDateFile(to)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err: any) {
      console.error("Export error:", err);
      setError("Gagal mengekspor data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return { exportToExcel, loading, error };
}
