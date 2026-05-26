"use client";

import { useTranslations } from "next-intl";
import { Card, Text, Badge, Group, ActionIcon } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Tenant } from "@/services/tenant/types";
import { ActionGuard } from "@/components/ActionGuard";

interface TenantCardProps {
  tenant: Tenant;
  userCount: number;
  parentName: string | null;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantCard({
  tenant,
  userCount,
  parentName,
  onEdit,
  onDelete,
}: TenantCardProps) {
  const t = useTranslations("userManagement");

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="lg">{tenant.Name}</Text>
        <Badge variant="light" color="orange" size="sm">
          {t("tenantUsers", { count: userCount })}
        </Badge>
      </Group>
      <Text size="sm" c="dimmed">
        {parentName
          ? t("parentTenant", { name: parentName })
          : t("rootTenant")}
      </Text>
      <Group justify="flex-end" mt="sm">
        <ActionGuard action="UpdateTenant">
          <ActionIcon variant="subtle" color="orange" onClick={() => onEdit(tenant)} aria-label="Edit tenant">
            <IconPencil size={16} />
          </ActionIcon>
        </ActionGuard>
        <ActionGuard action="DeleteTenant">
          <ActionIcon variant="subtle" color="red" onClick={() => onDelete(tenant)} aria-label="Delete tenant">
            <IconTrash size={16} />
          </ActionIcon>
        </ActionGuard>
      </Group>
    </Card>
  );
}