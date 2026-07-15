"use client";

import { format } from "date-fns";
import { DayTimeline } from "@/components/timeline/day-timeline";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useReservations } from "@/features/reservations/use-reservations";
import { Clock3 } from "lucide-react";

export default function TimelinePage() {
  const today = new Date();
  const { data, isLoading, isError } = useReservations({
    date: format(today, "yyyy-MM-dd"),
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Timeline</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          {format(today, "EEEE, MMMM d")} — seating flow across the evening.
        </p>
      </div>

      {!data?.length || isError ? (
        <EmptyState
          icon={Clock3}
          title="No bookings on the rail"
          description="Confirmed and pending reservations will plot along tonight's service timeline."
        />
      ) : (
        <DayTimeline date={today} reservations={data} />
      )}
    </div>
  );
}
