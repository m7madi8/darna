"use client";

import { useState } from "react";
import { FloorPlan } from "@/components/floor-plan/floor-plan";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useTables, useUpdateTablePosition } from "@/features/tables/use-tables";
import { useAuthStore } from "@/store/auth-store";
import { Map } from "lucide-react";

export default function FloorPage() {
  const { data, isLoading, isError } = useTables();
  const updatePosition = useUpdateTablePosition();
  const canLayout = useAuthStore((s) => s.can("tables.layout.update"));
  const permissions = useAuthStore((s) => s.permissions);
  const user = useAuthStore((s) => s.user);
  const isManager =
    permissions.length === 0 ||
    canLayout ||
    Boolean(
      user?.roles?.some((r) =>
        ["manager", "admin", "owner"].includes((r.slug || r.name || "").toLowerCase())
      )
    );
  const [dragMode, setDragMode] = useState(false);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Floor plan</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Live table status with Reverb updates and seating countdowns.
          </p>
        </div>
        {isManager ? (
          <Button
            variant={dragMode ? "primary" : "outline"}
            onClick={() => setDragMode((v) => !v)}
          >
            {dragMode ? "Done arranging" : "Arrange tables"}
          </Button>
        ) : null}
      </div>

      {!data?.length || isError ? (
        <EmptyState
          icon={Map}
          title="Floor is quiet"
          description="Tables appear here once the branch floor inventory is configured. Realtime updates subscribe automatically when connected."
        />
      ) : (
        <FloorPlan
          tables={data}
          dragMode={dragMode}
          onMoveTable={(table, pos) => {
            updatePosition.mutate({
              id: table.id,
              pos_x: Math.round(pos.x),
              pos_y: Math.round(pos.y),
            });
          }}
        />
      )}
    </div>
  );
}
