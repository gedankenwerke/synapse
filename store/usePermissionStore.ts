import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName } from "../services/policy/types";
import { tenantUser } from "../services/tenant-user";
import { tenantPermission } from "../services/tenant-permission";
import { useAppStore, getLayer, isSuperAdmin } from "./useAppStore";
import type { NavItem } from "../components/sidebars/types";
import { SUPERADMIN_NAV_ITEMS } from "../components/sidebars/superadminNav";
import { SENIOR_NAV_ITEMS } from "../components/sidebars/seniorNav";
import { USER_NAV_ITEMS } from "../components/sidebars/userNav";

interface PermissionState {
  policies: PolicyCatalogItem[];
  userActions: string[];
  isLoading: boolean;
  error: string | null;

  fetchPolicies: () => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
  refreshAll: () => Promise<void>;
  hasAction: (action: string) => boolean;
  hasPermission: (name: PolicyName) => boolean;
  isSuperAdminOnly: (name: PolicyName) => boolean;
  canSeePage: (name: PolicyName) => boolean;
  getNavItems: () => NavItem[];
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
      set({ error: String(err), isLoading: false });
    }
  },

  fetchUserPermissions: async () => {
    const { user } = useAppStore.getState();

    // SuperAdmin bypasses permission checks entirely
    if (isSuperAdmin()) {
      set({ userActions: [] });
      return;
    }

    if (!user) {
      set({ userActions: [] });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Step 1: Get the current user's TenantUser records
      const tenantUsers = await tenantUser.list({ user_id: user.id });
      const roleIds = tenantUsers.map((tu) => tu.tenant_role_id);

      if (roleIds.length === 0) {
        set({ userActions: [], isLoading: false });
        return;
      }

      // Step 2: Get permissions for each role the user has
      const permissionPromises = roleIds.map((roleId) =>
        tenantPermission.list(roleId)
      );
      const permissionResults = await Promise.all(permissionPromises);
      const actions = permissionResults
        .flat()
        .map((p) => p.action);

      // Deduplicate
      const uniqueActions = Array.from(new Set(actions));

      set({ userActions: uniqueActions, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  refreshAll: async () => {
    await Promise.all([
      get().fetchPolicies(),
      get().fetchUserPermissions(),
    ]);
  },

  hasAction: (action: string) => {
    if (isSuperAdmin()) return true;
    return get().userActions.includes(action);
  },

  hasPermission: (name: PolicyName) => {
    const { policies } = get();
    const policyItem = policies.find((p) => p.name === name);
    if (!policyItem) return false;

    if (policyItem.superadmin_only) {
      return isSuperAdmin();
    }
    return true;
  },

  isSuperAdminOnly: (name: PolicyName) => {
    const { policies } = get();
    const policyItem = policies.find((p) => p.name === name);
    return policyItem?.superadmin_only ?? false;
  },

  canSeePage: (name: PolicyName) => {
    if (isSuperAdmin()) return true;
    const { policies } = get();
    const policyItem = policies.find((p) => p.name === name);
    // superadmin_only policies are only visible to SuperAdmin (already handled above)
    if (policyItem?.superadmin_only) return false;
    // All other pages are visible to any authenticated user
    return true;
  },

  getNavItems: () => {
    const layer = getLayer();
    if (layer === "superadmin") return SUPERADMIN_NAV_ITEMS;
    if (layer === "senior") return SENIOR_NAV_ITEMS;
    // user layer: filter by RBAC actions
    return USER_NAV_ITEMS.filter((item) => {
      if (!item.requiredAction) return true;
      return get().hasAction(item.requiredAction);
    });
  },
}));