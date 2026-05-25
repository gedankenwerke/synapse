export interface TenantUser {
  ID: string;
  TenantID: string;
  TenantRoleID: string;
  UserID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TenantUserCreateRequest {
  tenant_id: string;
  user_id: string;
  tenant_role_id: string;
}

export interface TenantUserUpdateRequest {
  tenant_role_id?: string;
}