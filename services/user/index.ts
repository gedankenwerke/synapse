import httpClient from "@/libs/axios";
import type {
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  User,
  PaginatedUserResponse,
} from "./types";
import { ResponseWrapper } from "@/types/response";

export const userService = {
  list: async (params: UserListParams): Promise<PaginatedUserResponse> => {
    const response = await httpClient.get<unknown>("/api/v1/users", {
      params,
    });
    return (response as unknown as ResponseWrapper<PaginatedUserResponse>).data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get<unknown>(`/api/v1/users/${id}`);
    return (response as unknown as ResponseWrapper<User>).data;
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await httpClient.post<unknown>("/api/v1/users", data);
    return (response as unknown as ResponseWrapper<User>).data;
  },

  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await httpClient.put<unknown>(
      `/api/v1/users/${id}`,
      data
    );
    return (response as unknown as ResponseWrapper<User>).data;
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/users/${id}`);
  },
};