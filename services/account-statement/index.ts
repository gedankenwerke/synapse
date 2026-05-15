import httpClient from "@/libs/axios";
import { BankStatementRequest, BankStatementPage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const accountStatement = {
  fetchPage: async (payload: BankStatementRequest): Promise<BankStatementPage> => {
    const response = await httpClient.post<ResponseWrapper<BankStatementPage>>(
      "/api/v1/search-bank-statement",
      payload
    );
    return (response as unknown as ResponseWrapper<BankStatementPage>).data;
  },
};