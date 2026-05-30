import httpClient from "@/libs/axios";
import { TenantRole, TenantRoleCreateRequest, TenantRoleUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";
import { useRolePermissionCache } from "@/store/useRolePermissionCache";

export interface RolePermissionRecord {
  ID: string;
  RoleID: string;
  Action: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const tenantRole = {
  list: async (): Promise<TenantRole[]> => {
    const response = await httpClient.get<ResponseWrapper<TenantRole[]>>(
      "/api/v1/tenant-roles"
    );
    const data = (response as unknown as ResponseWrapper<TenantRole[]>).data;
    return Array.isArray(data) ? data : [];
  },

  get: async (id: string): Promise<TenantRole> => {
    const response = await httpClient.get<ResponseWrapper<TenantRole>>(
      `/api/v1/tenant-roles/${id}`
    );
    return (response as unknown as ResponseWrapper<TenantRole>).data;
  },

  create: async (payload: TenantRoleCreateRequest): Promise<TenantRole> => {
    const response = await httpClient.post<ResponseWrapper<TenantRole>>(
      "/api/v1/tenant-roles",
      payload
    );
    return (response as unknown as ResponseWrapper<TenantRole>).data;
  },

  update: async (id: string, payload: TenantRoleUpdateRequest): Promise<TenantRole> => {
    const response = await httpClient.put<ResponseWrapper<TenantRole>>(
      `/api/v1/tenant-roles/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantRole>).data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${id}`);
  },

  /**
   * Assign actions to a role.
   * Returns the assigned permission records.
   * Also updates the role permission cache.
   */
  assignPermissions: async (roleId: string, actions: string[]): Promise<RolePermissionRecord[]> => {
    const response = await httpClient.post<ResponseWrapper<RolePermissionRecord[]>>(
      `/api/v1/tenant-roles/${roleId}/permissions`,
      { actions }
    );
    const data = (response as unknown as ResponseWrapper<RolePermissionRecord[]>).data;
    const records = Array.isArray(data) ? data : [];

    // Update cache: merge new actions into existing cache for this role
    if (records.length > 0) {
      const cache = useRolePermissionCache.getState();
      const existing = cache.getRoleActions(roleId);
      const merged = Array.from(new Set([...existing, ...actions]));
      cache.setRoleActions(roleId, merged);
    }

    return records;
  },

  /**
   * Remove actions from a role.
   * Also updates the role permission cache.
   */
  deassignPermissions: async (roleId: string, actions: string[]): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${roleId}/permissions`, {
      data: { actions },
    });

    // Update cache: remove deassigned actions from cache for this role
    const cache = useRolePermissionCache.getState();
    const existing = cache.getRoleActions(roleId);
    const remaining = existing.filter((a) => !actions.includes(a));
    cache.setRoleActions(roleId, remaining);
  },
};