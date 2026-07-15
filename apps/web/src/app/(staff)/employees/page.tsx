"use client";

import { UserRound } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Employees</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Roles, branch access, and floor permissions.
        </p>
      </div>
      <EmptyState
        icon={UserRound}
        title="Team directory coming online"
        description="Invite hosts, managers, and floor leads with fine-grained permissions. Assignment and attendance tooling will land with the people module."
      />
    </div>
  );
}
