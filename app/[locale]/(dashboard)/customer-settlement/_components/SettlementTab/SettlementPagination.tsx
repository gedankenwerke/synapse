"use client";

import { Group, Pagination, Select, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

interface SettlementPaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (value: string | null) => void;
}

export function SettlementPagination({
  totalItems,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: SettlementPaginationProps) {
  const tc = useTranslations("common");

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <Group justify="space-between" mt="md">
      <Group gap="xs">
        <Select
          data={["5", "10", "20", "50"]}
          value={String(rowsPerPage)}
          onChange={onRowsPerPageChange}
          w={70}
          size="sm"
        />
        <Text size="sm" c="dimmed">
          {tc("pagination.items", { start, end, total: totalItems })}
        </Text>
      </Group>

      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={onPageChange}
        withEdges
        size="sm"
      />
    </Group>
  );
}