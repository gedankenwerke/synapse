import httpClient from "@/libs/axios";
import { LoginRequestBody, LoginRequestResponse, LoginRequestUser, RefreshTokenResponse } from './types';
import { ResponseWrapper } from '@/types/response';
import axios from 'axios';

export const authentication = {
    login: async (payload: LoginRequestBody): Promise<ResponseWrapper<LoginRequestResponse>> => {
        const response = await httpClient.post<ResponseWrapper<LoginRequestResponse>>('/api/v1/login', payload);
        return response as unknown as ResponseWrapper<LoginRequestResponse>;
    },

    me: async (): Promise<ResponseWrapper<LoginRequestUser>> => {
        const response = await httpClient.post<ResponseWrapper<LoginRequestUser>>('/api/v1/me');
        return response as unknown as ResponseWrapper<LoginRequestUser>;
    },

    refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await axios.post<ResponseWrapper<RefreshTokenResponse>>('/api/v1/token/refresh', {
            refresh_token: refreshToken,
        });
        return (response.data as ResponseWrapper<RefreshTokenResponse>).data;
    },

    rotateToken: async (): Promise<RefreshTokenResponse> => {
        const response = await httpClient.get<ResponseWrapper<RefreshTokenResponse>>('/api/v1/token');
        return (response as unknown as ResponseWrapper<RefreshTokenResponse>).data;
    },
};