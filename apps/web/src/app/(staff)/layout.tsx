"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { StaffShell } from "@/components/layout/staff-shell";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/use-auth";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10" dir="ltr" lang="en">
        <PageSkeleton />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div dir="ltr" lang="en">
      <StaffShell>{children}</StaffShell>
    </div>
  );
}
