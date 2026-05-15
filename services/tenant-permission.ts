import httpClient from "../libs/axios";
import { TenantPermission, TenantPermissionCreateRequest, TenantPermissionUpdateRequest, ApiTenantPermission, mapApiTenantPermission } from "./tenant-permission.types";
import { ResponseWrapper } from "../types/response";

export const tenantPermission = {
  list: async (): Promise<TenantPermission[]> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenantPermission[]>>(
      "/api/v1/tenant-permissions"
    );
    const data = (response as unknown as ResponseWrapper<ApiTenantPermission[]>).data;
    return data.map(mapApiTenantPermission);
  },

  get: async (id: string): Promise<TenantPermission> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenantPermission>>(
      `/api/v1/tenant-permissions/${id}`
    );
    return mapApiTenantPermission((response as unknown as ResponseWrapper<ApiTenantPermission>).data);
  },

  create: async (payload: TenantPermissionCreateRequest): Promise<TenantPermission> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenantPermission>>(
      "/api/v1/tenant-permissions",
      payload
    );
    return mapApiTenantPermission((response as unknown as ResponseWrapper<ApiTenantPermission>).data);
  },

  update: async (id: string, payload: TenantPermissionUpdateRequest): Promise<TenantPermission> => {
    const response = await httpClient.put<ResponseWrapper<ApiTenantPermission>>(
      `/api/v1/tenant-permissions/${id}`,
      payload
    );
    return mapApiTenantPermission((response as unknown as ResponseWrapper<ApiTenantPermission>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-permissions/${id}`);
  },
};