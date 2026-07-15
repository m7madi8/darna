export type TableStatus =
  | "available"
  | "pending"
  | "reserved"
  | "occupied"
  | "out_of_service"
  | "cleaning"
  | "vip_reserved";

export type ReservationStatus =
  | "pending"
  | "approved"
  | "confirmed"
  | "checked_in"
  | "seated"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show"
  | "expired";

export type Branch = {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  address?: string | null;
  timezone?: string;
  organization_id?: string;
  is_active?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  organization_id?: string;
  organization?: { id: string; name: string };
  branches?: Branch[];
  roles?: Array<{ name: string; slug?: string }>;
  permissions?: string[];
};

export type RestaurantTable = {
  id: string;
  number: string | number;
  name?: string | null;
  capacity: number;
  min_capacity?: number;
  status: TableStatus;
  is_vip?: boolean;
  area_id?: string | null;
  pos_x: number;
  pos_y: number;
  width?: number;
  height?: number;
  rotation?: number;
  shape?: "rect" | "circle" | "round" | string;
  ends_at?: string | null;
  reservation_id?: string | null;
  guest_name?: string | null;
};

export type Reservation = {
  id: string;
  code: string;
  branch_id: string;
  customer_id?: string | null;
  table_id?: string | null;
  preferred_table_id?: string | null;
  area_id?: string | null;
  status: ReservationStatus;
  party_size: number;
  starts_at: string;
  ends_at: string;
  duration_minutes?: number;
  source?: string;
  notes?: string | null;
  guest_name: string;
  guest_phone: string;
  is_vip?: boolean;
  checked_in_at?: string | null;
  checked_out_at?: string | null;
  rejection_reason?: string | null;
  table?: RestaurantTable | null;
  customer?: { id: string; name: string; phone?: string; is_vip?: boolean } | null;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  is_vip?: boolean;
  is_blacklisted?: boolean;
  visit_count?: number;
};

export type DashboardStats = {
  today_reservations: number;
  pending_approvals: number;
  seated_now: number;
  occupancy_rate: number;
  no_shows_today?: number;
};

export type ApiListResponse<T> = {
  data: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
};

export type ApiItemResponse<T> = {
  data: T;
};

export const TABLE_STATUS_COLORS: Record<
  TableStatus,
  { label: string; fill: string; ring: string }
> = {
  available: { label: "Available", fill: "#22c55e", ring: "#16a34a" },
  pending: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
  reserved: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
  occupied: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
  out_of_service: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
  cleaning: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
  vip_reserved: { label: "Unavailable", fill: "#ef4444", ring: "#dc2626" },
};
