"use client";

import { useTranslations } from "next-intl";
import { Group, TextInput, Button, Text } from "@mantine/core";
import { IconArrowLeft, IconSearch, IconPlus } from "@tabler/icons-react";
import { ActionGuard } from "@/components/ActionGuard";

interface UserTableHeaderProps {
  tenantName: string;
  userCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBack?: () => void;
  onAddUser: () => void;
}

export function UserTableHeader({
  tenantName,
  userCount,
  searchValue,
  onSearchChange,
  onBack,
  onAddUser,
}: UserTableHeaderProps) {
  const t = useTranslations("userManagement");

  return (
    <Group justify="space-between" mb="md">
      <Group gap="sm">
        {onBack && (
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={onBack}
            size="xs"
          >
            {t("backToTenants")}
          </Button>
        )}
        <Text fw={600} size="lg">
          {tenantName}
        </Text>
        <Text c="dimmed" size="sm">
          {t("tenantUsers", { count: userCount })}
        </Text>
      </Group>

      <TextInput
        placeholder={t("searchPlaceholder")}
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        w={280}
      />

      <ActionGuard action="CreateUser">
        <Button leftSection={<IconPlus size={16} />} onClick={onAddUser}>
          {t("addUser")}
        </Button>
      </ActionGuard>
    </Group>
  );
}