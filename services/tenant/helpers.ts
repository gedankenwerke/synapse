import type { Tenant } from "./types";

/**
 * Returns true if the given tenant has any child tenants (i.e., is a Senior tenant).
 */
export function isSeniorTenant(tenant: Tenant, allTenants: Tenant[]): boolean {
  return allTenants.some((t) => t.ParentID === tenant.ID);
}

/**
 * Returns the list of Agent tenant IDs that belong to the given Senior tenant.
 */
export function getAgentTenantIds(parentTenantId: string, allTenants: Tenant[]): string[] {
  return allTenants
    .filter((t) => t.ParentID === parentTenantId)
    .map((t) => t.ID);
}

/**
 * Returns the list of tenant IDs visible to the current user.
 * - Senior tenant user: own tenant + all Agent tenants under it
 * - Agent tenant user: only own tenant
 * - SuperAdmin: all tenants
 */
export function getVisibleTenantIds(
  currentTenantId: string,
  allTenants: Tenant[],
  isSuperAdmin: boolean
): string[] {
  if (isSuperAdmin) return allTenants.map((t) => t.ID);
  const agentIds = getAgentTenantIds(currentTenantId, allTenants);
  return [currentTenantId, ...agentIds];
}