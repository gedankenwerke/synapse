import httpClient from "@/libs/axios";
import { TenantPermission, TenantPermissionCreateRequest, TenantPermissionUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenantPermission = {
  list: async (): Promise<TenantPermission[]> => {
    const response = await httpClient.get<ResponseWrapper<TenantPermission[]>>(
      "/api/v1/tenant-permissions"
    );
    const data = (response as unknown as ResponseWrapper<TenantPermission[]>).data;
    return Array.isArray(data) ? data : [];
  },

  get: async (id: string): Promise<TenantPermission> => {
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

  update: async (id: string, payload: TenantPermissionUpdateRequest): Promise<TenantPermission> => {
    const response = await httpClient.put<ResponseWrapper<TenantPermission>>(
      `/api/v1/tenant-permissions/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantPermission>).data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-permissions/${id}`);
  },
};