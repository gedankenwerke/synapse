import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName, POLICY_CATALOG } from "../services/policy/types";
import { tenantUser } from "../services/tenant-user";
import { tenantPermission } from "../services/tenant-permission";
import { useAppStore } from "./useAppStore";

// Maps each page (PolicyName) to the action(s) that grant access.
// A user can see a page if they have at least one of the listed actions.
// If a page is not in this map, it requires SuperAdminOnly or explicit action check.
const PAGE_ACTION_MAP: Partial<Record<PolicyName, string[]>> = {
  SearchTransactionHistory: ["SearchTransactionHistory"],
  SearchBankStatement: ["SearchBankStatement"],
  SearchNetBalance: ["SearchNetBalance"],
  Settlement: ["Settlement"],
  CreatePayAgent: ["CreatePayAgent"],
  ListUsers: ["ListUsers"],
  ListPats: ["ListPats"],
  ListPolicies: ["ListPolicies"],
  ReloadPolicies: ["ReloadPolicies"],
};

interface PermissionState {
  policies: PolicyCatalogItem[];
  userActions: string[];
  userActionsByTenant: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;

  fetchPolicies: () => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
  hasAction: (action: string) => boolean;
  hasActionInTenant: (action: string, tenantId: string) => boolean;
  hasPermission: (name: PolicyName) => boolean;
  isSuperAdminOnly: (name: PolicyName) => boolean;
  canSeePage: (name: PolicyName) => boolean;
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  policies: [],
  userActions: [],
  userActionsByTenant: {},
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
    const { user, isSuperAdmin } = useAppStore.getState();

    // SuperAdmin bypasses permission checks entirely
    if (isSuperAdmin) {
      set({ userActions: [], userActionsByTenant: {} });
      return;
    }

    if (!user) {
      set({ userActions: [], userActionsByTenant: {} });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Step 1: Get the user's tenant-user assignments to find their roles
      const tenantUsers = await tenantUser.list({ user_id: user.id });

      const uniqueRoleIds = Array.from(
        new Set(tenantUsers.map((tu) => tu.tenantRoleID).filter(Boolean))
      );

      // Step 2: Fetch permissions for each role (new API: scoped under /tenant-roles/:id/permissions)
      const permissionsByRole = await Promise.all(
        uniqueRoleIds.map((roleId) =>
          tenantPermission.listByRole(roleId).then((perms) => ({ roleId, perms }))
        )
      );

      // Step 3: Merge all permissions across roles
      const allPermissions = permissionsByRole.flatMap((r) => r.perms);
      const uniqueActions = Array.from(new Set(allPermissions.map((p) => p.action)));

      // Step 4: Build tenant-scoped action map
      const actionsByTenant: Record<string, string[]> = {};
      for (const tu of tenantUsers) {
        const tenantId = tu.tenantID;
        const roleId = tu.tenantRoleID;
        const rolePerms = permissionsByRole.find((r) => r.roleId === roleId);
        const tenantActions = rolePerms ? rolePerms.perms.map((p) => p.action) : [];
        if (actionsByTenant[tenantId]) {
          actionsByTenant[tenantId] = Array.from(new Set([...actionsByTenant[tenantId], ...tenantActions]));
        } else {
          actionsByTenant[tenantId] = tenantActions;
        }
      }

      set({ userActions: uniqueActions, userActionsByTenant: actionsByTenant, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  hasAction: (action: string) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    return get().userActions.includes(action);
  },

  hasActionInTenant: (action: string, tenantId: string) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    const tenantActions = get().userActionsByTenant[tenantId] ?? [];
    return tenantActions.includes(action);
  },

  hasPermission: (name: PolicyName) => {
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    if (!policyItem) return false;

    if (policyItem.SuperAdminOnly) {
      return useAppStore.getState().isSuperAdmin;
    }
    return true;
  },

  isSuperAdminOnly: (name: PolicyName) => {
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    return policyItem?.SuperAdminOnly ?? false;
  },

  canSeePage: (name: PolicyName) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    // Use API policies if available, fall back to local POLICY_CATALOG
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name) ?? POLICY_CATALOG[name];
    // SuperAdminOnly policies are only visible to SuperAdmin
    if (policyItem?.SuperAdminOnly) return false;
    // For non-SuperAdmin pages, require at least one of the mapped actions
    const requiredActions = PAGE_ACTION_MAP[name];
    if (requiredActions) {
      return get().userActions.some((a) => requiredActions.includes(a));
    }
    // Pages not in the map but not SuperAdminOnly are visible
    if (policyItem) return true;
    return false;
  },
}));