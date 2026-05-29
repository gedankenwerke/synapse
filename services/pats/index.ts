import httpClient from "@/libs/axios";
import { Pat, PatCreateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

// PATs endpoint returns snake_case (unlike entity endpoints which use PascalCase)
interface ApiPat {
  id: string;
  name: string;
  token_prefix: string;
  created_at: string;
  /** Only returned on creation */
  token?: string;
}

interface ApiPatListResponse {
  data: ApiPat[];
}

/** Map snake_case API response → camelCase frontend Pat */
function normalizePat(api: ApiPat): Pat {
  return {
    id: api.id,
    name: api.name,
    tokenPrefix: api.token_prefix,
    createdAt: api.created_at,
    token: api.token,
  };
}

export const patService = {
  list: async (): Promise<Pat[]> => {
    const response = await httpClient.get<ResponseWrapper<ApiPatListResponse>>(
      "/api/v1/pats"
    );
    const data = (response as unknown as ResponseWrapper<ApiPatListResponse>).data;
    return (data.data ?? []).map(normalizePat);
  },

  get: async (id: string): Promise<Pat> => {
    const response = await httpClient.get<ResponseWrapper<ApiPat>>(
      `/api/v1/pats/${id}`
    );
    return normalizePat((response as unknown as ResponseWrapper<ApiPat>).data);
  },

  create: async (payload: PatCreateRequest): Promise<Pat> => {
    const response = await httpClient.post<ResponseWrapper<ApiPat>>(
      "/api/v1/pats",
      payload
    );
    return normalizePat((response as unknown as ResponseWrapper<ApiPat>).data);
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/pats/${id}`);
  },
};