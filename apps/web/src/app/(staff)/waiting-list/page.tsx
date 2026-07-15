"use client";

import { ListOrdered } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function WaitingListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Waiting list</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Capture overflow demand when the floor is fully committed.
        </p>
      </div>
      <EmptyState
        icon={ListOrdered}
        title="Queue is clear"
        description="When tables are unavailable, guests can join a premium waiting list. Notifications and estimated wait arrive in a later release."
      />
    </div>
  );
}
