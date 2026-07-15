"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/features/public/use-public-booking";

export default function CustomersPage() {
  const { data, isLoading, isError } = useCustomers();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Customers</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Guest profiles, visit history, and VIP signals.
        </p>
      </div>

      {!data?.length || isError ? (
        <EmptyState
          icon={Users}
          title="No guests yet"
          description="Customer records appear as reservations are created. VIP tiers and notes will surface here as the CRM module expands."
        />
      ) : (
        <div className="space-y-3">
          {data.map((customer) => (
            <Card key={customer.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{customer.name}</p>
                  {customer.is_vip ? <Badge tone="olive">VIP</Badge> : null}
                  {customer.is_blacklisted ? <Badge tone="danger">Blocked</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {customer.phone}
                  {customer.email ? ` · ${customer.email}` : ""}
                  {typeof customer.visit_count === "number"
                    ? ` · ${customer.visit_count} visits`
                    : ""}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
