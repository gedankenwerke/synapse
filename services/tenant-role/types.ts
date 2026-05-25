export interface TenantRole {
  ID: string;
  TenantID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TenantRoleCreateRequest {
  name: string;
  tenant_id: string;
}

export interface TenantRoleUpdateRequest {
  name?: string;
  tenant_id?: string;
}
