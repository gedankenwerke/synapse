import httpClient from "@/libs/axios";
import { TenantPermission, AssignPermissionsRequest, DeassignPermissionsRequest, ApiTenantPermission, mapApiTenantPermission } from "./types";
import { ResponseWrapper } from "@/types/response";

export const tenantPermission = {
  list: async (roleId: string): Promise<TenantPermission[]> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenantPermission[]>>(
      `/api/v1/tenant-roles/${roleId}/permissions`,
      { actions: [] }
    );
    const data = (response as unknown as ResponseWrapper<ApiTenantPermission[]>).data;
    return data.map(mapApiTenantPermission);
  },

  assign: async (roleId: string, payload: AssignPermissionsRequest): Promise<TenantPermission[]> => {
    const response = await httpClient.post<ResponseWrapper<ApiTenantPermission[]>>(
      `/api/v1/tenant-roles/${roleId}/permissions`,
      payload
    );
    const data = (response as unknown as ResponseWrapper<ApiTenantPermission[]>).data;
    return data.map(mapApiTenantPermission);
  },

  deassign: async (roleId: string, payload: DeassignPermissionsRequest): Promise<number> => {
    const response = await httpClient.delete<ResponseWrapper<number>>(
      `/api/v1/tenant-roles/${roleId}/permissions`,
      { data: payload }
    );
    return (response as unknown as ResponseWrapper<number>).data;
  },
};