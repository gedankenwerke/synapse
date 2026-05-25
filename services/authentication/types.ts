export type LoginRequestBody = {
    username: string;
    password: string;
};

export type LoginRequestUser = {
    id: string;
    username: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
};

export type LoginRequestResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: LoginRequestUser;
};

export type TokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};

export type RefreshTokenRequest = {
    refresh_token: string;
};

export type MeResponse = {
    id: string;
    username: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
};