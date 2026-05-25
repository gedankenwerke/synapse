"use client";

import {
  Table,
  Badge,
  ActionIcon,
  Group,
  UnstyledButton,
  Text,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconWallet,
  IconEye,
  IconArrowsSort,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getColumns } from "./columns";
import type { SettlementData } from "./mockData";
import { formatDate, formatBaht, formatBankDetails } from "./mockData";

interface SettlementTableProps {
  data: SettlementData[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onProcess: (settlement: SettlementData) => void;
  onViewDetails: (settlement: SettlementData) => void;
}

export function SettlementTable({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onProcess,
  onViewDetails,
}: SettlementTableProps) {
  const t = useTranslations("settlement");
  const ts = useTranslations("status");
  const tb = useTranslations("bank");

  const columns = getColumns(t);

  const rows = data.map((settlement) => (
    <Table.Tr key={settlement.id}>
      <Table.Td>{settlement.id}</Table.Td>
      <Table.Td>{formatDate(settlement.requestDate)}</Table.Td>
      <Table.Td>{settlement.userName}</Table.Td>
      <Table.Td>
        <Text size="sm">
          {formatBankDetails(tb(settlement.bankName.toLowerCase()), settlement.accountNumber)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={700}>
          {formatBaht(settlement.amount)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color={settlement.status === "Pending" ? "orange" : "green"}
          variant="light"
        >
          {ts(settlement.status.toLowerCase())}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          {settlement.status === "Pending" && (
            <Tooltip label={t("processPayout")}>
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={() => onProcess(settlement)}
                aria-label={t("processPayout")}
              >
                <IconWallet size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          {settlement.status === "Processed" && (
            <Tooltip label={t("viewSlip")}>
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => onViewDetails(settlement)}
                aria-label={t("viewSlip")}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>
                {col.sortable ? (
                  <UnstyledButton onClick={() => onSort(col.key)}>
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm" fw={500}>
                        {col.label}
                      </Text>
                      {sortColumn === col.key ? (
                        sortDirection === "asc" ? (
                          <IconArrowUp size={14} />
                        ) : (
                          <IconArrowDown size={14} />
                        )
                      ) : (
                        <IconArrowsSort size={14} opacity={0.3} />
                      )}
                    </Group>
                  </UnstyledButton>
                ) : (
                  <Text size="sm" fw={500}>
                    {col.label}
                  </Text>
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}