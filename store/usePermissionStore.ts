import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName, POLICY_CATALOG } from "../services/policy/types";
import { tenantUser } from "../services/tenant-user";
import { tenantPermission } from "../services/tenant-permission";
import { useAppStore } from "./useAppStore";

interface PermissionState {
  policies: PolicyCatalogItem[];
  userActions: string[];
  isLoading: boolean;
  error: string | null;

  fetchPolicies: () => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  hasAction: (action: string) => boolean;
  hasPermission: (name: PolicyName) => boolean;
  isSuperAdminOnly: (name: PolicyName) => boolean;
  canSeePage: (name: PolicyName) => boolean;
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  policies: [],
  userActions: [],
  isLoading: false,
  error: null,

  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const policies = await policy.list();
      set({ policies, isLoading: false });
    } catch (err) {
      set({ policies: [], error: String(err), isLoading: false });
    }
  },

  fetchUserPermissions: async () => {
    const { user } = useAppStore.getState();

    if (!user) {
      set({ userActions: [] });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const tenantUsers = await tenantUser.list({ user_id: user.id });
      const roleIds = tenantUsers.map((tu) => tu.TenantRoleID);

      if (roleIds.length === 0) {
        set({ userActions: [], isLoading: false });
        return;
      }

      const allPermissions = await tenantPermission.list();
      const actions = allPermissions
        .filter((p) => roleIds.includes(p.RoleID))
        .map((p) => p.Action);

      const uniqueActions = Array.from(new Set(actions));

      set({ userActions: uniqueActions, isLoading: false });
    } catch (err) {
      set({ userActions: [], error: String(err), isLoading: false });
    }
  },

  refreshPermissions: async () => {
    const { fetchPolicies, fetchUserPermissions } = get();
    await fetchPolicies();
    await fetchUserPermissions();
  },

  hasAction: (action: string) => {
    const { isSuperAdmin } = useAppStore.getState();
    if (isSuperAdmin) return true;
    return get().userActions.includes(action);
  },

  hasPermission: (name: PolicyName) => {
    const { isSuperAdmin } = useAppStore.getState();
    if (isSuperAdmin) return true;
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    if (!policyItem) return false;

    if (policyItem.SuperAdminOnly) {
      return false;
    }
    return get().userActions.includes(name);
  },

  isSuperAdminOnly: (name: PolicyName) => {
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    return policyItem?.SuperAdminOnly ?? false;
  },

  canSeePage: (name: PolicyName) => {
    const { isSuperAdmin } = useAppStore.getState();
    if (isSuperAdmin) return true;
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name) ?? POLICY_CATALOG[name];
    if (!policyItem) return false;
    if (policyItem.SuperAdminOnly) return false;
    return get().userActions.includes(name);
  },
}));