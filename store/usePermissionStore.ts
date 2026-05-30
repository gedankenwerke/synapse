import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName, POLICY_CATALOG } from "../services/policy/types";
import { tenantUser } from "../services/tenant-user";
import { tenantPermission } from "../services/tenant-permission";
import { useAppStore } from "./useAppStore";
import { useRolePermissionCache } from "./useRolePermissionCache";

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

/** Build a PolicyCatalogItem array from the local POLICY_CATALOG */
function localPolicies(): PolicyCatalogItem[] {
  return Object.entries(POLICY_CATALOG).map(([Name, val]) => ({
    Name,
    Detail: val.Detail,
    SuperAdminOnly: val.SuperAdminOnly,
  }));
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  policies: [],
  userActions: [],
  isLoading: true,
  error: null,

  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const policies = await policy.list();
      set({ policies, isLoading: false });
    } catch (err: any) {
      // Non-superadmin gets 403 from /policies — fall back to local catalog
      if (err?.status === 403 || err?.response?.status === 403) {
        set({ policies: localPolicies(), isLoading: false });
      } else {
        set({ policies: localPolicies(), error: String(err), isLoading: false });
      }
    }
  },

  fetchUserPermissions: async () => {
    const { user, isSuperAdmin } = useAppStore.getState();

    if (!user) {
      set({ userActions: [], isLoading: false });
      return;
    }

    // Superadmin bypasses all permission checks
    if (isSuperAdmin) {
      set({ userActions: Object.keys(POLICY_CATALOG), isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    // Step 1: Get the user's role assignments via tenant-users
    let roleIds: string[] = [];
    try {
      const tenantUsers = await tenantUser.list({ user_id: user.id });
      roleIds = tenantUsers.map((tu) => tu.TenantRoleID);
    } catch {
      // Non-superadmin may get 403; continue without role IDs
    }

    if (roleIds.length === 0) {
      // No role assignments found or accessible — canSeePage will show minimum pages
      set({ userActions: [], isLoading: false });
      return;
    }

    // Step 2: Check cache first (fast, no network)
    const cachedActions = useRolePermissionCache.getState().getActionsForRoles(roleIds);
    if (cachedActions.length > 0) {
      set({ userActions: cachedActions, isLoading: false });
      return;
    }

    // Step 3: Try to fetch all tenant permissions and seed the cache
    try {
      const allPermissions = await tenantPermission.list();
      if (Array.isArray(allPermissions) && allPermissions.length > 0) {
        useRolePermissionCache.getState().seedFromPermissions(allPermissions);
        const actions = useRolePermissionCache.getState().getActionsForRoles(roleIds);
        set({ userActions: actions, isLoading: false });
        return;
      }
    } catch {
      // 403 or other error; fall through to empty default
    }

    // Step 4: No permissions accessible — canSeePage will show minimum pages
    set({ userActions: [], isLoading: false });
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
    // During loading or when permissions couldn't be resolved, hide all pages
    // Dashboard is always accessible via the sidebar (handled separately)
    if (get().isLoading || get().userActions.length === 0) {
      return false;
    }
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name) ?? POLICY_CATALOG[name];
    if (!policyItem) return false;
    if (policyItem.SuperAdminOnly) return false;
    return get().userActions.includes(name);
  },
}));