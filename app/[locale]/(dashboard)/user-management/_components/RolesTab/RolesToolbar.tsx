"use client";

import { useTranslations } from "next-intl";
import { Group, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

interface RolesToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddRole: () => void;
}

export function RolesToolbar({
  searchValue,
  onSearchChange,
  onAddRole,
}: RolesToolbarProps) {
  const t = useTranslations("userManagement.roles");

  return (
    <Group justify="space-between" mb="md">
      <TextInput
        placeholder={t("searchPlaceholder")}
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        w={280}
      />

      <Button leftSection={<IconPlus size={16} />} onClick={onAddRole}>
        {t("addRole")}
      </Button>
    </Group>
  );
}