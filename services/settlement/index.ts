import httpClient from "@/libs/axios";
import { SettlementRequest, SettlementResponse } from "./types";
import { ResponseWrapper } from "@/types/response";

export const settlement = {
  create: async (payload: SettlementRequest): Promise<SettlementResponse> => {
    const response = await httpClient.post<ResponseWrapper<SettlementResponse>>(
      "/api/v1/settlement",
      payload
    );
    return (response as unknown as ResponseWrapper<SettlementResponse>).data;
  },
};