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
    isSuperAdmin: boolean;
};

export type LoginRequestResponse = {
    token: string;
    user: LoginRequestUser;
};

export type RefreshTokenResponse = {
    token: string;
};