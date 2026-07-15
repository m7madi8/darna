import { create } from "zustand";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  permissions: string[];
  setUser: (user: User | null, permissions?: string[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
  can: (permission: string) => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  permissions: [],
  setUser: (user, permissions = []) =>
    set({ user, permissions, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, permissions: [], isLoading: false }),
  can: (permission) => {
    const perms = get().permissions;
    return perms.includes("*") || perms.includes(permission);
  },
}));
