"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAX_VOLUME = 1000;
const TANK_INNER_H = 230;

function getStatus(vol: number) {
  if (vol >= 700)
    return { text: "Sufficient", color: "bg-green-50 text-green-600" };
  if (vol >= 400)
    return { text: "Low - refill soon", color: "bg-yellow-50 text-yellow-600" };
  return { text: "Critical - refill now", color: "bg-red-50 text-red-600" };
}

function getWaterColor(pct: number) {
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

function Wave({ color }: { color: string }) {
  return (
    <div className="absolute -top-2 -left-3 -right-3 h-4 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        style={{
          width: "200%",
          height: "16px",
          animation: "waveMove 2.5s linear infinite",
        }}
      >
        <style>{`
          @keyframes waveMove {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <path
          d="M0 8 C25 2 50 14 75 8 C100 2 125 14 150 8
             C175 2 200 14 225 8 C250 2 275 14 300 8
             C325 2 350 14 375 8 C400 2 400 16 400 16 L0 16 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

function TankSVG() {
  return (
    <svg
      width="220"
      height="320"
      viewBox="0 0 180 240"
      fill="none"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <path
        d="M20 40 L20 200 Q20 218 90 218 Q160 218 160 200 L160 40"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* tutup atas */}
      <ellipse
        cx="90"
        cy="40"
        rx="70"
        ry="16"
        fill="#EAEAEA"
        stroke="#D0D0D0"
        strokeWidth="1"
      />
      <ellipse
        cx="90"
        cy="38"
        rx="55"
        ry="11"
        fill="#F5F5F5"
        stroke="#C8C8C8"
        strokeWidth="0.8"
      />

      <ellipse
        cx="90"
        cy="20"
        rx="14"
        ry="5"
        fill="#D8D8D8"
        stroke="#BEBEBE"
        strokeWidth="1"
      />
      <rect
        x="80"
        y="10"
        width="20"
        height="12"
        rx="4"
        fill="#CACACA"
        stroke="#AAAAAA"
        strokeWidth="0.8"
      />

      {[85, 115, 145, 175].map((cy) => (
        <ellipse
          key={cy}
          cx="90"
          cy={cy}
          rx="70"
          ry="8"
          stroke="rgba(0,0,0,0.07)"
          strokeWidth="1.2"
          fill="none"
        />
      ))}

      <path
        d="M28 55 Q25 120 28 195"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M44 44 Q42 90 44 140"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      <ellipse
        cx="90"
        cy="210"
        rx="70"
        ry="10"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

export const WaterTank = () => {
  const [volume, setVolume] = useState<number>(562);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume((prev) => {
        const next = prev + (Math.random() * 20 - 10);
        return Math.round(Math.min(MAX_VOLUME, Math.max(50, next)));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.min(volume / MAX_VOLUME, 1);
  const fillPx = Math.round(pct * TANK_INNER_H);
  const status = getStatus(volume);
  const wc = getWaterColor(pct);

  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="w-full flex flex-row items-center justify-between ">
        <div>
          <CardTitle>Water Volume</CardTitle>
          <CardDescription>
            Max {MAX_VOLUME.toLocaleString()} L capacity
          </CardDescription>
        </div>
        <span
          className={`text-[11px] px-2.5 rounded-full font-medium ${status.color}`}
        >
          {status.text}
        </span>
      </CardHeader>
      <CardContent className="flex justify-center items-center ">
        <div className="relative w-54 h-80">
          <div
            className="absolute overflow-hidden transition-all duration-700 ease-in-out"
            style={{
              bottom: "22px",
              left: "23px",
              right: "20px",
              height: `${fillPx}px`,
              borderRadius: "0 0 50% 50% / 0 0 18px 18px",
              zIndex: 5,
            }}
          >
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `linear-gradient(to bottom, ${wc.from}, ${wc.to})`,
              }}
            >
              <Wave color={wc.wave} />
            </div>
          </div>

          <TankSVG />

          <div
            className="absolute flex flex-col justify-between pointer-events-none"
            style={{ right: "-35px", top: "42px", bottom: "22px" }}
          >
            {["1000L", "750L", "500L", "250L", "0L"].map((l) => (
              <span key={l} className="text-sm text-gray-500 leading-none">
                {l}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between w-full items-center">
        <div>
          <p className="text-xs font-medium mb-0.5">Alert will be sent:</p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            <li>• Below 400L</li>
            <li>• Tank is full</li>
          </ul>
        </div>
        <div className="text-center mb-2">
          <span className="text-2xl font-semibold tabular-nums">
            {volume.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground ml-1">L</span>
        </div>
        <p>
          <span className="text-xl font-medium text-gray-600">
            {Math.round(pct * 100)}%
          </span>
          <span className="text-sm text-muted-foreground ml-1">terisi</span>
        </p>
      </CardFooter>
    </Card>
  );
};
