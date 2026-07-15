"use client";

import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Notifications</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Channel preferences for SMS, email, and in-app alerts.
        </p>
      </div>
      <EmptyState
        icon={Bell}
        title="Inbox is quiet"
        description="Pending approvals, vip arrivals, and overtime alerts will surface here. Preference toggles connect to the notification preference model."
      />
    </div>
  );
}
