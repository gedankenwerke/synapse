import httpClient from "@/libs/axios";
import { TransactionRequest, TransactionPage, ApiTransactionPage, mapApiTransactionPage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const transaction = {
  fetchPage: async (payload: TransactionRequest): Promise<TransactionPage> => {
    const response = await httpClient.post<ResponseWrapper<ApiTransactionPage>>(
      "/api/v1/search-transaction-history",
      payload
    );
    return mapApiTransactionPage((response as unknown as ResponseWrapper<ApiTransactionPage>).data);
  },
};