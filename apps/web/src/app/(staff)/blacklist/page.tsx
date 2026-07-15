"use client";

import { Ban } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function BlacklistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Blacklist</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Guests requiring manager review before booking.
        </p>
      </div>
      <EmptyState
        icon={Ban}
        title="No restricted guests"
        description="Flagged numbers and emails that need approval will list here, with reason history and lift controls for managers."
      />
    </div>
  );
}
