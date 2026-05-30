"use client";

import { useTranslations } from "next-intl";
import { SimpleGrid, Text, Center, Stack } from "@mantine/core";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
import type { Tenant } from "@/services/tenant/types";
import { TenantCard } from "./TenantCard";

interface TenantCardGridProps {
  tenants: Tenant[];
  tenantUserCounts: Map<string, number>;
  tenantMap: Map<string, string>;
  onSelectTenant: (tenantId: string) => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenant: Tenant) => void;
}

export function TenantCardGrid({
  tenants,
  tenantUserCounts,
  tenantMap,
  onSelectTenant,
  onEditTenant,
  onDeleteTenant,
}: TenantCardGridProps) {
  const t = useTranslations("userManagement");

  if (tenants.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="xs">
          <IconBuildingSkyscraper size={48} stroke={1} opacity={0.4} />
          <Text c="dimmed" size="lg">{t("noTenants")}</Text>
        </Stack>
      </Center>
    );
  }

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
          onClick={() => onSelectTenant(tenant.ID)}
          onEdit={onEditTenant}
          onDelete={onDeleteTenant}
        />
      ))}
    </SimpleGrid>
  );
}