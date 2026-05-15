import httpClient from "../libs/axios";
import { PayAgentRequest, PayAgentResponse } from "./pay-agent.types";
import { ResponseWrapper } from "../types/response";

export const payAgent = {
  create: async (payload: PayAgentRequest): Promise<PayAgentResponse> => {
    const response = await httpClient.post<ResponseWrapper<PayAgentResponse>>(
      "/api/v1/add-pay-agent",
      payload
    );
    return (response as unknown as ResponseWrapper<PayAgentResponse>).data;
  },
};