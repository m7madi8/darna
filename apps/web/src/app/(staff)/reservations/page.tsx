"use client";

import { format } from "date-fns";
import { useState } from "react";
import { CreateReservationForm } from "@/components/reservations/create-reservation-form";
import { ReservationList } from "@/components/reservations/reservation-list";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useReservations } from "@/features/reservations/use-reservations";

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const date = format(new Date(), "yyyy-MM-dd");

  const { data, isLoading, error } = useReservations({
    date,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Reservations</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Approve, seat, and shepherd tonight&apos;s book.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>New reservation</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            placeholder="Search name, phone, code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--card-solid)] px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            "pending",
            "approved",
            "checked_in",
            "completed",
            "rejected",
            "cancelled",
            "no_show",
          ].map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <ReservationList
        reservations={data}
        isLoading={isLoading}
        error={error as Error | null}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create reservation"
        description="Walk-in or phone booking for this branch."
        className="max-w-2xl"
      >
        <CreateReservationForm onCreated={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}
