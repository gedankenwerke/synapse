import type { LoginRequestUser } from "@/services/authentication/types";
import type { Tenant } from "@/services/tenant/types";

export type UserRole = "superadmin" | "senior" | "agent";

export const SUPERADMIN_TENANT_ID = "1";
export const HOME_PATH = "/dashboard";

/** Build a tenant-scoped home path: /{tenantId}/dashboard */
export function tenantHomePath(tenantId: string): string {
  return `/${tenantId}/dashboard`;
}

export function deriveRole(user: LoginRequestUser | null, tenants: Tenant[] | undefined | null): UserRole {
  if (!user) return "agent";
  if (user.tenant_id === SUPERADMIN_TENANT_ID) return "superadmin";
  const safeTenants = Array.isArray(tenants) ? tenants : [];
  const myTenant = safeTenants.find((t) => t.ID === user.tenant_id);
  if (!myTenant) return "agent";
  const hasChildren = safeTenants.some((t) => t.ParentID === myTenant.ID);
  return hasChildren ? "senior" : "agent";
}