export interface Tenant {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantCreateRequest {
  name: string;
  description?: string;
}

export interface TenantUpdateRequest {
  name?: string;
  description?: string;
}