import { ChartPHBar } from "@/components/chart/pHchart";
import { ChartTDSBar } from "@/components/chart/tdsChart";
import { AvgTempChart } from "@/components/chart/tempChart";
import { OverviewCondition } from "@/components/chart/overviewChart";
export default function Monitoring() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OverviewCondition />
      <ChartTDSBar />
      <ChartPHBar />
      <AvgTempChart />
    </div>
  );
}
