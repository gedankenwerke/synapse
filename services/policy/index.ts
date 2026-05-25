import httpClient from "@/libs/axios";
import { PolicyCatalogItem, PolicyReloadResponse } from "./types";
import { ResponseWrapper } from "@/types/response";

interface PolicyListResponse {
  policy_catalog: PolicyCatalogItem[];
}

export const policy = {
  list: async (): Promise<PolicyCatalogItem[]> => {
    const response = await httpClient.get<ResponseWrapper<PolicyListResponse>>(
      "/api/v1/policies"
    );
    const data = (response as unknown as ResponseWrapper<PolicyListResponse>).data;
    // API may return { policy_catalog: [...] } nested or a flat array
    if (Array.isArray(data)) {
      return data as unknown as PolicyCatalogItem[];
    }
    const catalog = data?.policy_catalog;
    return Array.isArray(catalog) ? catalog : [];
  },

  reload: async (): Promise<PolicyReloadResponse> => {
    const response = await httpClient.post<ResponseWrapper<PolicyReloadResponse>>(
      "/api/v1/policies/reload"
    );
    return (response as unknown as ResponseWrapper<PolicyReloadResponse>).data;
  },
};