import httpClient from "@/libs/axios";
import { TransactionRequest, TransactionPage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const transaction = {
  fetchPage: async (payload: TransactionRequest): Promise<TransactionPage> => {
    const response = await httpClient.post<ResponseWrapper<TransactionPage>>(
      "/api/v1/search-transaction-history",
      payload
    );
    return (response as unknown as ResponseWrapper<TransactionPage>).data;
  },
};