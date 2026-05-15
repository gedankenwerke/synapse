export interface TenantRole {
  id: number;
  name: string;
  tenant_id: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantRoleCreateRequest {
  name: string;
  tenant_id: number;
  description?: string;
}

export interface TenantRoleUpdateRequest {
  name?: string;
  description?: string;
}