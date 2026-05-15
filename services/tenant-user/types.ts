export interface TenantUser {
  id: number;
  user_id: number;
  tenant_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface TenantUserCreateRequest {
  user_id: number;
  tenant_id: number;
  role_id: number;
}

export interface TenantUserUpdateRequest {
  role_id?: number;
}