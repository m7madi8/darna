"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Ban,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  Flame,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Map,
  Menu,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useBranchStore } from "@/store/branch-store";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/floor", label: "Floor", icon: Map },
  { href: "/timeline", label: "Timeline", icon: Clock3 },
  { href: "/waiting-list", label: "Waiting list", icon: ListOrdered },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/employees", label: "Employees", icon: UserRound },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/heatmap", label: "Heatmap", icon: Flame },
  { href: "/activity-log", label: "Activity", icon: Activity },
  { href: "/blacklist", label: "Blacklist", icon: Ban },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

const primaryMobile = nav.slice(0, 5);

function BranchSelect({
  className,
}: {
  className?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const branchId = useBranchStore((s) => s.branchId);
  const setBranchId = useBranchStore((s) => s.setBranchId);
  const branches = user?.branches ?? [];

  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        Branch
      </span>
      <div className="relative">
        <select
          className="h-11 w-full appearance-none rounded-xl border border-[color:var(--border)] bg-[color:var(--card-solid)] px-3 pr-8 text-base outline-none focus:ring-2 focus:ring-forest-500/25 sm:h-10 sm:text-sm"
          value={branchId ?? ""}
          onChange={(e) => setBranchId(e.target.value || null)}
        >
          <option value="" disabled>
            Select branch
          </option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
          {branches.length === 0 ? (
            <option value="placeholder">No branches loaded</option>
          ) : null}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
      </div>
    </label>
  );
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  async function signOut() {
    await logout();
    clear();
    router.replace("/login");
  }

  return (
    <div className="min-h-dvh overflow-x-hidden lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 hidden h-dvh flex-col border-r border-[color:var(--border)] bg-[color:var(--sidebar)] backdrop-blur-xl lg:flex">
        <div className="px-6 py-6">
          <BrandLogo href="/dashboard" size="sm" />
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
            Staff console
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "text-cream-200"
                    : "text-[color:var(--muted)] hover:bg-[color:var(--muted-bg)] hover:text-[color:var(--foreground)]"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="staff-nav-active"
                    className="absolute inset-0 rounded-xl bg-cream-200/10"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
                <Icon className="relative h-4 w-4" strokeWidth={1.75} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-[color:var(--border)] p-4">
          <BranchSelect />
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? "Staff"}</p>
              <p className="truncate text-xs text-[color:var(--muted)]">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" aria-label="Sign out" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 pb-[env(safe-area-inset-bottom)]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--background)]/90 px-3 py-2.5 backdrop-blur-xl pt-[max(0.625rem,env(safe-area-inset-top))] lg:hidden">
          <BrandLogo href="/dashboard" size="sm" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <div className="flex max-w-full flex-wrap gap-1.5 border-b border-[color:var(--border)] px-2 py-2 lg:hidden">
          {primaryMobile.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition",
                  active
                    ? "bg-cream-200/10 text-cream-200"
                    : "text-[color:var(--muted)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-[color:var(--muted)]"
          >
            More
          </button>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 bg-black/55"
                onClick={() => setMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
                className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-[color:var(--border)] bg-[color:var(--card-solid)] shadow-glow"
              >
                <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                  <p className="text-sm font-medium text-cream-200">Menu</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10"
                    aria-label="Close"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
                  {nav.map((item) => {
                    const active =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                          active
                            ? "bg-cream-200/10 text-cream-200"
                            : "text-[color:var(--muted)]"
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="space-y-3 border-t border-[color:var(--border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <BranchSelect />
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user?.name ?? "Staff"}</p>
                      <p className="truncate text-xs text-[color:var(--muted)]">{user?.email}</p>
                    </div>
                    <Button variant="ghost" size="sm" aria-label="Sign out" onClick={signOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
