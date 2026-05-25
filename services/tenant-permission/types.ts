export interface TenantPermission {
  ID: string;
  RoleID: string;
  Action: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TenantPermissionCreateRequest {
  action: string;
  role_id: string;
}

export interface TenantPermissionUpdateRequest {
  action?: string;
}