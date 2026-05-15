import httpClient from "@/libs/axios";
import { BankStatementRequest, BankStatementPage, ApiBankStatementPage, mapApiBankStatementPage } from "./types";
import { ResponseWrapper } from "@/types/response";

export const accountStatement = {
  fetchPage: async (payload: BankStatementRequest): Promise<BankStatementPage> => {
    const response = await httpClient.post<ResponseWrapper<ApiBankStatementPage>>(
      "/api/v1/search-bank-statement",
      payload
    );
    return mapApiBankStatementPage((response as unknown as ResponseWrapper<ApiBankStatementPage>).data);
  },
};