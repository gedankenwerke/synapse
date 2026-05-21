import httpClient from "@/libs/axios";
import { PolicyCatalogItem, PolicyReloadResponse } from "./types";
import { ResponseWrapper } from "@/types/response";

interface PolicyListResponse {
  policies: PolicyCatalogItem[];
}

export const policy = {
  list: async (): Promise<PolicyCatalogItem[]> => {
    const response = await httpClient.get<ResponseWrapper<PolicyListResponse>>(
      "/api/v1/policies"
    );
    return (response as unknown as ResponseWrapper<PolicyListResponse>).data.policies;
  },

  reload: async (): Promise<PolicyReloadResponse> => {
    const response = await httpClient.post<ResponseWrapper<PolicyReloadResponse>>(
      "/api/v1/policies/reload"
    );
    return (response as unknown as ResponseWrapper<PolicyReloadResponse>).data;
  },
};