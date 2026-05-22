"use client";

import { Droplet, Thermometer, Waves } from "lucide-react";
import { Widget } from "@/components/widget/widget";
import { MapPin } from "lucide-react";
import { ChartTDS } from "@/components/chart/tdsChart";
import { Forecast } from "@/components/forecast/forecast";
import { IdealCondition } from "@/components/forecast/idealCondition";
import { ChartPhLine } from "@/components/chart/pHchart";
import { WaterTank } from "@/components/chart/waterChart";
import { TempAreaChart } from "@/components/chart/tempChart";
import { useTempData } from "@/hooks/useTempData";
import { usePhData } from "@/hooks/usePhData";
import { useTdsData } from "@/hooks/useTdsData";

export function Dashboard() {
  const { latestTemp } = useTempData();
  const { latestPh } = usePhData();
  const { latestTds } = useTdsData();

  const getTempStatus = (temp: number | null) => {
    if (temp === null) return { label: "", color: "text-muted-foreground" };
    if (temp >= 18 && temp <= 30)
      return { label: "Normal", color: "text-green-400" };
    if (temp < 18) return { label: "Too Cold", color: "text-blue-400" };
    return { label: "Too Hot", color: "text-red-400" };
  };

  const statusTemp = getTempStatus(latestTemp);

  const getPhStatus = (ph: number | null) => {
    if (ph === null) return { label: "", color: "text-muted-foreground" };
    if (ph >= 6 && ph <= 7) return { label: "Normal", color: "text-green-400" };
    if (ph < 6) return { label: "Low", color: "text-blue-400" };
    return { label: "High", color: "text-red-400" };
  };
  const statusPh = getPhStatus(latestPh);

  const getTdsStatus = (tds: number | null) => {
    if (tds === null) return { label: "", color: "text-muted-foreground" };
    if (tds >= 540 && tds <= 860)
      return { label: "Normal", color: "text-green-400" };
    if (tds < 540) return { label: "Low", color: "text-blue-400" };
    return { label: "High", color: "text-red-400" };
  };
  const statusTds = getTdsStatus(latestTds);

  const widgets = [
    {
      name: "pH",
      desc: "Measures the acidity level of the water",
      value: latestPh !== null ? latestPh.toFixed(1) : "--",
      satuan: " pH",
      pict: <Droplet className="text-white w-5 h-5 " strokeWidth={1.5} />,
      result: statusPh.label,
    },
    {
      name: "TDS",
      desc: "Indicates nutrient concentration in water",
      value: latestTds !== null ? latestTds.toFixed(1) : "--",
      pict: <Droplet className="w-5 text-white h-5 " strokeWidth={1.5} />,
      satuan: " ppm",
      result: statusTds.label,
    },

    {
      name: "Temperature",
      desc: "Current water temperature for plant growth",
      value: latestTemp !== null ? latestTemp.toFixed(1) : "--",
      pict: <Thermometer className="w-5 text-white h-5 " strokeWidth={1.5} />,
      satuan: " °c",
      result: statusTemp.label,
    },
  ];

  return (
    <main className=" flex flex-col gap-4 ">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[22px] text-black">Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring of plant growth</p>
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4 pt-2">
        <div
          className="relative  rounded-xl overflow-hidden flex border "
          style={{
            backgroundImage: "url('/lettuces.png')",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t  from-black/60 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              <p className="text-sm mt-1">Lettuce Nutrition Normal</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 z-10  text-white text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <div className="absolute top-4 right-3 z-20 rounded-lg px-3 py-2  flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">BTP, Makassar</span>
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 w-full   px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets.map((item, index) => (
                <Widget
                  key={index}
                  result={item.result}
                  name={item.name}
                  desc={item.desc}
                  value={item.value}
                  pict={item.pict}
                  unit={item.satuan}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <IdealCondition />
          <Forecast />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <WaterTank />
        <ChartPhLine />
        <ChartTDS />
        <TempAreaChart />
      </div>
    </main>
  );
}
