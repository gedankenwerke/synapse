import httpClient from "@/libs/axios";
import type {
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  ApiPaginatedUserResponse,
  ApiUser,
  PaginatedUserResponse,
} from "./types";
import type { User } from "./types";
import { mapApiPaginatedResponse, mapApiUser } from "./types";
import { ResponseWrapper } from "@/types/response";

export const userService = {
  list: async (params: UserListParams): Promise<PaginatedUserResponse> => {
    const response = await httpClient.get<unknown>("/api/v1/users", {
      params,
    });
    const apiData = (response as unknown as ResponseWrapper<ApiPaginatedUserResponse>).data;
    if (!apiData) {
      return { items: [], total: 0, limit: 10, before: "", after: "" };
    }
    return mapApiPaginatedResponse(apiData);
  },

  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get<unknown>(`/api/v1/users/${id}`);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await httpClient.post<unknown>("/api/v1/users", data);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await httpClient.put<unknown>(`/api/v1/users/${id}`, data);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/users/${id}`);
  },
};
