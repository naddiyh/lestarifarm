import { ChartPHBar } from "@/components/chart/pHchart";
import { ChartTDSBar } from "@/components/chart/tdsChart";
import { AvgTempChart } from "@/components/chart/tempChart";
import { OverviewCondition } from "@/components/chart/overviewChart";
import { ExportSensorButton } from "@/components/export/exportExcel";

export default function Monitoring() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between ">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-[22px] text-black">Monitoring</h1>
          <p className="text-gray-400">History and Average Data Sensor</p>
        </div>
        <div className="flex justify-end">
          <ExportSensorButton />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <OverviewCondition />

        <ChartTDSBar />
        <ChartPHBar />

        <AvgTempChart />
      </div>
    </div>
  );
}
