import httpClient from "../libs/axios";
import { TenantPermission, TenantPermissionCreateRequest, TenantPermissionUpdateRequest } from "./tenant-permission.types";
import { ResponseWrapper } from "../types/response";

export const tenantPermission = {
  list: async (): Promise<TenantPermission[]> => {
    const response = await httpClient.get<ResponseWrapper<TenantPermission[]>>(
      "/api/v1/tenant-permissions"
    );
    return (response as unknown as ResponseWrapper<TenantPermission[]>).data;
  },

  get: async (id: number): Promise<TenantPermission> => {
    const response = await httpClient.get<ResponseWrapper<TenantPermission>>(
      `/api/v1/tenant-permissions/${id}`
    );
    return (response as unknown as ResponseWrapper<TenantPermission>).data;
  },

  create: async (payload: TenantPermissionCreateRequest): Promise<TenantPermission> => {
    const response = await httpClient.post<ResponseWrapper<TenantPermission>>(
      "/api/v1/tenant-permissions",
      payload
    );
    return (response as unknown as ResponseWrapper<TenantPermission>).data;
  },

  update: async (id: number, payload: TenantPermissionUpdateRequest): Promise<TenantPermission> => {
    const response = await httpClient.put<ResponseWrapper<TenantPermission>>(
      `/api/v1/tenant-permissions/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantPermission>).data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-permissions/${id}`);
  },
};