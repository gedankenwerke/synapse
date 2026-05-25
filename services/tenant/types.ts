export interface Tenant {
  ID: string;
  ParentID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TenantCreateRequest {
  name: string;
  parent_id: string;
}

export interface TenantUpdateRequest {
  name?: string;
}