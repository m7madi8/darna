"use client";

import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types";
import { cn } from "@/lib/utils";

type DayTimelineProps = {
  date: Date;
  reservations: Reservation[];
  startHour?: number;
  endHour?: number;
  onSelect?: (reservation: Reservation) => void;
};

function statusTone(status: string) {
  if (status === "pending") return "warning" as const;
  if (status === "approved" || status === "confirmed") return "info" as const;
  if (status === "checked_in" || status === "seated") return "success" as const;
  if (status === "cancelled" || status === "rejected" || status === "no_show")
    return "danger" as const;
  return "neutral" as const;
}

export function DayTimeline({
  date,
  reservations,
  startHour = 10,
  endHour = 23,
  onSelect,
}: DayTimelineProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const dayStart = new Date(date);
  dayStart.setHours(startHour, 0, 0, 0);
  const totalMinutes = (endHour - startHour) * 60;

  const positioned = reservations
    .map((r) => {
      const start = parseISO(r.starts_at);
      const end = parseISO(r.ends_at);
      const leftMin = (start.getTime() - dayStart.getTime()) / 60000;
      const widthMin = Math.max(30, (end.getTime() - start.getTime()) / 60000);
      return { reservation: r, leftMin, widthMin };
    })
    .filter((item) => item.leftMin + item.widthMin > 0 && item.leftMin < totalMinutes);

  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="min-w-[760px]">
        <div
          className="relative mb-3 grid"
          style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}
        >
          {hours.map((hour) => (
            <div key={hour} className="text-xs text-[color:var(--muted)]">
              {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
            </div>
          ))}
        </div>

        <div className="relative h-48 rounded-xl bg-[color:var(--muted-bg)]">
          <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-r border-[color:var(--border)] last:border-r-0"
              />
            ))}
          </div>

          {positioned.map(({ reservation, leftMin, widthMin }, index) => {
            const left = `${(leftMin / totalMinutes) * 100}%`;
            const width = `${(widthMin / totalMinutes) * 100}%`;
            const top = 12 + (index % 4) * 42;
            return (
              <motion.button
                key={reservation.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelect?.(reservation)}
                style={{ left, width, top }}
                className={cn(
                  "absolute h-9 overflow-hidden rounded-lg border border-olive-600/20 bg-olive-600/90 px-2 text-left text-white shadow-soft"
                )}
              >
                <div className="flex items-center justify-between gap-2 truncate text-xs font-medium">
                  <span className="truncate">{reservation.guest_name}</span>
                  <Badge tone={statusTone(reservation.status)} className="shrink-0 scale-90">
                    {reservation.status.replace("_", " ")}
                  </Badge>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
