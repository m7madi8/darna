"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/features/tables/use-tables";

const fallback = {
  today_reservations: 0,
  pending_approvals: 0,
  seated_now: 0,
  occupancy_rate: 0,
  no_shows_today: 0,
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();
  const stats = data ?? fallback;

  const cards = [
    { label: "Today's bookings", value: stats.today_reservations },
    { label: "Pending approval", value: stats.pending_approvals },
    { label: "Seated now", value: stats.seated_now },
    {
      label: "Occupancy",
      value: `${Math.round(Number(stats.occupancy_rate) || 0)}%`,
    },
    { label: "No-shows", value: stats.no_shows_today ?? 0 },
  ];

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Live pulse of the house for this service day.
          {isError ? " Showing zeros until the API is reachable." : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {card.label}
                </p>
                <p className="mt-3 font-display text-4xl tracking-tight">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
