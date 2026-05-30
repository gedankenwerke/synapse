import httpClient from "@/libs/axios";
import { Tenant, TenantCreateRequest, TenantUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenant = {
  list: async (): Promise<Tenant[]> => {
    const response = await httpClient.get<ResponseWrapper<{ Items: Tenant[] }>>(
      "/api/v1/tenants"
    );
    const data = (response as unknown as ResponseWrapper<{ Items: Tenant[] } | Tenant[]>).data;
    // API returns { Items: Tenant[] } — handle both wrapped and direct array shapes
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray((data as { Items: Tenant[] }).Items)) {
      return (data as { Items: Tenant[] }).Items;
    }
    console.warn("[tenant.list] Unexpected response data shape:", typeof data, data);
    return [];
  },

  get: async (id: string): Promise<Tenant> => {
    const response = await httpClient.get<ResponseWrapper<Tenant>>(
      `/api/v1/tenants/${id}`
    );
    return (response as unknown as ResponseWrapper<Tenant>).data;
  },

  create: async (payload: TenantCreateRequest): Promise<Tenant> => {
    const response = await httpClient.post<ResponseWrapper<Tenant>>(
      "/api/v1/tenants",
      payload
    );
    return (response as unknown as ResponseWrapper<Tenant>).data;
  },

  update: async (id: string, payload: TenantUpdateRequest): Promise<Tenant> => {
    const response = await httpClient.put<ResponseWrapper<Tenant>>(
      `/api/v1/tenants/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<Tenant>).data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenants/${id}`);
  },
};