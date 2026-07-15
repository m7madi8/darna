import { apiClient } from "@/lib/api-client";
import type { ApiItemResponse, User } from "@/types";

export async function ensureCsrfCookie() {
  await apiClient.get("/sanctum/csrf-cookie");
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<ApiItemResponse<User>>("/api/me");
  return data.data;
}

export async function login(email: string, password: string): Promise<User> {
  await ensureCsrfCookie();
  await apiClient.post("/login", { email, password });
  return fetchMe();
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/logout");
  } finally {
    // Session cleared server-side; client store handled by caller.
  }
}
