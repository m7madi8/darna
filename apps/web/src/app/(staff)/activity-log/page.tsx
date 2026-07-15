"use client";

import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Activity log</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Auditable trail of approvals, moves, and overrides.
        </p>
      </div>
      <EmptyState
        icon={Activity}
        title="No events captured yet"
        description="Staff actions on reservations and floor state are logged server-side. This feed surfaces them for managers and auditors."
      />
    </div>
  );
}
