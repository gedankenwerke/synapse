"use client";

import { useTranslations } from "next-intl";
import { Group, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

interface TenantsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddTenant: () => void;
}

export function TenantsToolbar({
  searchValue,
  onSearchChange,
  onAddTenant,
}: TenantsToolbarProps) {
  const t = useTranslations("userManagement.tenants");

  return (
    <Group justify="space-between" mb="md">
      <TextInput
        placeholder={t("searchPlaceholder")}
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        w={280}
      />

      <Button leftSection={<IconPlus size={16} />} onClick={onAddTenant}>
        {t("addTenant")}
      </Button>
    </Group>
  );
}