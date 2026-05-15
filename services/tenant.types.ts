export interface Tenant {
  id: string;
  name: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTenant {
  ID: string;
  ParentID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export function mapApiTenant(api: ApiTenant): Tenant {
  return {
    id: api.ID,
    name: api.Name,
    parent_id: api.ParentID,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export interface TenantCreateRequest {
  name: string;
  parent_id: string;
}

export interface TenantUpdateRequest {
  name?: string;
}