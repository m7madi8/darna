"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Analytics</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Covers, covers per hour, and revenue proxies for the week.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Covers", "Avg party", "No-show rate"].map((label) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {label}
              </p>
              <div className="mt-6 h-24 rounded-xl bg-gradient-to-t from-olive-600/20 to-transparent" />
            </CardContent>
          </Card>
        ))}
      </div>

      <EmptyState
        icon={BarChart3}
        title="Charts awaken with more history"
        description="Once reservation volume lands, turn-time, peak hours, and channel mix will render here with exportable reports."
      />
    </div>
  );
}
