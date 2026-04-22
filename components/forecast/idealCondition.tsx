import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const IdealCondition = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ideal Condition</CardTitle>
        <CardDescription>Range for optimal plant growth</CardDescription>
      </CardHeader>

      <CardContent>
        {/* detail */}
        <div className=" space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <span className="text-black">pH Level</span>
            <span className="font-medium">5.5 – 6.5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black">TDS</span>
            <span className="font-medium">800 – 1200 ppm</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-black">Temperature</span>
            <span className="font-medium">18 – 24°C</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-black">Water Volume</span>
            <span className="font-medium">1.000 liter</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
