import type { User } from "@/types";

/** Preview staff session when the API is offline / login is skipped */
export const DEMO_BRANCH_ID = "demo-branch-downtown";

export const DEMO_STAFF_PERMISSIONS = [
  "*",
  "tables.layout.update",
  "reservations.create",
  "reservations.update",
  "reservations.approve",
  "floor.view",
  "settings.update",
];

export const DEMO_STAFF_USER: User = {
  id: "demo-owner",
  name: "Darna Owner",
  email: "owner@darna.test",
  organization_id: "demo-org",
  organization: { id: "demo-org", name: "Darna" },
  branches: [
    {
      id: DEMO_BRANCH_ID,
      name: "Downtown",
      slug: "downtown",
      address: "Palestine, Ramallah",
      timezone: "Asia/Hebron",
      organization_id: "demo-org",
      is_active: true,
    },
  ],
  roles: [{ name: "Owner", slug: "owner" }],
  permissions: DEMO_STAFF_PERMISSIONS,
};

export function isStaffAuthBypassEnabled() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_STAFF_AUTH_BYPASS === "0") {
    return false;
  }
  // Default on for local preview when API/login is unavailable
  return true;
}
