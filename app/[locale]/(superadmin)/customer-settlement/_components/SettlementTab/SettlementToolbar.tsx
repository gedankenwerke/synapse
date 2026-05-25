"use client";

import { Button, Group, TextInput, Select } from "@mantine/core";
import { IconSearch, IconFilter, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { STATUS_OPTIONS } from "./mockData";

interface SettlementToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
  onAddSettlement: () => void;
}

export function SettlementToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddSettlement,
}: SettlementToolbarProps) {
  const t = useTranslations("settlement");
  const ts = useTranslations("status");

  const statusData = STATUS_OPTIONS.map((status) => ({
    value: status,
    label: status === "All" ? t("allStatus") : ts(status.toLowerCase()),
  }));

  return (
    <Group justify="space-between" mb="md">
      <Group gap="xs">
        <TextInput
          placeholder={t("searchPlaceholder")}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          w={280}
        />
        <Select
          placeholder={t("allStatus")}
          leftSection={<IconFilter size={16} />}
          data={statusData}
          value={statusFilter}
          onChange={onStatusFilterChange}
          w={160}
          clearable
        />
      </Group>
      <Button leftSection={<IconPlus size={16} />} onClick={onAddSettlement}>
        {t("addSettlement")}
      </Button>
    </Group>
  );
}