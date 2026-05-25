import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const baseRequest = axios.create({
    baseURL: '',
    withCredentials: false,
});

baseRequest.interceptors.request.use((config) => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

function processQueue(token: string | null, error: unknown = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token) {
            resolve(token);
        } else {
            reject(error);
        }
    });
    failedQueue = [];
}

baseRequest.interceptors.response.use(
    (response) => { return response.data },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const serverData = error.response?.data as Record<string, unknown> | undefined;

        if (status === 401 && originalRequest && !originalRequest._retry) {
            // Don't try to refresh if the failing request is auth-related
            if (
                originalRequest.url === '/api/v1/token/refresh' ||
                originalRequest.url === '/api/v1/token' ||
                originalRequest.url === '/api/v1/login'
            ) {
                return Promise.reject({
                    message: (serverData as any)?.message || error.message || 'Authentication failed',
                    code: error.code,
                    status,
                    serverData,
                });
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (newToken: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            resolve(baseRequest(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Use raw axios (no interceptors) to avoid infinite loop
                const response = await axios.post('/api/v1/token/refresh', {
                    refresh_token: refreshToken,
                });

                const data = response.data?.data || response.data;
                const newAccessToken = data?.access_token;
                const newRefreshToken = data?.refresh_token;

                if (newAccessToken) {
                    Cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
                        path: '/',
                        expires: 7,
                        sameSite: 'Strict',
                    });

                    if (newRefreshToken) {
                        Cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
                            path: '/',
                            expires: 7,
                            sameSite: 'Strict',
                        });
                    }

                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: newAccessToken }));
                    }

                    processQueue(newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return baseRequest(originalRequest);
                } else {
                    processQueue(null, error);
                    return Promise.reject({
                        message: 'Token refresh failed',
                        code: error.code,
                        status,
                        serverData,
                    });
                }
            } catch (refreshError) {
                processQueue(null, refreshError);
                Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/' });
                Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/' });
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('token-refresh-failed'));
                }
                return Promise.reject({
                    message: 'Session expired. Please log in again.',
                    code: error.code,
                    status: 401,
                    serverData,
                });
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject({
            message: (serverData as any)?.message || error.message || 'An unknown error occurred',
            code: error.code,
            status: error.response?.status,
            serverData,
        });
    }
);

export default baseRequest;