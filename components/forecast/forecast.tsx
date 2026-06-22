"use client";

import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { usePrediksi, LevelUrgensi } from "@/hooks/usePredict";

const LEVEL_CONFIG: Record<
  LevelUrgensi,
  {
    badge: string;
    alertBg: string;
    border: string;
    text: string;
    label: string;
  }
> = {
  Normal: {
    badge: "bg-green-100 text-green-700",
    alertBg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    label: "Normal",
  },
  Monitor: {
    badge: "bg-yellow-100 text-yellow-700",
    alertBg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-600",
    label: "Monitor",
  },
  ActSoon: {
    badge: "bg-orange-100 text-orange-700",
    alertBg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-500",
    label: "Act Soon",
  },
  Critical: {
    badge: "bg-red-100 text-red-700",
    alertBg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-500",
    label: "Critical",
  },
  Excess: {
    badge: "bg-red-100 text-red-700",
    alertBg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-500",
    label: "Excess",
  },
};

const PPM_MIN = 540;
const PPM_MAX = 860;
const PPM_TARGET = 700;

function TrendIcon({ deviasi, level }: { deviasi: number; level: string }) {
  if (level === "Excess")
    return <TrendingUp className="w-6 h-6 text-red-400    shrink-0" />;
  if (deviasi > 5)
    return <TrendingDown className="w-6 h-6 text-orange-400 shrink-0" />;
  if (deviasi < -5)
    return <TrendingUp className="w-6 h-6 text-green-400  shrink-0" />;
  return <Minus className="w-6 h-6 text-gray-400   shrink-0" />;
}

function barColor(ppm: number) {
  if (ppm < PPM_MIN || ppm > PPM_MAX) return "#E24B4A";
  if (Math.abs(ppm - PPM_TARGET) / PPM_TARGET > 0.15) return "#EF9F27";
  return "#639922";
}

function barWidth(ppm: number) {
  return Math.max(
    4,
    Math.min(100, ((ppm - PPM_MIN) / (PPM_MAX - PPM_MIN)) * 100),
  ).toFixed(1);
}

function formatTime(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getTrendText(deviasi: number) {
  if (deviasi > 0) return `↓ ${deviasi.toFixed(1)}% below target`;
  if (deviasi < 0) return `↑ ${Math.abs(deviasi).toFixed(1)}% above target`;
  return "Stable at target";
}

function getAlertMessage(
  level: LevelUrgensi,
  pesan: string,
  waktuLabel: string,
) {
  switch (level) {
    case "Normal":
      return "Nutrient levels are optimal. No action needed.";
    case "Monitor":
      return "Nutrient level is dropping. Prepare dosing within 30 minutes.";
    case "ActSoon":
      return `Nutrient level will drop below optimal in ${waktuLabel}. Dose now.`;
    case "Critical":
      return "Critical nutrient level! Manual intervention required immediately.";
    case "Excess":
      return "Nutrient level is too high. Consider diluting with water.";
    default:
      return pesan;
  }
}

export const Forecast = () => {
  const { data, loading, error, updatedAt, refetch } = usePrediksi();

  if (loading && !data) {
    return (
      <Card className="relative overflow-hidden shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            AI Insight
          </CardTitle>
          <CardDescription>Loading predictions from sensors...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-muted rounded-lg" />
            <div className="h-4  bg-muted rounded w-3/4" />
            <div className="h-6  bg-muted rounded" />
            <div className="h-6  bg-muted rounded" />
            <div className="h-6  bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="relative overflow-hidden shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Failed to connect to backend</p>
              <p className="text-xs mt-0.5 text-red-500">{error}</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { sensor, prediksi, forecast, rekomendasi_dosis } = data;
  const level = prediksi.level_urgensi as LevelUrgensi;
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG["Normal"];
  const deviasi = prediksi.deviasi_persen;
  const confidence = prediksi.confidence;
  const trendColor =
    deviasi > 10
      ? "text-red-500"
      : deviasi > 0
        ? "text-orange-500"
        : "text-green-500";

  const waktuLabel = forecast.waktu_kritis_mnt
    ? `${forecast.waktu_kritis_mnt} minutes`
    : `> ${forecast.prediksi_list.length * forecast.interval_menit} minutes`;

  const forecastSlice = forecast.prediksi_list.slice(0, 3);

  return (
    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insight
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}
            >
              {cfg.label}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              {confidence}% Confidence
            </span>
          </div>
        </div>
        <CardDescription className="text-sm">
          Prediction based on sensor trends
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Alert message */}
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border ${cfg.alertBg} ${cfg.border}`}
        >
          <TrendIcon deviasi={deviasi} level={level} />
          <p className={`text-sm font-medium ${cfg.text}`}>
            {getAlertMessage(level, prediksi.pesan, waktuLabel)}
          </p>
        </div>

        <div className="h-px bg-border" />

        {/* Nutrient forecast bars */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Nutrient forecast
          </p>

          {/* Now */}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-16 text-muted-foreground shrink-0 text-xs">
              Now
            </span>
            <span className="w-20 font-semibold text-right shrink-0">
              {sensor.tds_aktual} ppm
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${barWidth(sensor.tds_aktual)}%`,
                  background: barColor(sensor.tds_aktual),
                }}
              />
            </div>
            <span
              className="text-xs w-3 text-center"
              style={{ color: barColor(sensor.tds_aktual) }}
            >
              {sensor.tds_aktual >= PPM_MIN && sensor.tds_aktual <= PPM_MAX
                ? "✓"
                : "!"}
            </span>
          </div>

          {/* Forecast steps */}
          {forecastSlice.map((ppm, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-16 text-muted-foreground shrink-0 text-xs">
                +{(i + 1) * forecast.interval_menit} min
              </span>
              <span
                className="w-20 font-medium text-right shrink-0"
                style={{ color: barColor(ppm) }}
              >
                {ppm} ppm
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth(ppm)}%`,
                    background: barColor(ppm),
                    opacity: 0.6 + i * 0.15,
                  }}
                />
              </div>
              <span
                className="text-xs w-3 text-center"
                style={{ color: barColor(ppm) }}
              >
                {ppm >= PPM_MIN && ppm <= PPM_MAX ? "✓" : "!"}
              </span>
            </div>
          ))}

          <p className="text-[10px] text-muted-foreground">
            Target: {PPM_TARGET} ppm &nbsp;|&nbsp; Safe range: {PPM_MIN}–
            {PPM_MAX} ppm
          </p>
        </div>

        <div className="h-px bg-border" />

        {/* Recommended actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recommended Action</p>

          {level === "Excess" ? (
            // TDS terlalu tinggi → encerkan
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-700">
                  Dilute with clean water
                </p>
                <p className="text-xs text-red-400">
                  Stop dosing — add fresh water to lower TDS
                </p>
              </div>
              <span className="text-lg text-red-400">⚠</span>
            </div>
          ) : rekomendasi_dosis.v_pupuk_total_mL > 0 ? (
            // Kurang nutrisi → tambah pupuk
            <>
              {[
                {
                  name: "Fertilizer A",
                  sub: `Add within ${forecast.waktu_kritis_mnt ?? 60} minutes`,
                  dose: `+${rekomendasi_dosis.v_pupuk_A_mL} ml`,
                },
                {
                  name: "Fertilizer B",
                  sub: `Add within ${forecast.waktu_kritis_mnt ?? 60} minutes`,
                  dose: `+${rekomendasi_dosis.v_pupuk_B_mL} ml`,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "#1A3A2A" }}
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: "#81C784" }}>
                      {item.sub}
                    </p>
                  </div>
                  <span className="font-semibold" style={{ color: "#4ADE80" }}>
                    {item.dose}
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground italic leading-tight">
                Estimated dose from lab calibration. Add gradually and
                re-measure every 10 min.
              </p>
            </>
          ) : (
            // Normal → tidak perlu tindakan
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: "#1A3A2A" }}
            >
              <p className="text-sm text-white">Nutrient levels are optimal</p>
              <span className="font-semibold" style={{ color: "#4ADE80" }}>
                ✓
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1 hover:text-foreground transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <span>Updated: {formatTime(updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
