"use client";

import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Branch hours, approval rules, and service defaults.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {["Working hours", "Business rules", "Notification channels", "Integrations"].map(
          (item) => (
            <Card key={item}>
              <CardContent>
                <p className="font-medium">{item}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Configurable once the settings API is published.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
      <EmptyState
        icon={Settings}
        title="Configuration shell ready"
        description="Editors for special hours, holidays, and max party size will attach to these cards without changing the layout."
      />
    </div>
  );
}
