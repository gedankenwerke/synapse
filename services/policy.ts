import httpClient from "../libs/axios";
import { PolicyItem, PolicyReloadResponse } from "./policy.types";
import { ResponseWrapper } from "../types/response";

export const policy = {
  list: async (): Promise<PolicyItem[]> => {
    const response = await httpClient.get<ResponseWrapper<PolicyItem[]>>(
      "/api/v1/policies"
    );
    return (response as unknown as ResponseWrapper<PolicyItem[]>).data;
  },

  reload: async (): Promise<PolicyReloadResponse> => {
    const response = await httpClient.post<ResponseWrapper<PolicyReloadResponse>>(
      "/api/v1/policies/reload"
    );
    return (response as unknown as ResponseWrapper<PolicyReloadResponse>).data;
  },
};