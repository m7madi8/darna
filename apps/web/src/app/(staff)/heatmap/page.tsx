"use client";

import { Flame } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function HeatmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Heatmap</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Visual demand intensity across tables and dayparts.
        </p>
      </div>
      <EmptyState
        icon={Flame}
        title="Heatmap awaits traffic"
        description="A spatial intensity map of seating demand will overlay the floor once enough historical bookings exist to score hotspots."
      />
    </div>
  );
}
