export const ReservationStatuses = [
  "pending",
  "approved",
  "checked_in",
  "completed",
  "rejected",
  "cancelled",
  "expired",
  "no_show",
] as const;

export const TableStatuses = [
  "available",
  "pending",
  "reserved",
  "occupied",
  "out_of_service",
  "cleaning",
  "vip_reserved",
] as const;

export type ReservationStatus = (typeof ReservationStatuses)[number];
export type TableStatus = (typeof TableStatuses)[number];
