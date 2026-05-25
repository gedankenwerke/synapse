import httpClient from "@/libs/axios";
import { LoginRequestBody, LoginRequestResponse, RefreshTokenRequest, TokenResponse, MeResponse } from './types';
import { ResponseWrapper } from '@/types/response';

export const authentication = {
    login: async (payload: LoginRequestBody): Promise<ResponseWrapper<LoginRequestResponse>> => {
        const response = await httpClient.post<ResponseWrapper<LoginRequestResponse>>('/api/v1/login', payload);
        return response as unknown as ResponseWrapper<LoginRequestResponse>;
    },

    me: async (): Promise<ResponseWrapper<MeResponse>> => {
        const response = await httpClient.post<ResponseWrapper<MeResponse>>('/api/v1/me');
        return response as unknown as ResponseWrapper<MeResponse>;
    },

    token: async (): Promise<ResponseWrapper<TokenResponse>> => {
        const response = await httpClient.get<ResponseWrapper<TokenResponse>>('/api/v1/token');
        return response as unknown as ResponseWrapper<TokenResponse>;
    },

    refresh: async (payload: RefreshTokenRequest): Promise<ResponseWrapper<TokenResponse>> => {
        const response = await httpClient.post<ResponseWrapper<TokenResponse>>('/api/v1/token/refresh', payload);
        return response as unknown as ResponseWrapper<TokenResponse>;
    },
};