"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountdownProps = {
  endsAt: string;
  className?: string;
};

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Countdown({ endsAt, className }: CountdownProps) {
  const [remaining, setRemaining] = useState(
    () => new Date(endsAt).getTime() - Date.now()
  );

  useEffect(() => {
    const tick = () => setRemaining(new Date(endsAt).getTime() - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const overdue = remaining <= 0;

  return (
    <span
      className={cn(
        "font-mono text-[10px] tabular-nums tracking-tight",
        overdue ? "text-red-200" : "text-white/90",
        className
      )}
    >
      {overdue ? "Overdue" : formatRemaining(remaining)}
    </span>
  );
}
