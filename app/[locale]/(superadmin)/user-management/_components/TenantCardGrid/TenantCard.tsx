"use client";

import { useTranslations } from "next-intl";
import { Card, Text, Badge, Group } from "@mantine/core";
import type { Tenant } from "@/services/tenant/types";

interface TenantCardProps {
  tenant: Tenant;
  userCount: number;
  parentName: string | null;
  isSelected: boolean;
  onClick: () => void;
}

export function TenantCard({
  tenant,
  userCount,
  parentName,
  isSelected,
  onClick,
}: TenantCardProps) {
  const t = useTranslations("userManagement");

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      role="button"
      tabIndex={0}
      style={{
        cursor: "pointer",
        borderColor: isSelected ? "var(--mantine-primary-color-filled)" : undefined,
        borderWidth: isSelected ? 2 : 1,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="lg">
          {tenant.Name}
        </Text>
        <Badge variant="light" color="orange" size="sm">
          {t("tenantUsers", { count: userCount })}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {parentName
          ? t("parentTenant", { name: parentName })
          : t("rootTenant")}
      </Text>
    </Card>
  );
}