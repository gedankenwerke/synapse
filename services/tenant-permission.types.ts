export interface TenantPermission {
  id: string;
  role_id: string;
  action: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTenantPermission {
  ID: string;
  RoleID: string;
  Action: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export function mapApiTenantPermission(api: ApiTenantPermission): TenantPermission {
  return {
    id: api.ID,
    role_id: api.RoleID,
    action: api.Action,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export interface TenantPermissionCreateRequest {
  action: string;
  role_id: string;
}

export interface TenantPermissionUpdateRequest {
  action?: string;
}