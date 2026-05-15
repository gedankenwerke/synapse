import httpClient from "../libs/axios";
import { TenantRole, TenantRoleCreateRequest, TenantRoleUpdateRequest } from "./tenant-role.types";
import { ResponseWrapper } from "../types/response";

export const tenantRole = {
  list: async (): Promise<TenantRole[]> => {
    const response = await httpClient.get<ResponseWrapper<TenantRole[]>>(
      "/api/v1/tenant-roles"
    );
    return (response as unknown as ResponseWrapper<TenantRole[]>).data;
  },

  get: async (id: number): Promise<TenantRole> => {
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

  update: async (id: number, payload: TenantRoleUpdateRequest): Promise<TenantRole> => {
    const response = await httpClient.put<ResponseWrapper<TenantRole>>(
      `/api/v1/tenant-roles/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantRole>).data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${id}`);
  },
};