import httpClient from "../libs/axios";
import { Tenant, TenantCreateRequest, TenantUpdateRequest } from "./tenant.types";
import { ResponseWrapper } from "../types/response";

export const tenant = {
  list: async (): Promise<Tenant[]> => {
    const response = await httpClient.get<ResponseWrapper<Tenant[]>>(
      "/api/v1/tenants"
    );
    return (response as unknown as ResponseWrapper<Tenant[]>).data;
  },

  get: async (id: number): Promise<Tenant> => {
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

  update: async (id: number, payload: TenantUpdateRequest): Promise<Tenant> => {
    const response = await httpClient.put<ResponseWrapper<Tenant>>(
      `/api/v1/tenants/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<Tenant>).data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tenants/${id}`);
  },
};