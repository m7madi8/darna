"use client";

import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ReservationActions } from "@/components/reservations/reservation-actions";
import { formatParty } from "@/lib/utils";
import type { Reservation } from "@/types";

function statusTone(status: string) {
  if (status === "pending") return "warning" as const;
  if (status === "approved" || status === "confirmed") return "info" as const;
  if (status === "checked_in" || status === "seated") return "success" as const;
  if (status === "cancelled" || status === "rejected" || status === "no_show")
    return "danger" as const;
  return "neutral" as const;
}

type ReservationListProps = {
  reservations?: Reservation[];
  isLoading?: boolean;
  error?: Error | null;
};

export function ReservationList({
  reservations,
  isLoading,
  error,
}: ReservationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Unable to load reservations"
        description="Check your connection and branch selection, then try again."
      />
    );
  }

  if (!reservations?.length) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No reservations yet"
        description="New bookings and walk-ins will appear here once the service day starts."
      />
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation, index) => (
        <motion.div
          key={reservation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-medium">{reservation.guest_name}</h3>
                  <Badge tone={statusTone(reservation.status)}>
                    {reservation.status.replaceAll("_", " ")}
                  </Badge>
                  {reservation.is_vip ? <Badge tone="olive">VIP</Badge> : null}
                </div>
                <p className="text-sm text-[color:var(--muted)]">
                  {format(parseISO(reservation.starts_at), "EEE, MMM d · HH:mm")}
                  {" – "}
                  {format(parseISO(reservation.ends_at), "HH:mm")}
                  {" · "}
                  {formatParty(reservation.party_size)}
                  {reservation.table ? ` · Table ${reservation.table.number}` : ""}
                </p>
                <p className="text-xs text-[color:var(--muted)]">
                  {reservation.code} · {reservation.guest_phone}
                </p>
              </div>
              <ReservationActions reservation={reservation} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
