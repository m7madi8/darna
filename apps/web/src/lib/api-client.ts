import axios from "axios";
import { isStaffAuthBypassEnabled } from "@/lib/demo-staff";
import { getActiveBranchId } from "@/store/branch-store";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 2500,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiClient.interceptors.request.use((config) => {
  const branchId = getActiveBranchId();
  if (branchId) {
    config.headers["X-Branch-Id"] = branchId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Preview mode: stay on staff UI without bouncing to login
      if (isStaffAuthBypassEnabled()) {
        return Promise.reject(error);
      }
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.includes("/reservation") && !path.includes("/book")) {
        window.location.href = `/login?next=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  }
);
