"use client";

import { SimpleGrid } from "@mantine/core";
import type { Tenant } from "@/services/tenant/types";
import { TenantCard } from "./TenantCard";

interface TenantCardGridProps {
  tenants: Tenant[];
  tenantUserCounts: Map<string, number>;
  tenantMap: Map<string, string>;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenant: Tenant) => void;
}

export function TenantCardGrid({
  tenants,
  tenantUserCounts,
  tenantMap,
  onEditTenant,
  onDeleteTenant,
}: TenantCardGridProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {tenants.map((tenant) => (
        <TenantCard
          key={tenant.ID}
          tenant={tenant}
          userCount={tenantUserCounts.get(tenant.ID) ?? 0}
          parentName={
            tenant.ParentID ? (tenantMap.get(tenant.ParentID) ?? null) : null
          }
          onEdit={onEditTenant}
          onDelete={onDeleteTenant}
        />
      ))}
    </SimpleGrid>
  );
}