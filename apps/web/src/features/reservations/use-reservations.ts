"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiItemResponse, ApiListResponse, Reservation } from "@/types";

export type ReservationFilters = {
  date?: string;
  status?: string;
  search?: string;
};

export function useReservations(filters: ReservationFilters = {}) {
  return useQuery({
    queryKey: ["reservations", filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiListResponse<Reservation>>(
        "/api/v1/reservations",
        {
          params: {
            date: filters.date,
            status: filters.status,
            q: filters.search,
          },
        }
      );
      return data.data;
    },
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await apiClient.post<ApiItemResponse<Reservation>>(
        "/api/v1/reservations",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservations"] });
      qc.invalidateQueries({ queryKey: ["tables"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

function useReservationAction(action: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body?: Record<string, unknown>;
    }) => {
      const { data } = await apiClient.post<ApiItemResponse<Reservation>>(
        `/api/v1/reservations/${id}/${action}`,
        body ?? {}
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservations"] });
      qc.invalidateQueries({ queryKey: ["tables"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useApproveReservation() {
  return useReservationAction("approve");
}
export function useRejectReservation() {
  return useReservationAction("reject");
}
export function useCheckInReservation() {
  return useReservationAction("check-in");
}
export function useCheckOutReservation() {
  return useReservationAction("check-out");
}
export function useExtendReservation() {
  return useReservationAction("extend");
}
