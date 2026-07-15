import { create } from "zustand";
import { persist } from "zustand/middleware";

type BranchState = {
  branchId: string | null;
  setBranchId: (id: string | null) => void;
};

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branchId: null,
      setBranchId: (branchId) => {
        if (typeof window !== "undefined") {
          if (branchId) localStorage.setItem("darna_branch_id", branchId);
          else localStorage.removeItem("darna_branch_id");
        }
        set({ branchId });
      },
    }),
    { name: "darna-branch" }
  )
);

export function getActiveBranchId(): string | null {
  if (typeof window === "undefined") return null;
  return (
    useBranchStore.getState().branchId ??
    localStorage.getItem("darna_branch_id")
  );
}
