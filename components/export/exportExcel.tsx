"use client";

import { useState } from "react";
import { Download, Loader2, CalendarRange, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useExportSensor } from "@/hooks/useExport";

export function ExportSensorButton() {
  const { exportToExcel, loading, error } = useExportSensor();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const handleExport = async () => {
    if (!range?.from || !range?.to) return;
    await exportToExcel(range.from, range.to);
    setOpen(false);
  };

  const handleClear = () => {
    setRange(undefined);
  };

  const rangeLabel =
    range?.from && range?.to
      ? `${format(range.from, "dd MMM yyyy", { locale: id })} – ${format(
          range.to,
          "dd MMM yyyy",
          { locale: id },
        )}`
      : range?.from
        ? format(range.from, "dd MMM yyyy", { locale: id })
        : null;

  return (
    <div className="flex flex-col gap-1 cursor-pointer">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            {rangeLabel ?? "Export Excel"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-4" align="end">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Pilih Rentang Tanggal</p>
              {range && (
                <button
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
              locale={id}
            />

            {rangeLabel && (
              <p className="text-xs text-muted-foreground text-center">
                {rangeLabel}
              </p>
            )}

            <Button
              onClick={handleExport}
              disabled={!range?.from || !range?.to || loading}
              className="w-full flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengekspor...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Excel
                </>
              )}
            </Button>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
