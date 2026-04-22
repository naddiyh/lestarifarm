import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WidgetProps = {
  name: string;
  pict: React.ReactNode;
  desc: string;
  value?: number | string;
  unit: string;
  result: string;
};

export const Widget = ({
  name,
  pict,
  desc,
  value,
  unit,
  result,
}: WidgetProps) => {
  return (
    <Card className=" backdrop-blur-md bg-white/10 border  border-white/20 rounded-xl shadow-xl ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md text-white">{name}</CardTitle>
          <div>{pict}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <div className="inline-flex items-center gap-1">
          <h1 className="text-3xl text-white font-semibold">{value}</h1>
          <h6 className="text-sm text-accent">{unit}</h6>

          <div
            className={`mx-1  bg-orange-100 text-orange-500 backdrop-blur-sm px-3 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)`}
          >
            <p className="text-xs">{result}</p>
          </div>
        </div>

        <CardDescription className="text-xs hidden md:flex text-accent">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
