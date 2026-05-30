"use client";

import { Button, Group, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch, IconDownload, IconCalendar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface TransactionToolbarProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  startDate: Date | null;
  onStartChange: (value: Date | null) => void;
  endDate: Date | null;
  onEndChange: (value: Date | null) => void;
  onExport?: () => void;
}

export function TransactionToolbar({
  searchValue,
  onSearchValueChange,
  onSearch,
  startDate,
  onStartChange,
  endDate,
  onEndChange,
  onExport,
}: TransactionToolbarProps) {
  const t = useTranslations("transaction");
  const tc = useTranslations("common");

  return (
    <Group justify="space-between">
      <Group gap="md" align="flex-end">
        <TextInput
          placeholder={t("searchPlaceholder")}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          w={250}
        />
        <Button variant="default" onClick={onSearch}>
          {tc("search")}
        </Button>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mantine onChange type mismatch: runtime passes Date | null, types say string | null */}
        <DatePickerInput
          size="sm"
          leftSection={<IconCalendar size={16} />}
          label={tc("startDate")}
          placeholder={tc("startDate")}
          value={startDate}
          onChange={onStartChange as any}
          w={160}
          clearable
        />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mantine onChange type mismatch: runtime passes Date | null, types say string | null */}
        <DatePickerInput
          size="sm"
          leftSection={<IconCalendar size={16} />}
          label={tc("endDate")}
          placeholder={tc("endDate")}
          value={endDate}
          onChange={onEndChange as any}
          w={160}
          clearable
        />
      </Group>

      {onExport && (
        <Button variant="default" leftSection={<IconDownload size={16} />} onClick={onExport}>
          {tc("export")}
        </Button>
      )}
    </Group>
  );
}