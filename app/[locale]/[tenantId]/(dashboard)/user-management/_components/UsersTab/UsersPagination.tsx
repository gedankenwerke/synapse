"use client";

import { useTranslations } from "next-intl";
import { Group, Text, Button } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface UserPaginationProps {
  totalItems: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function UserPagination({
  totalItems,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UserPaginationProps) {
  const t = useTranslations("userManagement");

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        {t("pagination.totalItems", { total: totalItems })}
      </Text>
      <Button
        variant="default"
        size="xs"
        rightSection={<IconChevronRight size={14} />}
        disabled={!hasNextPage}
        loading={isFetchingNextPage}
        onClick={fetchNextPage}
      >
        {t("pagination.next")}
      </Button>
    </Group>
  );
}