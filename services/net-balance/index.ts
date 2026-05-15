import httpClient from "@/libs/axios";
import { NetBalanceRequest, NetBalancePage, ApiNetBalancePage, mapApiNetBalancePage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const netBalance = {
  fetchPage: async (payload: NetBalanceRequest): Promise<NetBalancePage> => {
    const response = await httpClient.post<ResponseWrapper<ApiNetBalancePage>>(
      "/api/v1/search-net-balance",
      payload
    );
    return mapApiNetBalancePage((response as unknown as ResponseWrapper<ApiNetBalancePage>).data);
  },
};