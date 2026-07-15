"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMe, login as loginRequest, logout as logoutRequest } from "@/lib/auth";
import {
  DEMO_BRANCH_ID,
  DEMO_STAFF_PERMISSIONS,
  DEMO_STAFF_USER,
  isStaffAuthBypassEnabled,
} from "@/lib/demo-staff";
import { useAuthStore } from "@/store/auth-store";
import { useBranchStore } from "@/store/branch-store";

function applyDemoStaffSession(
  setUser: (user: typeof DEMO_STAFF_USER, permissions?: string[]) => void,
  setBranchId: (id: string | null) => void,
  branchId: string | null
) {
  setUser(DEMO_STAFF_USER, DEMO_STAFF_PERMISSIONS);
  if (!branchId) setBranchId(DEMO_BRANCH_ID);
  return DEMO_STAFF_USER;
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clear = useAuthStore((s) => s.clear);
  const setBranchId = useBranchStore((s) => s.setBranchId);
  const branchId = useBranchStore((s) => s.branchId);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      setLoading(true);
      try {
        const me = await fetchMe();
        setUser(me, me.permissions ?? []);
        if (!branchId && me.branches?.[0]?.id) {
          setBranchId(me.branches[0].id);
        }
        return me;
      } catch {
        if (isStaffAuthBypassEnabled()) {
          return applyDemoStaffSession(setUser, setBranchId, branchId);
        }
        clear();
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (me) => {
      setUser(me, me.permissions ?? []);
      if (me.branches?.[0]?.id) setBranchId(me.branches[0].id);
    },
    onError: () => {
      if (isStaffAuthBypassEnabled()) {
        applyDemoStaffSession(setUser, setBranchId, branchId);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      clear();
      setBranchId(null);
    },
  });

  return {
    user: user ?? meQuery.data ?? null,
    isLoading: isLoading && meQuery.isLoading,
    isAuthenticated: Boolean(user ?? meQuery.data),
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    refetch: meQuery.refetch,
  };
}
