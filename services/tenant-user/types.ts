export interface TenantUser {
  id: string;
  tenant_id: string;
  tenant_role_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTenantUser {
  ID: string;
  TenantID: string;
  TenantRoleID: string;
  UserID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export function mapApiTenantUser(api: ApiTenantUser): TenantUser {
  return {
    id: api.ID,
    tenant_id: api.TenantID,
    tenant_role_id: api.TenantRoleID,
    user_id: api.UserID,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export interface TenantUserCreateRequest {
  tenant_id: string;
  user_id: string;
  tenant_role_id: string;
}

export interface TenantUserUpdateRequest {
  tenant_role_id?: string;
}