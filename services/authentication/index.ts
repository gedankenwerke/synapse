import httpClient from "@/libs/axios";
import { LoginRequestBody, LoginRequestResponse, RefreshTokenResponse } from './types';
import { ResponseWrapper } from '@/types/response';

export const authentication = {
    login: async (payload: LoginRequestBody): Promise<ResponseWrapper<LoginRequestResponse>> => {
        const response = await httpClient.post<ResponseWrapper<LoginRequestResponse>>('/api/v1/login', payload);
        return response as unknown as ResponseWrapper<LoginRequestResponse>;
    },

    me: async (): Promise<boolean> => {
        await httpClient.post('/api/v1/me');
        return true;
    },

    refresh: async (): Promise<RefreshTokenResponse> => {
        const response = await httpClient.get<ResponseWrapper<RefreshTokenResponse>>('/api/v1/token');
        return (response as unknown as ResponseWrapper<RefreshTokenResponse>).data;
    },
};
