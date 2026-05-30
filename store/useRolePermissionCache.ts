import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Role Permission Cache
 *
 * Problem: The API has no GET endpoint for reading a role's assigned permissions.
 * Non-superadmin users get 403 on /policies, /tenant-roles, /tenant-permissions.
 *
 * Solution: When superadmin fetches or assigns permissions, we cache the
 * role→actions mapping in localStorage. When non-superadmin logs in,
 * we read from this cache to determine what sidebar items to show.
 *
 * Cache miss → empty actions (safer than granting everything).
 * The backend enforces real permissions on every API call regardless.
 */

interface RolePermissionCacheState {
  /** Map of role ID → array of action strings */
  cache: Record<string, string[]>;

  /** Set actions for a specific role ID */
  setRoleActions: (roleId: string, actions: string[]) => void;

  /** Get actions for a specific role ID (returns [] if not cached) */
  getRoleActions: (roleId: string) => string[];

  /** Get actions for multiple role IDs (union of all) */
  getActionsForRoles: (roleIds: string[]) => string[];

  /** Clear the entire cache */
  clearCache: () => void;
}

export const useRolePermissionCache = create<RolePermissionCacheState>()(
  persist(
    (set, get) => ({
      cache: {},

      setRoleActions: (roleId, actions) =>
        set((state) => ({
          cache: { ...state.cache, [roleId]: actions },
        })),

      getRoleActions: (roleId) => get().cache[roleId] ?? [],

      getActionsForRoles: (roleIds) => {
        const { cache } = get();
        const allActions = new Set<string>();
        for (const roleId of roleIds) {
          const actions = cache[roleId];
          if (actions) {
            for (const action of actions) {
              allActions.add(action);
            }
          }
        }
        return Array.from(allActions);
      },

      clearCache: () => set({ cache: {} }),
    }),
    {
      name: "role-permission-cache",
    }
  )
);