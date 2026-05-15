export interface TenantPermission {
  id: number;
  name: string;
  action: string;
  tenant_id: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantPermissionCreateRequest {
  name: string;
  action: string;
  tenant_id: number;
  description?: string;
}

export interface TenantPermissionUpdateRequest {
  name?: string;
  action?: string;
  description?: string;
}