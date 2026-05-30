"use client";

import { Paper, Table, Text, Badge, ScrollArea, Skeleton, Center } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { DashboardTransaction } from "@/services/dashboard/types";
import { formatBaht } from "@/services/dashboard/types";

function TypeBadge({ type }: { type: DashboardTransaction["type"] }) {
  const t = useTranslations("type");
  if (type === "Deposit") {
    return (
      <Badge variant="light" color="green" leftSection={<IconArrowDown size={12} />}>
        {t("deposit")}
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="red" leftSection={<IconArrowUp size={12} />}>
      {t("withdrawal")}
    </Badge>
  );
}

function StatusBadge({ status }: { status: DashboardTransaction["status"] }) {
  const t = useTranslations("status");
  const colorMap: Record<DashboardTransaction["status"], string> = {
    Pending: "yellow",
    Completed: "green",
    Rejected: "red",
  };
  const keyMap: Record<DashboardTransaction["status"], string> = {
    Pending: "pending",
    Completed: "completed",
    Rejected: "rejected",
  };
  return (
    <Badge variant="light" color={colorMap[status]}>
      {t(keyMap[status])}
    </Badge>
  );
}

interface RecentTableProps {
  transactions: DashboardTransaction[];
  isLoading?: boolean;
}

export function RecentTable({ transactions, isLoading }: RecentTableProps) {
  const t = useTranslations("superadmin.recentTransactions");

  const rows = isLoading
    ? Array.from({ length: 5 }).map((_, i) => (
        <Table.Tr key={i}>
          <Table.Td>
            <Skeleton height={16} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={16} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={80} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={16} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={70} />
          </Table.Td>
        </Table.Tr>
      ))
    : transactions.map((txn) => (
        <Table.Tr key={txn.id}>
          <Table.Td>
            <Text size="sm" fw={500}>
              {txn.id}
            </Text>
          </Table.Td>
          <Table.Td>{txn.user}</Table.Td>
          <Table.Td>
            <TypeBadge type={txn.type} />
          </Table.Td>
          <Table.Td>{formatBaht(txn.amount)}</Table.Td>
          <Table.Td>
            <StatusBadge status={txn.status} />
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <Paper shadow="sm" p="md" radius="md">
      <Text fw={600} mb="sm">
        {t("title")}
      </Text>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("colTransactionId")}</Table.Th>
              <Table.Th>{t("colUser")}</Table.Th>
              <Table.Th>{t("colType")}</Table.Th>
              <Table.Th>{t("colAmount")}</Table.Th>
              <Table.Th>{t("colStatus")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isLoading && transactions.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="md">
                    <Text c="dimmed">{t("noData")}</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}