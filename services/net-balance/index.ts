import httpClient from "@/libs/axios";
import { NetBalanceRequest, NetBalancePage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const netBalance = {
  fetchPage: async (payload: NetBalanceRequest): Promise<NetBalancePage> => {
    const response = await httpClient.post<ResponseWrapper<NetBalancePage>>(
      "/api/v1/search-net-balance",
      payload
    );
    return (response as unknown as ResponseWrapper<NetBalancePage>).data;
  },
};