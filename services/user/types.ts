export interface User {
  id: string;
  username: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  ID: string;
  Username: string;
  TenantID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ApiPaginatedUserResponse {
  Items: ApiUser[];
  Total: number;
  Limit: number;
  Before: string;
  After: string;
}

export interface PaginatedUserResponse {
  items: User[];
  total: number;
  limit: number;
  before: string;
  after: string;
}

export interface UserListParams {
  before?: string;
  after?: string;
  limit?: number;
  username?: string;
  tenant_id?: string;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  tenant_id: string;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  tenant_id?: string;
}

export interface DeleteUserResponse {
  deleted: number;
}

export interface UserData {
  id: string;
  username: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  assignments: AssignmentData[];
}

export interface AssignmentData {
  id: string;
  tenantId: string;
  tenantName: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

function mapApiUser(api: ApiUser): User {
  return {
    id: api.ID,
    username: api.Username,
    tenant_id: api.TenantID,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export function mapApiUserToUserData(user: User): UserData {
  return {
    id: user.id,
    username: user.username,
    tenantId: user.tenant_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    assignments: [],
  };
}

export function mapApiPaginatedResponse(api: ApiPaginatedUserResponse): PaginatedUserResponse {
  return {
    items: api.Items.map(mapApiUser),
    total: api.Total,
    limit: api.Limit,
    before: api.Before,
    after: api.After,
  };
}