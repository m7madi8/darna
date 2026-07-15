"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TableNode } from "@/components/floor-plan/table-node";
import type { RestaurantTable } from "@/types";
import { cn } from "@/lib/utils";

type FloorPlanProps = {
  tables: RestaurantTable[];
  selectedTableId?: string | null;
  recommendedIds?: string[];
  dragMode?: boolean;
  className?: string;
  onSelectTable?: (table: RestaurantTable) => void;
  onMoveTable?: (table: RestaurantTable, pos: { x: number; y: number }) => void;
};

const legend = [
  { label: "Available", color: "#22c55e" },
  { label: "Unavailable", color: "#ef4444" },
] as const;

export function FloorPlan({
  tables,
  selectedTableId,
  recommendedIds = [],
  dragMode,
  className,
  onSelectTable,
  onMoveTable,
}: FloorPlanProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const maxX = Math.max(
    640,
    ...tables.map((t) => Number(t.pos_x) + Number(t.width ?? 72) + 48)
  );
  const maxY = Math.max(
    420,
    ...tables.map((t) => Number(t.pos_y) + Number(t.height ?? 72) + 64)
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setViewportWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = useMemo(() => {
    if (viewportWidth <= 0) return 1;
    return Math.min(1, viewportWidth / maxX);
  }, [viewportWidth, maxX]);

  return (
    <div className={cn("w-full max-w-full space-y-4 overflow-x-hidden", className)}>
      <div className="flex flex-wrap gap-3">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      <div
        ref={viewportRef}
        className="max-w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-[color:var(--border)] bg-stone-100/80 p-3 dark:bg-charcoal-950/60 sm:p-4"
        style={{ maxHeight: "min(70vh, 640px)" }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: maxX * scale,
            height: maxY * scale,
          }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left rounded-xl"
            style={{
              width: maxX,
              height: maxY,
              transform: `scale(${scale})`,
              backgroundImage:
                "linear-gradient(rgba(28,25,23,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(28,25,23,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <rect
                x="24"
                y="24"
                width={Math.max(120, maxX - 80)}
                height={Math.max(80, maxY - 80)}
                rx="16"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="6 6"
              />
            </svg>

            {tables.map((table) => (
              <TableNode
                key={table.id}
                table={table}
                selected={selectedTableId === table.id}
                recommended={recommendedIds.includes(table.id)}
                dragMode={dragMode}
                onSelect={onSelectTable}
                onDragEnd={onMoveTable}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
