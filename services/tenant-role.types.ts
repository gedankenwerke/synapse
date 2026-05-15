export interface TenantRole {
  id: string;
  name: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTenantRole {
  ID: string;
  TenantID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export function mapApiTenantRole(api: ApiTenantRole): TenantRole {
  return {
    id: api.ID,
    name: api.Name,
    tenant_id: api.TenantID,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export interface TenantRoleCreateRequest {
  name: string;
  tenant_id: string;
}

export interface TenantRoleUpdateRequest {
  name?: string;
  tenant_id?: string;
}