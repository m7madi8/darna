"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useApproveReservation,
  useCheckInReservation,
  useCheckOutReservation,
  useExtendReservation,
  useRejectReservation,
} from "@/features/reservations/use-reservations";
import type { Reservation } from "@/types";

export function ReservationActions({ reservation }: { reservation: Reservation }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [minutes, setMinutes] = useState(15);

  const approve = useApproveReservation();
  const reject = useRejectReservation();
  const checkIn = useCheckInReservation();
  const checkOut = useCheckOutReservation();
  const extend = useExtendReservation();

  const status = reservation.status;
  const busy =
    approve.isPending ||
    reject.isPending ||
    checkIn.isPending ||
    checkOut.isPending ||
    extend.isPending;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status === "pending" ? (
          <>
            <Button
              size="sm"
              loading={approve.isPending}
              disabled={busy}
              onClick={() => approve.mutate({ id: reservation.id })}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setRejectOpen(true)}
            >
              Reject
            </Button>
          </>
        ) : null}

        {status === "approved" || status === "confirmed" ? (
          <Button
            size="sm"
            loading={checkIn.isPending}
            disabled={busy}
            onClick={() => checkIn.mutate({ id: reservation.id })}
          >
            Check in
          </Button>
        ) : null}

        {status === "checked_in" || status === "seated" ? (
          <Button
            size="sm"
            loading={checkOut.isPending}
            disabled={busy}
            onClick={() => checkOut.mutate({ id: reservation.id })}
          >
            Check out
          </Button>
        ) : null}

        {status === "approved" ||
        status === "confirmed" ||
        status === "checked_in" ||
        status === "seated" ? (
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => setExtendOpen(true)}
          >
            Extend
          </Button>
        ) : null}
      </div>

      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject reservation"
        description="Share a brief reason for the guest record."
      >
        <div className="space-y-4">
          <Input
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Fully booked / party size / ..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={reject.isPending}
              onClick={async () => {
                await reject.mutateAsync({
                  id: reservation.id,
                  body: { reason },
                });
                setRejectOpen(false);
                setReason("");
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        title="Extend seating"
        description="Add extra minutes if the party is still dining."
      >
        <div className="space-y-4">
          <Input
            label="Minutes"
            type="number"
            min={5}
            max={120}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setExtendOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={extend.isPending}
              onClick={async () => {
                await extend.mutateAsync({
                  id: reservation.id,
                  body: { minutes },
                });
                setExtendOpen(false);
              }}
            >
              Extend
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
