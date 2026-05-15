export interface User {
  id: number;
  username: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
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
  tenant_id?: number;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  tenant_id: number;
}

export interface UpdateUserPayload {
  username: string;
  password?: string;
  tenant_id: number;
}

export interface DeleteUserResponse {
  deleted: number;
}

export interface UserData {
  id: string;
  username: string;
  tenantId: number;
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

export function mapApiUserToUserData(user: User): UserData {
  return {
    id: String(user.id),
    username: user.username,
    tenantId: user.tenant_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    assignments: [],
  };
}