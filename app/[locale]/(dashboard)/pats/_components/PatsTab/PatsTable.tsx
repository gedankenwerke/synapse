"use client";

import {
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconTrash } from "@tabler/icons-react";
import type { Pat } from "@/services/pats/types";
import { ActionGuard } from "@/components/ActionGuard";

interface PatsTableProps {
  pats: Pat[];
  onDelete: (pat: Pat) => void;
}

export function PatsTable({ pats, onDelete }: PatsTableProps) {
  const t = useTranslations("pats");

  if (pats.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="xl">
        {t("noPats")}
      </Text>
    );
  }

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("columns.name")}</Table.Th>
            <Table.Th>{t("columns.prefix")}</Table.Th>
            <Table.Th>{t("columns.createdAt")}</Table.Th>
            <Table.Th>{t("columns.actions")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pats.map((pat) => (
            <Table.Tr key={pat.id}>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {pat.name}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color="grape" size="sm" ff="monospace">
                  {pat.tokenPrefix}…
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(pat.createdAt).toLocaleString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <ActionGuard action="DeletePat">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => onDelete(pat)}
                    aria-label="Delete PAT"
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </ActionGuard>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}