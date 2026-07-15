"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/locale/locale-provider";
import { cn } from "@/lib/utils";
import {
  getGuestTableAvailability,
  type GuestTableAvailability,
} from "@/lib/table-party-size";
import type { RestaurantTable } from "@/types";

type GuestTableNodeProps = {
  table: RestaurantTable;
  index?: number;
  partySize?: number;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: (table: RestaurantTable) => void;
};

const GREEN = "#22c55e";
const RED = "#ef4444";
const MUTED = "#78716c";

function chairPositions(capacity: number, isRound: boolean) {
  if (isRound) {
    const count = Math.min(Math.max(capacity, 2), 8);
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return { x: Math.cos(angle), y: Math.sin(angle) };
    });
  }

  const seats = Math.min(Math.max(capacity, 2), 10);
  const perSide = Math.ceil(seats / 2);
  const positions: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < perSide; i++) {
    const t = perSide === 1 ? 0.5 : i / (perSide - 1);
    positions.push({ x: -0.32 + t * 0.64, y: -0.4 });
  }
  for (let i = 0; i < seats - perSide; i++) {
    const n = seats - perSide;
    const t = n === 1 ? 0.5 : i / (n - 1 || 1);
    positions.push({ x: -0.32 + t * 0.64, y: 0.4 });
  }
  return positions;
}

export function GuestTableNode({
  table,
  index = 0,
  partySize = 2,
  selected,
  recommended,
  onSelect,
}: GuestTableNodeProps) {
  const { t } = useLocale();
  const availability = getGuestTableAvailability(
    table,
    partySize,
    recommended
  );
  const selectable = availability === "selectable";
  const availabilityLabel: Record<GuestTableAvailability, string> = {
    selectable: t.free,
    too_small: t.tooSmallForParty,
    taken: t.taken,
  };
  const capacity = Number(table.capacity ?? 2);
  const isRound =
    table.shape === "circle" || table.shape === "round" || capacity <= 2;
  const isPill = !isRound && capacity >= 6;
  const x = Number(table.pos_x ?? 0);
  const y = Number(table.pos_y ?? 0);
  const base = isRound ? 78 : isPill ? 96 : 92;
  const w = isRound ? base : isPill ? base * 0.72 : base * 1.15;
  const h = isRound ? base : isPill ? base * 1.35 : base * 0.78;
  const pad = 22;
  const boxW = w + pad * 2;
  const boxH = h + pad * 2;

  const chairs = chairPositions(capacity, isRound);
  const label = String(table.number);

  const accent =
    availability === "selectable"
      ? GREEN
      : availability === "too_small"
        ? MUTED
        : RED;

  const chairFill = selected ? "#ece9d4" : "#162b20";
  const chairStroke = selected
    ? "rgba(236,233,212,0.9)"
    : availability === "selectable"
      ? "rgba(34,197,94,0.4)"
      : availability === "too_small"
        ? "rgba(120,113,108,0.45)"
        : "rgba(239,68,68,0.4)";
  const tableFill = selected ? "#ece9d4" : "#1c3628";
  const tableStroke = selected
    ? "#ece9d4"
    : availability === "selectable"
      ? "rgba(34,197,94,0.7)"
      : availability === "too_small"
        ? "rgba(120,113,108,0.55)"
        : "rgba(239,68,68,0.6)";
  const badgeFill = selected ? "#234431" : accent;
  const badgeText = selected ? "#ece9d4" : "#0f1d16";
  const glow = selected
    ? "drop-shadow(0 0 14px rgba(236, 233, 212, 0.35))"
    : availability === "selectable"
      ? "drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))"
      : availability === "too_small"
        ? "drop-shadow(0 0 6px rgba(120, 113, 108, 0.18))"
        : "drop-shadow(0 0 8px rgba(239, 68, 68, 0.22))";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.03 * index, duration: 0.35 }}
      whileHover={selectable ? { scale: 1.04 } : undefined}
      whileTap={selectable ? { scale: 0.98 } : undefined}
      disabled={!selectable}
      onClick={() => selectable && onSelect?.(table)}
      className={cn(
        "absolute bg-transparent p-0",
        selectable ? "cursor-pointer" : "cursor-not-allowed",
        availability === "too_small" ? "opacity-55" : "opacity-80"
      )}
      style={{
        left: x,
        top: y,
        width: boxW,
        height: boxH,
        filter: glow,
      }}
      aria-label={`${t.tableWord} ${table.number}, ${availabilityLabel[availability]}`}
    >
      <svg
        width={boxW}
        height={boxH}
        viewBox={`0 0 ${boxW} ${boxH}`}
        className="overflow-visible"
      >
        {chairs.map((c, i) => {
          const cx = boxW / 2 + c.x * w;
          const cy = boxH / 2 + c.y * h;
          const r = Math.min(w, h) * 0.11;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={chairFill}
              stroke={chairStroke}
              strokeWidth={selected ? 1.5 : 1}
            />
          );
        })}

        {isRound ? (
          <circle
            cx={boxW / 2}
            cy={boxH / 2}
            r={Math.min(w, h) * 0.28}
            fill={tableFill}
            stroke={tableStroke}
            strokeWidth={selected ? 2.5 : 1.5}
          />
        ) : (
          <rect
            x={(boxW - w * 0.55) / 2}
            y={(boxH - h * 0.42) / 2}
            width={w * 0.55}
            height={h * 0.42}
            rx={isPill ? h * 0.22 : 10}
            fill={tableFill}
            stroke={tableStroke}
            strokeWidth={selected ? 2.5 : 1.5}
          />
        )}

        <circle
          cx={boxW / 2}
          cy={boxH / 2}
          r={selected ? 15 : 13}
          fill={badgeFill}
          stroke={selected ? "#ece9d4" : "rgba(16,32,24,0.35)"}
          strokeWidth={selected ? 2 : 1}
        />
        <text
          x={boxW / 2}
          y={boxH / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={badgeText}
          fontSize={selected ? 10 : 9}
          fontWeight={700}
          fontFamily="var(--font-outfit), system-ui, sans-serif"
        >
          {label}
        </text>
      </svg>
    </motion.button>
  );
}
