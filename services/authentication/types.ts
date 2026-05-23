export type UserRole = "superadmin" | "senior" | "user";

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
    role?: UserRole;
};

export type LoginRequestResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: LoginRequestUser;
};

export type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
};