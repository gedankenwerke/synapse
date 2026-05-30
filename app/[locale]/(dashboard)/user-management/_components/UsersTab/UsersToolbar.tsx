"use client";

import { useTranslations } from "next-intl";
import { Group, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { ActionGuard } from "@/components/ActionGuard";

interface UserToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
}

export function UserToolbar({
  searchValue,
  onSearchChange,
  onAddUser,
}: UserToolbarProps) {
  const t = useTranslations("userManagement");

  return (
    <Group justify="space-between" mb="md">
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