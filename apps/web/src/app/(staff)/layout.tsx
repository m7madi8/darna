"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { StaffShell } from "@/components/layout/staff-shell";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/use-auth";
import {
  DEMO_BRANCH_ID,
  DEMO_STAFF_PERMISSIONS,
  DEMO_STAFF_USER,
  isStaffAuthBypassEnabled,
} from "@/lib/demo-staff";
import { useAuthStore } from "@/store/auth-store";
import { useBranchStore } from "@/store/branch-store";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const bypass = isStaffAuthBypassEnabled();

  // Instant preview session — skip login gate entirely
  useEffect(() => {
    if (!bypass) return;
    const store = useAuthStore.getState();
    if (!store.user) {
      store.setUser(DEMO_STAFF_USER, DEMO_STAFF_PERMISSIONS);
    }
    if (!useBranchStore.getState().branchId) {
      useBranchStore.getState().setBranchId(DEMO_BRANCH_ID);
    }
  }, [bypass]);

  useEffect(() => {
    if (bypass) return;
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/dashboard");
    }
  }, [bypass, isAuthenticated, isLoading, router]);

  const previewUser = bypass
    ? user ?? DEMO_STAFF_USER
    : user;

  if (!bypass && isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10" dir="ltr" lang="en">
        <PageSkeleton />
      </div>
    );
  }

  if (!previewUser) {
    return null;
  }

  return (
    <StaffShell>{children}</StaffShell>
  );
}
