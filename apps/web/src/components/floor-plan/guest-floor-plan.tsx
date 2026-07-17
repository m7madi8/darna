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
    const measure = () => setViewportWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const scale = useMemo(() => {
    // Never default to 1 — that expands the page to ~780px and clips the UI
    if (viewportWidth <= 0) return 0;
    return Math.min(1, Math.max(0.2, (viewportWidth - 8) / maxX));
  }, [viewportWidth, maxX]);

  const scaledW = scale > 0 ? maxX * scale : undefined;
  const scaledH = scale > 0 ? maxY * scale : undefined;

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
      className={cn("w-full min-w-0 max-w-full space-y-3 overflow-hidden", className)}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-[11px] tracking-[0.14em] text-cream-200/45">
          {t.floor} · {partySize} {t.guests}
        </p>
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-cream-200/50">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" /> {t.free}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-stone-400" />{" "}
            {t.tooSmallForParty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" /> {t.taken}
          </span>
        </div>
      </div>

      {quickPick.length > 0 ? (
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {quickPick.map((table) => {
            const active = selectedTableId === table.id;
            return (
              <button
                key={table.id}
                type="button"
                onClick={() => onSelectTable?.(table)}
                className={cn(
                  "min-w-0 rounded-full px-2.5 py-2.5 text-center text-xs font-medium transition",
                  active
                    ? "bg-cream-200 text-forest-800"
                    : "border border-green-500/40 bg-green-500/10 text-cream-200"
                )}
              >
                <span className="block truncate">
                  {t.tableWord} {table.number}
                </span>
                <span className="opacity-60">{table.capacity}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-cream-200/10 bg-forest-800 shadow-glow sm:rounded-[1.75rem]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(85,133,108,0.22),transparent_70%)]" />
        <div
          ref={viewportRef}
          className="relative w-full min-w-0 overflow-x-hidden overflow-y-auto p-2.5 sm:p-5"
          style={{
            maxHeight: "min(52vh, 480px)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {scale > 0 ? (
            <div
              className="relative mx-auto"
              style={{ width: scaledW, height: scaledH }}
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
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-cream-200/40">
              …
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
