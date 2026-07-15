"use client";

import { motion } from "framer-motion";
import { Countdown } from "@/components/floor-plan/countdown";
import { cn } from "@/lib/utils";
import { TABLE_STATUS_COLORS, type RestaurantTable, type TableStatus } from "@/types";

type TableNodeProps = {
  table: RestaurantTable;
  selected?: boolean;
  recommended?: boolean;
  dragMode?: boolean;
  onSelect?: (table: RestaurantTable) => void;
  onDragEnd?: (table: RestaurantTable, pos: { x: number; y: number }) => void;
};

export function TableNode({
  table,
  selected,
  recommended,
  dragMode,
  onSelect,
  onDragEnd,
}: TableNodeProps) {
  const status = (table.status in TABLE_STATUS_COLORS
    ? table.status
    : "available") as TableStatus;
  const colors = TABLE_STATUS_COLORS[status];
  const width = Number(table.width ?? 72);
  const height = Number(table.height ?? 72);
  const x = Number(table.pos_x ?? 0);
  const y = Number(table.pos_y ?? 0);
  const showTimer =
    Boolean(table.ends_at) &&
    (status === "occupied" || status === "reserved" || status === "vip_reserved");

  return (
    <motion.button
      type="button"
      drag={dragMode}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (!dragMode || !onDragEnd) return;
        onDragEnd(table, {
          x: Math.max(0, x + info.offset.x),
          y: Math.max(0, y + info.offset.y),
        });
      }}
      onClick={() => onSelect?.(table)}
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: colors.fill,
        boxShadow: recommended
          ? `0 0 0 3px ${colors.ring}, 0 8px 24px rgba(0,0,0,0.18)`
          : selected
            ? `0 0 0 3px white, 0 0 0 6px ${colors.ring}`
            : undefined,
      }}
      className={cn(
        "absolute flex flex-col items-center justify-center text-white transition",
        table.shape === "circle" || table.shape === "round"
          ? "rounded-full"
          : "rounded-xl",
        dragMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        recommended && "animate-pulse"
      )}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Table ${table.number}, ${colors.label}`}
    >
      <span className="text-sm font-semibold leading-none drop-shadow-sm">
        {table.number}
      </span>
      <span className="mt-0.5 text-[10px] opacity-90">{table.capacity}p</span>
      {showTimer && table.ends_at ? (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-charcoal/80 px-1.5 py-0.5">
          <Countdown endsAt={table.ends_at} />
        </div>
      ) : null}
    </motion.button>
  );
}
