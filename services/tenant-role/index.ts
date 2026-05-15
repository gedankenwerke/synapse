import httpClient from "@/libs/axios";
import { TenantRole, TenantRoleCreateRequest, TenantRoleUpdateRequest, ApiTenantRole, mapApiTenantRole } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenantRole = {
  list: async (): Promise<TenantRole[]> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenantRole[]>>(
      "/api/v1/tenant-roles"
    );
    const data = (response as unknown as ResponseWrapper<ApiTenantRole[]>).data;
    return data.map(mapApiTenantRole);
  },

  get: async (id: string): Promise<TenantRole> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenantRole>>(
      `/api/v1/tenant-roles/${id}`
    );
    return mapApiTenantRole((response as unknown as ResponseWrapper<ApiTenantRole>).data);
  },

  create: async (payload: TenantRoleCreateRequest): Promise<TenantRole> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenantRole>>(
      "/api/v1/tenant-roles",
      payload
    );
    return mapApiTenantRole((response as unknown as ResponseWrapper<ApiTenantRole>).data);
  },

  update: async (id: string, payload: TenantRoleUpdateRequest): Promise<TenantRole> => {
    const response = await httpClient.put<ResponseWrapper<ApiTenantRole>>(
      `/api/v1/tenant-roles/${id}`,
      payload
    );
    return mapApiTenantRole((response as unknown as ResponseWrapper<ApiTenantRole>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${id}`);
  },
};
