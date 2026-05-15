import httpClient from "../libs/axios";
import type {
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  ApiPaginatedUserResponse,
  PaginatedUserResponse,
} from "./user.types";
import { mapApiPaginatedResponse } from "./user.types";
import { ResponseWrapper } from "../types/response";
import type { User } from "./user.types";

export const userService = {
  list: async (params: UserListParams): Promise<PaginatedUserResponse> => {
    const response = await httpClient.get<unknown>("/api/v1/users", {
      params,
    });
    const apiData = (response as unknown as ResponseWrapper<ApiPaginatedUserResponse>).data;
    return mapApiPaginatedResponse(apiData);
  },

  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get<unknown>(`/api/v1/users/${id}`);
    const apiData = (response as unknown as ResponseWrapper<{ ID: string; Username: string; TenantID: string; CreatedAt: string; UpdatedAt: string }>).data;
    return {
      id: apiData.ID,
      username: apiData.Username,
      tenant_id: apiData.TenantID,
      created_at: apiData.CreatedAt,
      updated_at: apiData.UpdatedAt,
    };
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await httpClient.post<unknown>("/api/v1/users", data);
    const apiData = (response as unknown as ResponseWrapper<{ ID: string; Username: string; TenantID: string; CreatedAt: string; UpdatedAt: string }>).data;
    return {
      id: apiData.ID,
      username: apiData.Username,
      tenant_id: apiData.TenantID,
      created_at: apiData.CreatedAt,
      updated_at: apiData.UpdatedAt,
    };
  },

  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await httpClient.put<unknown>(`/api/v1/users/${id}`, data);
    const apiData = (response as unknown as ResponseWrapper<{ ID: string; Username: string; TenantID: string; CreatedAt: string; UpdatedAt: string }>).data;
    return {
      id: apiData.ID,
      username: apiData.Username,
      tenant_id: apiData.TenantID,
      created_at: apiData.CreatedAt,
      updated_at: apiData.UpdatedAt,
    };
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/users/${id}`);
  },
};