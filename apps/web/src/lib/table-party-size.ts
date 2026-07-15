import type { RestaurantTable } from "@/types";

export type GuestTableAvailability = "selectable" | "too_small" | "taken";

export function tableFitsPartySize(
  table: RestaurantTable,
  partySize: number
): boolean {
  const minCapacity = table.min_capacity ?? 1;
  return table.capacity >= partySize && minCapacity <= partySize;
}

export function getGuestTableAvailability(
  table: RestaurantTable,
  partySize: number,
  recommended = false
): GuestTableAvailability {
  if (!tableFitsPartySize(table, partySize)) {
    return "too_small";
  }
  if (table.status === "available" || recommended) {
    return "selectable";
  }
  return "taken";
}

export function isGuestTableSelectable(
  table: RestaurantTable,
  partySize: number,
  recommended = false
): boolean {
  return getGuestTableAvailability(table, partySize, recommended) === "selectable";
}
