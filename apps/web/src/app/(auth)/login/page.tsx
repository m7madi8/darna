"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/use-auth";
import {
  DEMO_BRANCH_ID,
  DEMO_STAFF_PERMISSIONS,
  DEMO_STAFF_USER,
  isStaffAuthBypassEnabled,
} from "@/lib/demo-staff";
import { useAuthStore } from "@/store/auth-store";
import { useBranchStore } from "@/store/branch-store";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

function enterDemoStaff() {
  useAuthStore.getState().setUser(DEMO_STAFF_USER, DEMO_STAFF_PERMISSIONS);
  useBranchStore.getState().setBranchId(DEMO_BRANCH_ID);
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const { login, isLoggingIn, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const bypass = isStaffAuthBypassEnabled();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(next);
      return;
    }
    // Preview: skip login and open staff console immediately
    if (!isLoading && !isAuthenticated && bypass) {
      enterDemoStaff();
      router.replace(next);
    }
  }, [bypass, isAuthenticated, isLoading, next, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "reception@darna.test", password: "password" },
  });

  function enterWithoutLogin() {
    enterDemoStaff();
    router.replace(next);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        setError(null);
        try {
          await login(values);
          router.replace(next);
        } catch {
          if (bypass) {
            enterWithoutLogin();
            return;
          }
          setError("Invalid credentials or session could not be established.");
        }
      })}
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" loading={isLoggingIn}>
        Sign in
      </Button>
      {bypass ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={enterWithoutLogin}
        >
          Enter staff console (skip login)
        </Button>
      ) : null}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div
      dir="ltr"
      lang="en"
      className="relative flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-atmosphere-green" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(36rem,100%)] -translate-x-1/2 rounded-full bg-cream-200/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo href="/" size="lg" />
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Staff access to the reservation floor
          </p>
        </div>

        <Card>
          <CardContent>
            <Suspense
              fallback={
                <div className="h-40 animate-pulse rounded-xl bg-[color:var(--muted-bg)]" />
              }
            >
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
