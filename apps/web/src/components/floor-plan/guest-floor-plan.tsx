"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { GuestTableNode } from "@/components/floor-plan/guest-table-node";
import { useLocale } from "@/components/locale/locale-provider";
import { cn } from "@/lib/utils";
import { isGuestTableSelectable } from "@/lib/table-party-size";
import type { RestaurantTable } from "@/types";

type GuestFloorPlanProps = {
  tables: RestaurantTable[];
  selectedTableId?: string | null;
  recommendedIds?: string[];
  partySize?: number;
  className?: string;
  onSelectTable?: (table: RestaurantTable) => void;
};

export function GuestFloorPlan({
  tables,
  selectedTableId,
  recommendedIds = [],
  partySize = 2,
  className,
  onSelectTable,
}: GuestFloorPlanProps) {
  const { t } = useLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const maxX = Math.max(780, ...tables.map((t) => Number(t.pos_x) + 140));
  const maxY = Math.max(560, ...tables.map((t) => Number(t.pos_y) + 150));

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
    return Math.min(1, (viewportWidth - 4) / maxX);
  }, [viewportWidth, maxX]);

  const scaledW = maxX * scale;
  const scaledH = maxY * scale;

  const quickPick = useMemo(
    () =>
      tables
        .filter((t) =>
          isGuestTableSelectable(t, partySize, recommendedIds.includes(t.id))
        )
        .sort((a, b) => Number(a.number) - Number(b.number)),
    [tables, recommendedIds, partySize]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-full space-y-3", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.16em] text-cream-200/45">
          {t.floor} · {partySize} {t.guests}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] text-cream-200/50">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" /> {t.free}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-stone-400" />{" "}
            {t.tooSmallForParty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> {t.taken}
          </span>
        </div>
      </div>

      {quickPick.length > 0 ? (
        <div className="flex max-w-full flex-wrap gap-2">
          {quickPick.map((table) => {
            const active = selectedTableId === table.id;
            return (
              <button
                key={table.id}
                type="button"
                onClick={() => onSelectTable?.(table)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium transition",
                  active
                    ? "bg-cream-200 text-forest-800"
                    : "border border-green-500/40 bg-green-500/10 text-cream-200"
                )}
              >
                {t.tableWord} {table.number}
                <span className="ml-1 opacity-60">{table.capacity}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-[1.75rem] border border-cream-200/10 bg-forest-800 shadow-glow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(85,133,108,0.22),transparent_70%)]" />
        <div
          ref={viewportRef}
          className="relative max-w-full overflow-x-auto overflow-y-auto p-3 sm:p-5"
          style={{
            maxHeight: "min(58vh, 520px)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            className="relative mx-auto"
            style={{ width: scaledW || "100%", height: scaledH }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: maxX,
                height: maxY,
                transform: `scale(${scale})`,
                backgroundImage:
                  "radial-gradient(rgba(236,233,212,0.08) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              {tables.map((table, index) => (
                <GuestTableNode
                  key={table.id}
                  table={table}
                  index={index}
                  partySize={partySize}
                  selected={selectedTableId === table.id}
                  recommended={recommendedIds.includes(table.id)}
                  onSelect={onSelectTable}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
