import httpClient from "@/libs/axios";
import { TenantUser, TenantUserCreateRequest, TenantUserUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenantUser = {
  list: async (params?: { tenant_id?: string; user_id?: string }): Promise<TenantUser[]> => {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.set("tenant_id", params.tenant_id);
    if (params?.user_id) query.set("user_id", params.user_id);
    const qs = query.toString();
    const url = qs ? `/api/v1/tenant-users?${qs}` : "/api/v1/tenant-users";
    const response = await httpClient.get<ResponseWrapper<TenantUser[]>>(url);
    return (response as unknown as ResponseWrapper<TenantUser[]>).data;
  },

  get: async (id: string): Promise<TenantUser> => {
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

  update: async (id: string, payload: TenantUserUpdateRequest): Promise<TenantUser> => {
    const response = await httpClient.put<ResponseWrapper<TenantUser>>(
      `/api/v1/tenant-users/${id}`,
      payload
    );
    return (response as unknown as ResponseWrapper<TenantUser>).data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-users/${id}`);
  },
};