"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getEcho } from "@/lib/echo";
import { getActiveBranchId } from "@/store/branch-store";
import type {
  ApiItemResponse,
  ApiListResponse,
  DashboardStats,
  RestaurantTable,
} from "@/types";

export function useTables() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: { tables?: RestaurantTable[] } | RestaurantTable[] }>(
        "/api/v1/floor"
      );
      const payload = data.data;
      if (Array.isArray(payload)) return payload;
      return payload.tables ?? [];
    },
  });

  useEffect(() => {
    const branchId = getActiveBranchId();
    const echo = getEcho();
    if (!branchId || !echo) return;

    const channel = echo.private(`branch.${branchId}.floor`);
    channel.listen(".floor.updated", (payload: { tables?: RestaurantTable[] }) => {
      if (payload.tables) qc.setQueryData(["tables"], payload.tables);
      else qc.invalidateQueries({ queryKey: ["tables"] });
    });

    return () => {
      echo.leave(`branch.${branchId}.floor`);
    };
  }, [qc]);

  return query;
}

export function useUpdateTablePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      pos_x,
      pos_y,
    }: {
      id: string;
      pos_x: number;
      pos_y: number;
    }) => {
      const { data } = await apiClient.patch<ApiItemResponse<RestaurantTable>>(
        `/api/v1/tables/${id}`,
        { pos_x, pos_y }
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Record<string, number> }>(
        "/api/v1/dashboard"
      );
      const d = data.data;
      const mapped: DashboardStats = {
        today_reservations: d.todays_reservations ?? 0,
        pending_approvals: d.pending_requests ?? 0,
        seated_now: d.occupied_tables ?? 0,
        occupancy_rate: d.occupancy_percentage ?? 0,
        no_shows_today: d.no_shows ?? 0,
      };
      return mapped;
    },
  });
}
