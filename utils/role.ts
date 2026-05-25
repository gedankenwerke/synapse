import type { LoginRequestUser } from "@/services/authentication/types";
import type { Tenant } from "@/services/tenant/types";

export type UserRole = "superadmin" | "senior" | "agent";

export function deriveRole(user: LoginRequestUser | null, tenants: Tenant[]): UserRole {
  if (!user) return "agent";
  if (user.tenant_id === "1") return "superadmin";
  const myTenant = tenants.find((t) => t.ID === user.tenant_id);
  if (!myTenant) return user.tenant_id === "1" ? "superadmin" : "agent";
  const hasChildren = tenants.some((t) => t.ParentID === myTenant.ID);
  return hasChildren ? "senior" : "agent";
}

export function getHomePath(role: UserRole): string {
  switch (role) {
    case "superadmin":
      return "/superadmin";
    case "senior":
      return "/senior";
    case "agent":
      return "/agent";
  }
}