"use client";

import { Sparkles, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

function ConfidenceBars() {
  const factors = [
    { label: "TDS Trend", pct: 91 },
    { label: "Water Temperature", pct: 82 },
    { label: "Water Tank", pct: 30 },
  ];

  return (
    <div className="space-y-1.5 pt-1 pb-2">
      <p className="text-[10.5px] text-muted-foreground mb-2">
        Key Influencing Factors
      </p>
      {factors.map((f) => (
        <div key={f.label} className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground w-16 shrink-0">
            {f.label}
          </span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${f.pct}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-7 text-right">
            {f.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

export const Forecast = () => {
  return (
    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insight
          </CardTitle>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
            85% Confidence
          </span>
        </div>
        <CardDescription className="text-sm">
          Prediction based on sensor trends
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* Prediction box */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
          <TrendingDown className="w-10 h-6 text-orange-400 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Nutrient level will drop below optimal in{" "}
            <span className="text-sm font-semibold text-orange-500">
              2 hours
            </span>
          </p>
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between text-sm pt-1">
          <span className="text-muted-foreground">Trend</span>
          <span className="text-red-500 font-medium">
            ↓ 12% in last 3 hours
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-2" />

        {/* Confidence breakdown */}
        <ConfidenceBars />

        {/* Divider */}
        <div className="h-px bg-border mb-2" />

        {/* Recommended actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recommended Action</p>

          {[
            {
              name: "Fertilizer A",
              sub: "Add within 60 minutes",
              dose: "+25 ml",
            },
            {
              name: "Fertilizer B",
              sub: "Add within 60 minutes",
              dose: "+25 ml",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-lg transition"
              style={{ background: "#1A3A2A" }}
            >
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs" style={{ color: "#81C784" }}>
                  {item.sub}
                </p>
              </div>
              <span className="font-semibold" style={{ color: "#4ADE80" }}>
                {item.dose}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end text-xs text-muted-foreground pt-2">
          <span>Updated 2 min ago</span>
        </div>
      </CardContent>
    </Card>
  );
};
