import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const AUTH_COOKIE = 'auth_token';
const REFRESH_COOKIE = 'refresh_token';

const baseRequest = axios.create({
    baseURL: '',
    withCredentials: false,
});

baseRequest.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_COOKIE);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (tokens: { accessToken: string; refreshToken: string }) => void;
    reject: (error: unknown) => void;
}> = [];

function processQueue(tokens: { accessToken: string; refreshToken: string } | null, error: unknown = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (tokens) {
            resolve(tokens);
        } else {
            reject(error);
        }
    });
    failedQueue = [];
}

function setAuthCookies(accessToken: string, refreshToken: string) {
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const options: Cookies.CookieAttributes = {
        path: '/',
        expires: 7,
        sameSite: 'Strict',
        ...(isSecure && { secure: true }),
    };
    Cookies.set(AUTH_COOKIE, accessToken, options);
    Cookies.set(REFRESH_COOKIE, refreshToken, options);
}

function clearAuthCookies() {
    Cookies.remove(AUTH_COOKIE, { path: '/' });
    Cookies.remove(REFRESH_COOKIE, { path: '/' });
}

baseRequest.interceptors.response.use(
    (response) => { return response.data },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const serverData = error.response?.data as Record<string, unknown> | undefined;

        // If 401 and we haven't retried yet, try to refresh the token
        if (status === 401 && originalRequest && !originalRequest._retry) {
            // Don't try to refresh if the failing request IS the refresh or login endpoint
            if (originalRequest.url === '/api/v1/token/refresh' || originalRequest.url === '/api/v1/login' || originalRequest.url === '/api/v1/me') {
                return Promise.reject({
                    message: (serverData as any)?.message || error.message || 'Authentication failed',
                    code: error.code,
                    status,
                    serverData,
                });
            }

            if (isRefreshing) {
                // Queue up while another refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (tokens) => {
                            originalRequest.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
                            resolve(baseRequest(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use the refresh token to get a new access+refresh pair
                const refreshToken = Cookies.get(REFRESH_COOKIE);

                if (!refreshToken) {
                    // No refresh token available — force logout
                    clearAuthCookies();
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('token-refresh-failed'));
                    }
                    return Promise.reject({
                        message: 'Session expired. Please log in again.',
                        code: error.code,
                        status: 401,
                        serverData,
                    });
                }

                // Use raw axios (no interceptors) to avoid infinite loop
                const response = await axios.post('/api/v1/token/refresh', {
                    refresh_token: refreshToken,
                });

                const data = response.data?.data;
                const newAccessToken = data?.access_token;
                const newRefreshToken = data?.refresh_token;

                if (newAccessToken && newRefreshToken) {
                    setAuthCookies(newAccessToken, newRefreshToken);

                    // Dispatch a custom event so the store can update
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('token-refreshed', {
                            detail: { accessToken: newAccessToken, refreshToken: newRefreshToken },
                        }));
                    }

                    const tokens = { accessToken: newAccessToken, refreshToken: newRefreshToken };
                    processQueue(tokens);
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
                // Refresh failed — clear tokens and redirect to login
                clearAuthCookies();
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
    },
);

export default baseRequest;