import httpClient from "@/libs/axios";
import { Tenant, TenantCreateRequest, TenantUpdateRequest, ApiTenant, mapApiTenant } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenant = {
  list: async (): Promise<Tenant[]> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenant[]>>(
      "/api/v1/tenants"
    );
    const data = (response as unknown as ResponseWrapper<ApiTenant[]>).data;
    return data.map(mapApiTenant);
  },

  get: async (id: string): Promise<Tenant> => {
    const response = await httpClient.get<ResponseWrapper<ApiTenant>>(
      `/api/v1/tenants/${id}`
    );
    return mapApiTenant((response as unknown as ResponseWrapper<ApiTenant>).data);
  },

  create: async (payload: TenantCreateRequest): Promise<Tenant> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenant>>(
      "/api/v1/tenants",
      payload
    );
    return mapApiTenant((response as unknown as ResponseWrapper<ApiTenant>).data);
  },

  update: async (id: string, payload: TenantUpdateRequest): Promise<Tenant> => {
    const response = await httpClient.put<ResponseWrapper<ApiTenant>>(
      `/api/v1/tenants/${id}`,
      payload
    );
    return mapApiTenant((response as unknown as ResponseWrapper<ApiTenant>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenants/${id}`);
  },
};
