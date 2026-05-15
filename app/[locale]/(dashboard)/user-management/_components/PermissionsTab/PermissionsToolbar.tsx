"use client";

import { useTranslations } from "next-intl";
import { Group, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

interface PermissionsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddPermission: () => void;
}

export function PermissionsToolbar({
  searchValue,
  onSearchChange,
  onAddPermission,
}: PermissionsToolbarProps) {
  const t = useTranslations("userManagement.permissions");

  return (
    <Group justify="space-between" mb="md">
      <TextInput
        placeholder={t("searchPlaceholder")}
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        w={280}
      />

      <Button leftSection={<IconPlus size={16} />} onClick={onAddPermission}>
        {t("addPermission")}
      </Button>
    </Group>
  );
}