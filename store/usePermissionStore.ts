import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName } from "../services/policy/types";
import { useAppStore } from "./useAppStore";

interface PermissionState {
  policies: PolicyCatalogItem[];
  isLoading: boolean;
  error: string | null;

  fetchPolicies: () => Promise<void>;
  hasPermission: (name: PolicyName) => boolean;
  isSuperAdminOnly: (name: PolicyName) => boolean;
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  policies: [],
  isLoading: false,
  error: null,

  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const policies = await policy.list();
      set({ policies, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  hasPermission: (name: PolicyName) => {
    const { policies } = get();
    const policyItem = policies.find((p) => p.Name === name);
    if (!policyItem) return false;

    if (policyItem.SuperAdminOnly) {
      return useAppStore.getState().isSuperAdmin;
    }
    return true;
  },

  isSuperAdminOnly: (name: PolicyName) => {
    const { policies } = get();
    const policyItem = policies.find((p) => p.Name === name);
    return policyItem?.SuperAdminOnly ?? false;
  },
}));