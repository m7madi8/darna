"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ApiItemResponse,
  ApiListResponse,
  Branch,
  Customer,
  Reservation,
  RestaurantTable,
} from "@/types";

export function usePublicBranch(slug: string) {
  return useQuery({
    queryKey: ["public", "branch", slug],
    enabled: Boolean(slug),
    retry: false,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiItemResponse<Branch>>(
        `/api/v1/public/branches/${slug}`
      );
      return data.data;
    },
  });
}

export function usePublicFloor(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["public", "floor", slug],
    enabled: Boolean(slug) && (options?.enabled ?? true),
    retry: false,
    staleTime: 15_000,
    queryFn: async () => {
      const { data } = await apiClient.get<{
        data: {
          tables: RestaurantTable[];
          reservations: Array<{
            id: string;
            table_id: string;
            ends_at: string;
            status: string;
          }>;
        };
      }>(`/api/v1/public/branches/${slug}/floor`);
      return data.data;
    },
  });
}

export function usePublicAvailability(
  slug: string,
  params: { date: string; time: string; party_size: number } | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["public", "availability", slug, params],
    enabled:
      Boolean(slug && params?.date && params?.time && (params?.party_size ?? 0) > 0) &&
      (options?.enabled ?? true),
    retry: false,
    staleTime: 15_000,
    queryFn: async () => {
      const { data } = await apiClient.get<{
        data: {
          recommended_tables: RestaurantTable[];
          has_availability: boolean;
          suggest_waiting_list: boolean;
          duration_minutes: number;
        };
      }>(`/api/v1/public/branches/${slug}/availability`, { params: params! });
      return data.data;
    },
  });
}

export function useRecommendedTables(
  slug: string,
  params: { date: string; time: string; party_size: number }
) {
  const availability = usePublicAvailability(slug, params);
  return {
    ...availability,
    data: availability.data
      ? {
          tables: availability.data.recommended_tables,
          recommendedIds: availability.data.recommended_tables.map((t) => t.id),
        }
      : undefined,
  };
}

export function useCreatePublicReservation(slug: string) {
  return useMutation({
    mutationFn: async (payload: {
      guest_name: string;
      guest_phone: string;
      party_size: number;
      starts_at: string;
      duration_minutes?: number;
      notes?: string;
      table_id?: string | null;
      preferred_table_id?: string;
      is_vip?: boolean;
    }) => {
      const { data } = await apiClient.post<ApiItemResponse<Reservation>>(
        `/api/v1/public/branches/${slug}/reservations`,
        payload
      );
      return data.data;
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiListResponse<Customer>>(
        "/api/v1/customers"
      );
      return data.data;
    },
  });
}
