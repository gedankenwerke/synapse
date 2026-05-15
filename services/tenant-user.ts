import httpClient from "../libs/axios";
import { TenantUser, TenantUserCreateRequest, TenantUserUpdateRequest } from "./tenant-user.types";
import { ResponseWrapper } from "../types/response";

export const tenantUser = {
  list: async (): Promise<TenantUser[]> => {
    const response = await httpClient.get<ResponseWrapper<TenantUser[]>>(
      "/api/v1/tenant-users"
    );
    return (response as unknown as ResponseWrapper<TenantUser[]>).data;
  },

  get: async (id: number): Promise<TenantUser> => {
    const response = await httpClient.get<ResponseWrapper<TenantUser>>(
      `/api/v1/tenant-users/${id}`
    );
    return (response as unknown as ResponseWrapper<TenantUser>).data;
  },

  create: async (payload: TenantUserCreateRequest): Promise<TenantUser> => {
    const response = await httpClient.post<ResponseWrapper<TenantUser>>(
      "/api/v1/tenant-users",
      payload
    );
    return (response as unknown as ResponseWrapper<TenantUser>).data;
  },

  update: async (id: number, payload: TenantUserUpdateRequest): Promise<TenantUser> => {
    const response = await httpClient.put<ResponseWrapper<TenantUser>>(
      `/api/v1/tenant-users/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantUser>).data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-users/${id}`);
  },
};