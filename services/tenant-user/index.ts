import httpClient from "@/libs/axios";
import { TenantUser, TenantUserCreateRequest, TenantUserRoleChangeRequest, ApiTenantUser, mapApiTenantUser } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenantUser = {
  list: async (params?: { tenant_id?: string; user_id?: string }): Promise<TenantUser[]> => {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.set("tenant_id", params.tenant_id);
    if (params?.user_id) query.set("user_id", params.user_id);
    const qs = query.toString();
    const url = qs ? `/api/v1/tenant-users?${qs}` : "/api/v1/tenant-users";
    const response = await httpClient.get<ResponseWrapper<ApiTenantUser[]>>(url);
    const data = (response as unknown as ResponseWrapper<ApiTenantUser[]>).data;
    return data.map(mapApiTenantUser);
  },

  create: async (payload: TenantUserCreateRequest): Promise<TenantUser> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenantUser>>(
      "/api/v1/tenant-users",
      payload
    );
    return mapApiTenantUser((response as unknown as ResponseWrapper<ApiTenantUser>).data);
  },

  changeRole: async (id: string, payload: TenantUserRoleChangeRequest): Promise<TenantUser> => {
    const response = await httpClient.put<ResponseWrapper<ApiTenantUser>>(
      `/api/v1/tenant-users/${id}/role`,
      payload
    );
    return mapApiTenantUser((response as unknown as ResponseWrapper<ApiTenantUser>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-users/${id}`);
  },
};
